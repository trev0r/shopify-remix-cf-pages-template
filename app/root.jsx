import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";


import {
  AppBridgeProvider,
  PolarisProvider,
} from "./components";
import styles from '@shopify/polaris/build/esm/styles.css';
import { json } from "@remix-run/cloudflare";

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

//AppBridgeProvider needs this.
export const loader = async ({context}) => {
  return json({
		apiKey: context.SHOPIFY_APP_KEY,
	});
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <PolarisProvider>
          <AppBridgeProvider>
            <Outlet />
          </AppBridgeProvider>
        </PolarisProvider>
        <ScrollRestoration />
        <Scripts />
       
      </body>
    </html>
  );
}
