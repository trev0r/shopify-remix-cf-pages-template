import '@shopify/shopify-api/adapters/cf-worker';
import { shopifyApi } from '@shopify/shopify-api';
import { saveSession } from '../../session-storage';
import { createWebhookHandlers } from '../../webhooks';

export async function onRequest({request, env}) {
	const shopify = shopifyApi({
		apiKey: env.SHOPIFY_APP_KEY,
		apiSecretKey: env.SHOPIFY_APP_SECRET,
		scopes: env.SHOPIFY_APP_SCOPE.split(','),
		hostName: env.APP_HOSTNAME,
        isEmbeddedApp: true
	});
	
    const callback = await shopify.auth.callback({
        rawRequest: request,
    });
    
    await saveSession(env, callback.session);

    await shopify.webhooks.addHandlers(createWebhookHandlers({...env, shopify}));
    await shopify.webhooks.register({session: callback.session});

    const redirectURL = await shopify.auth.getEmbeddedAppUrl({
        rawRequest: request,
     });

    return new Response('', {
        status: 302,
        // Headers are of type [string, string][]
        headers: [...callback.headers, ['Location', redirectURL]],
    });
}