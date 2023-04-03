import '@shopify/shopify-api/adapters/cf-worker';
import * as build from "@remix-run/dev/server-build";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => {
    
    const shopify = shopifyApi({
      apiKey: context.env.SHOPIFY_APP_KEY,
      apiSecretKey: context.env.SHOPIFY_APP_SECRET,
      scopes: context.env.SHOPIFY_APP_SCOPE.split(','),
      hostName: context.env.APP_HOSTNAME,
      isEmbeddedApp: true,
      apiVersion: ApiVersion.January23
    });
    return {...context.env, shopify};
  }
});

export function onRequest(context) {
  return handleRequest(context);
}
