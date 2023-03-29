import React, { useState } from 'react'
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider, Page, LegacyCard, TextField } from '@shopify/polaris'



export default function Install() {
  const [storeUrl, setStoreUrl] = useState('');
  const onChange = (value) => {
    setStoreUrl(value)
  }
  return (
    <AppProvider i18n={enTranslations}>
    <Page title="Install">
      <LegacyCard 
      title="Let's get acquainted!" 
      sectioned 
      primaryFooterAction={{
        content: `Proceed to installation`, 
        disabled: !storeUrl.trim(), 
        onAction: () => window.location.href = `/oauth/install?shop=${encodeURIComponent(storeUrl)}`
      }}
      >
        <TextField value={storeUrl} suffix=".myshopify.com" label="What is your store's URL? " autoComplete="off" onChange={onChange} />
      </LegacyCard>
    </Page>
    </AppProvider>
  );
}