import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { ChatDemo } from "@/components/site/ChatDemo";
import { Services, Process, Faq, Footer } from "@/components/site/Sections";
import { Work } from "@/components/site/Work";
import { Contact } from "@/components/site/Contact";
import { publishedProjectsQuery } from "@/lib/projects-query";
import { site } from "@/config/site";

const title = "Zelvan Labs | Chatbots, websites and web apps";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedProjectsQuery),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: site.description },
      { property: "og:title", content: title },
      { property: "og:description", content: site.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: site.description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          email: site.email,
          logo: `${site.url}/favicon.svg`,
          description: site.description,
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a href="#main" className="sr-only z-50 bg-amber px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section id="top" aria-labelledby="hero-h" className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-16 md:grid-cols-12 md:px-8 md:pb-32 md:pt-24">
          <div className="md:col-span-7">
            <h1 id="hero-h" className="display-1 max-w-[14ch]">Chatbots that answer. Websites that load. Apps that work.</h1>
            <p className="mt-8 max-w-[52ch] text-lg">
              Zelvan Labs is a small tech studio. We design, build and look after the digital side of your business, from the first sketch to launch and after.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button asChild size="lg"><a href="#contact">Start a project</a></Button>
              <a href="#demo" className="text-verdigris underline underline-offset-4">Talk to our demo bot</a>
            </div>
          </div>
          <div className="md:col-span-5 md:pt-4">
            <ChatDemo />
          </div>
        </section>
        <Services />
        <Process />
        <Work />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
