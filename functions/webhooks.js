import '@shopify/shopify-api/adapters/cf-worker';
import { shopifyApi } from '@shopify/shopify-api';
import { createWebhookHandlers } from '../webhooks';

export async function onRequest({request, env}) {
	const shopify = shopifyApi({
		apiKey: env.SHOPIFY_APP_KEY,
		apiSecretKey: env.SHOPIFY_APP_SECRET,
    	scopes: env.SHOPIFY_APP_SCOPE.split(','),
		hostName: env.APP_HOSTNAME,
	}); 

    shopify.webhooks.addHandlers(createWebhookHandlers({...env, shopify}));

    let response;
    const body = await request.text();
    try {
        response = await shopify.webhooks.process({
            rawBody: body,
            rawRequest: request,
        });
    }
    catch (error) {
        console.log(error.message);
        response = error.response;
    }
    return response;
}
	