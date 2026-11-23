import "@/styles/globals.css";
import { Provider } from "react-redux";

import { store } from "@/store/store";
import Layout from "@/components/Layout";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Movies-Zone</title>
        <link
          rel="icon"
          href="/moviesZoneLogo.png"
          type="image/x-icon"
          sizes="any"
        />
        <meta name="theme-color" content="#04152d" />
      </Head>
      <Provider store={store}>
        <div className="overflow-x-container">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </Provider>
    </>
  );
}
