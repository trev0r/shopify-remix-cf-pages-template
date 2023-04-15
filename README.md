# Shopify App with Remix and Cloudflare Pages

- [Remix Docs](https://remix.run/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)

## Development

1. run `npm run dev`, you will see `http://127.0.0.1:8788` in console
1. use [ngrok](https://ngrok.com/) to map port `8788`
1. create `.dev.vars` file under project root directory, fill in below content (`xxx`, `yyy`,`zzz` are placeholders). you may need to restart by running `npm run dev`
    ```
    # get SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET from your shopify app overview page, the corresponding names are: Client ID, Client secret
    SHOPIFY_APP_KEY=xxx
    SHOPIFY_APP_SECRET=yyy
    SHOPIFY_APP_SCOPE=read_orders,read_products,read_draft_orders
    # do not include protocol, e.g. https
    APP_HOSTNAME=zzz.ngrok-free.app
    ```
1. go to your shopify app setup page, in `URLs` section, fill in below content (`zzz` is a placeholder), save
    - `App URL`: `https://zzz.ngrok-free.app` (protocol is needed)
    - `Allowed redirection URL(s)`
        - `https://zzz.ngrok-free.app/oauth/install`
        - `https://zzz.ngrok-free.app/oauth/callback`
1. go to your shopify app overview page, click `Select store` to select a store to test your app.

## Deployment

> 1. You should seperate your development app and production app, use production app info
>
> 1. You can see logs by clicking `Begin log stream` under `<one specific deployment> / Functions / Real-time Logs`
>
> 1. You can see KV variable values by clicking `View` under `Workers / KV / <one specific namespace>`

1. create a [Cloudflare account](https://dash.cloudflare.com/sign-up/pages) if you don't have one.
1. go to dashboard after verifying your email address with Cloudflare
1. follow the [Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything), 2 things should be noticed:
    - set `Build command` to `npm run build`
    - set `Build output directory` to `public`
1. set environment variables under `Pages / <project name> / Settings / Environment variables`, you can set for `production` only
    ```
    # get SHOPIFY_APP_KEY, SHOPIFY_APP_SECRET from your shopify production app overview page, the corresponding names are: Client ID, Client secret
    SHOPIFY_APP_KEY=xxx
    SHOPIFY_APP_SECRET=yyy
    SHOPIFY_APP_SCOPE=read_orders,read_products,read_draft_orders
    # do not include protocol, e.g. https, use the domain (e.g. `https://zzz.pages.dev/`, `zzz` is a placeholder) Cloudflare gives to you (you can get the link by clicking `Visit site`), you may run into `500` error when APP_HOSTNAME is not correct
    APP_HOSTNAME
1. go to your shopify production app setup page, in `URLs` section, fill in below content (`zzz` is a placeholder), save
    - `App URL`: `https://zzz.pages.dev` (protocol is needed)
    - `Allowed redirection URL(s)`
        - `https://zzz.pages.dev/oauth/install`
        - `https://zzz.pages.dev/oauth/callback`
1. go to your shopify production app overview page, click `Select store` to select a store to test your app.
1. you still will encounter errors because of KV namespace does not exist, do below:
    - create a namespace `worker-SESSIONS` under `Workers / KV`
    - Add variable in `KV namespace bindings` section under `Pages / <project name> / Settings / Environment variables`, you can set for `production` only
        - set `Variable name` to `SESSIONS`
        - select `KV namespace` to `worker-SESSIONS` 
        - save
1. Go to `All deployments`, select the last `Production`, click `Retry deployment` (it means re-depoly) in `Manage deployment`