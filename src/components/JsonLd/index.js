import { serializeJsonLd } from "@/config/site";

const JsonLd = ({ data }) => {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
};

export default JsonLd;
