# underkill-stack

People keep telling me ~~remix~~ react router is overkill for small projects, but this file tree says otherwise.

```yml
├── README.md
├── app
│   ├── root.tsx
│   ├── routes.ts
│   └── tailwind.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .vscode/settings.json # optional
```

- React Router (vite plugin)
- React 19
- Typescript
- Tailwind 4 (vite plugin)

In order for the React Router 7 Typescript plugin to work, you must configure your IDE to use the workspace version of typescript. We've included a .vscode/settings.json here that does that, but you may not need it if your IDE is already configured that way. 
