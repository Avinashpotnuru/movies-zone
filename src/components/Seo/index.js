import Head from "next/head";

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
  serializeJsonLd,
} from "@/config/site";

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  imageAlt,
  type = "website",
  keywords,
  noindex = false,
  jsonLd,
}) => {
  const pageTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const jsonLdString = jsonLd ? serializeJsonLd(jsonLd) : null;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      {imageAlt ? <meta property="og:image:alt" content={imageAlt} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {TWITTER_HANDLE ? (
        <meta name="twitter:site" content={TWITTER_HANDLE} />
      ) : null}

      {jsonLdString ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      ) : null}
    </Head>
  );
};

export default Seo;
