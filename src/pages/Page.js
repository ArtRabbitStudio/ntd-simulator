import React from 'react';
import Layout from 'layout/Layout';

import Head from 'pages/components/Head';
import { useTranslation } from "react-i18next";

const Page = (props) => {
  const { t } = useTranslation();

  return (
    <Layout>

      <Head
        title={t('notFound')}
        text={
          `404`
        }
      />

    </Layout>
  )
}
export default Page;
