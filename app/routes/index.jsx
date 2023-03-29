import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import '@shopify/shopify-api/adapters/cf-worker';

import {shopifyApi, ApiVersion, Session} from '@shopify/shopify-api';
import {
  Layout,
  Page
} from '@shopify/polaris';

export const loader = async ({context, request}) => {
  const {searchParams} = new URL(request.url);


  // If no shop should redirect to the base non-embedded install page
  // If shop and authenticated and no host redirect to embedded app
  // 

  // If no isEmbedded flag AND user is authenticated should redirect to embedded app

  // If not authenticated should redirect to
 
  const shopify = shopifyApi({
		apiKey: context.SHOPIFY_APP_KEY,
		apiSecretKey: context.SHOPIFY_APP_SECRET,
		scopes: context.SHOPIFY_APP_SCOPE.split(','),
		hostName: context.APP_HOSTNAME,
    isEmbeddedApp: true
	});
  const shop = shopify.utils.sanitizeShop(searchParams.get('shop'), true);

  const isValid = await shopify.utils.validateHmac({hmac: searchParams.get('hmac'), timestamp: searchParams.get('timestamp')});
  console.log('hmac?', isValid);

  const sessionProperties = await context.SESSIONS.get(`offline_${shop}`, {type: 'json'});

  if (!sessionProperties){
    console.log('no session key found')
  }
  
  const session = Session.fromPropertyArray(sessionProperties);

  const client = new shopify.clients.Graphql({
    session: session,
    apiVersion: ApiVersion.January23,
  });

  const response = await client.query({data: `{
    shop {
      name
    }
    app {
      title
      installation {
        accessScopes {
          description
          handle
        }
      }
    }
  }`});
  return json(response.body);
}

export default function Index() {
  const { data } = useLoaderData();

  return (
    <Page title={data.app.title}>
      <Layout>
        Welcome {data.shop.name}
      </Layout>
    </Page>
  );
}
