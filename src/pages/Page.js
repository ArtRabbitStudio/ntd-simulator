import React from 'react';
import Layout from 'layout/Layout';

import Head from 'pages/components/Head';

const Page = (props) => {

  return (
    <Layout>

      <Head
        title="This page could not be found"
        text={
          `404`
        }
      />

    </Layout>
  )
}
export default Page;
