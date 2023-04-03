import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "../../session-storage";
import { redirectToAuth, validateRequest } from "../../helpers";
import {
  Layout,
  Page
} from '@shopify/polaris';
//import {createWebhookHandlers} from '../../webhooks';



const requireValidSession = async (context, request) => {
  const { searchParams } = new URL(request.url);

  await validateRequest(context, request);
  const shop = context.shopify.utils.sanitizeShop(searchParams.get('shop'));
  const session = await getSession(context, shop);

  if (!session){
    redirectToAuth(context, request);
  }
  return session;
}


export const loader = async ({ context, request }) => {
  const session = await requireValidSession(context, request);
  const client = new context.shopify.clients.Graphql({ session: session });

  const response = await client.query({
    data: `{
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
