import { redirect } from "@remix-run/cloudflare";

function redirectToAuth(context, request) {

    const { searchParams } = new URL(request.url);
    if (!searchParams.get('shop')) {
        throw new Response("No shop provided", { status: 500 });
    }

    if (searchParams.get("embedded") === "1") {
        clientSideRedirect(context, request, "/oauth/install");
    }
    const queryParams = new URLSearchParams({ shop: searchParams.get('shop') });
    throw redirect(`/oauth/install?${queryParams}`);
}


function clientSideRedirect(context, request, endpoint) {
    const { searchParams } = new URL(request.url);
    const { shopify } = context;
    const shop = shopify.utils.sanitizeShop(searchParams.get('shop'));
    const host = shopify.utils.sanitizeHost(searchParams.get('host'));
    const redirectUriParams = new URLSearchParams({ shop, host }).toString();
    const queryParams = new URLSearchParams({
        shop,
        host,
        redirectUri: `https://${shopify.config.hostName}${endpoint}?${redirectUriParams}`,
    }).toString();

    throw redirect(`/exitiframe?${queryParams}`);
}
async function validateRequest(context, request) {
    const { searchParams } = new URL(request.url);
    const { shopify } = context;
    const isValid = await shopify.utils.validateHmac(Object.fromEntries(searchParams.entries()));
    if (!isValid) {
        throw new Response('Could not verify request was from Shopify.', { status: 403 })
    }
}

export { validateRequest, redirectToAuth }