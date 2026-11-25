import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  absoluteUrl,
} from "@/config/site";

export const createMetadata = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  imageAlt,
  type = "website",
  keywords,
  noindex = false,
} = {}) => {
  const pageTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description,
    keywords,
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: pageTitle,
      description,
      url,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
      site: TWITTER_HANDLE || undefined,
    },
  };
};
