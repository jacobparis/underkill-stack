import { Links, Meta, Outlet, Scripts } from "@remix-run/react"
import "#app/tailwind.css"

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col items-center justify-center p-12">
          <h1 className="text-6xl font-bold ">Hello world!</h1>
        </div>
        <Outlet />

        <Scripts />
      </body>
    </html>
  )
}
