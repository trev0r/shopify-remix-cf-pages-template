import '@shopify/shopify-api/adapters/cf-worker';
import {shopifyApi} from '@shopify/shopify-api';

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
    
    const result = await env.SESSIONS.put(callback.session.id, JSON.stringify(callback.session.toPropertyArray()));
    console.log('id', callback.session.id, result);
    // You can now use callback.session to make API requests
    
    // The callback returns some HTTP headers, but you can redirect to any route here
    const redirectURL = await shopify.auth.getEmbeddedAppUrl({
        rawRequest: request,
     });

    return new Response('', {
        status: 302,
        // Headers are of type [string, string][]
        headers: [...callback.headers, ['Location', redirectURL]],
    });
}