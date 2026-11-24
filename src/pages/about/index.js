import AboutContent from "@/components/AboutContent";
import Seo from "@/components/Seo";
import { ABOUT_FAQS } from "@/config/about";
import { absoluteUrl } from "@/config/site";

const ABOUT_DESCRIPTION =
  "Learn why Movies-Zone exists, how our movie discovery tools work, and find quick answers about filters, favorites, trailers and regional collections.";

const AboutPage = () => {
  return (
    <>
      <Seo
        title="About"
        description={ABOUT_DESCRIPTION}
        path="/about"
        keywords="about movies-zone, movie discovery, faq, film library"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": absoluteUrl("/about"),
              name: "About Movies-Zone",
              description: ABOUT_DESCRIPTION,
              url: absoluteUrl("/about"),
            },
            {
              "@type": "FAQPage",
              mainEntity: ABOUT_FAQS.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            },
          ],
        }}
      />
      <AboutContent />
    </>
  );
};

export default AboutPage;
