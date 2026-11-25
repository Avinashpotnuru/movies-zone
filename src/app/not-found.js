import JsonLd from "@/components/JsonLd";
import NotFoundContent from "@/components/NotFoundContent";
import { createMetadata } from "@/config/metadata";
import { absoluteUrl } from "@/config/site";

const DESCRIPTION =
  "That Movies-Zone page is not in the archive. Search the library or take a curated detour.";

export const metadata = createMetadata({
  title: "Page not found",
  description: DESCRIPTION,
  path: "/404",
  noindex: true,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": absoluteUrl("/404"),
  name: "Movies-Zone page not found",
  description: DESCRIPTION,
  url: absoluteUrl("/404"),
};

export default function NotFound() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <NotFoundContent />
    </>
  );
}
