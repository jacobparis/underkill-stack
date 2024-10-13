import { Project } from "ts-morph";
import {
  mkdirSync,
  writeFileSync,
} from "fs";
import { getConfig, type BaseFunctionConfig } from "@vercel/static-config";
import type { Preset, ReactRouterConfig } from "@react-router/dev/vite";
import type { RouteConfig } from "@react-router/dev/routes";


function hashConfig(config: Record<string, unknown>): string {
  let str = JSON.stringify(config);
  return Buffer.from(str).toString("base64url");
}

function flattenAndSort(o: Record<string, unknown>) {
  let n: Record<string, unknown> = {};
  let keys: string[] = [];
  for (let key in o) keys.push(key);
  for (let key of keys.sort()) n[key] = o[key];
  return n;
}



export function vercelPreset(): Preset {
  let project = new Project();
  let routeConfigs = new Map<string, BaseFunctionConfig>();
  let bundleConfigs = new Map<string, BaseFunctionConfig>();

  function getRouteConfig(branch: RouteConfig[], index = branch.length - 1) {
    let route = branch[index];
    let config = routeConfigs.get(route.id);
    if (!config) {
      // @ts-expect-error TODO: figure out why TypeScript is complaining here…
      config = getConfig(project, route.file) || {};
      if (index > 0) {
        Object.setPrototypeOf(config, getRouteConfig(branch, index - 1));
      }
      routeConfigs.set(route.id, config);
    }
    return config;
  }

  async function createServerBundles(
    remixUserConfig: ReactRouterConfig
  ): Promise<ReactRouterConfig["serverBundles"]> {
    return ({ branch }) => {
      let config = getRouteConfig(branch);
      // Always set runtime to nodejs
      config.runtime = "nodejs";

      config = flattenAndSort(config);
      let id = `${config.runtime}-${hashConfig(config)}`;
      if (!bundleConfigs.has(id)) {
        bundleConfigs.set(id, config);
      }
      return id;
    };
  }

  let buildEnd: ReactRouterConfig["buildEnd"] = ({
    buildManifest,
    reactRouterConfig,
    viteConfig
  }) => {
    if (buildManifest?.serverBundles && bundleConfigs.size) {
      for (let bundle of Object.values(buildManifest.serverBundles)) {
        let bundleWithConfig = {
          ...bundle,
          config: bundleConfigs.get(bundle.id),
        };
        buildManifest.serverBundles[bundle.id] = bundleWithConfig;
      }
    }

    if (buildManifest?.routes && routeConfigs.size) {
      for (let route of Object.values(buildManifest.routes)) {
        let routeWithConfig = {
          ...route,
          config: routeConfigs.get(route.id),
        };
        buildManifest.routes[route.id] = routeWithConfig;
      }
    }

    let assetsDir = viteConfig?.build?.assetsDir;

    let json = JSON.stringify(
      {
        buildManifest,
        reactRouterConfig,
        viteConfig: assetsDir
          ? {
              build: {
                assetsDir,
              },
            }
          : undefined,
      },
      null,
      2
    );

    mkdirSync(".vercel", { recursive: true });
    writeFileSync(".vercel/remix-build-result.json", `${json}\n`);
  };

  return {
    name: "vercel",
    async reactRouterConfig({ reactRouterUserConfig }) {
      const serverBundles =
        reactRouterUserConfig.ssr !== false
          ? await createServerBundles(reactRouterUserConfig)
          : undefined;

      return {
        serverBundles,
        buildEnd,
      };
    },
  };
}
