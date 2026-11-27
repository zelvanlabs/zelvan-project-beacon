import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo, Wordmark } from "@/components/Logo";
import { site } from "@/config/site";

const services = [
  {
    name: "Chatbots and AI agents",
    desc: "Support bots, lead-qualifying bots and internal assistants that answer from your own documents. They live where your customers and team already are: your website, WhatsApp or Slack.",
    items: "support bots, lead qualification, document Q&A, WhatsApp and Slack bots",
  },
  {
    name: "Websites",
    desc: "Fast, search-friendly sites for businesses that load quickly on any phone. You get a simple way to edit content yourself, without calling us for every change.",
    items: "marketing sites, landing pages, content editing, SEO setup, analytics",
  },
  {
    name: "Web apps",
    desc: "Software your business runs on, built around how you actually work. Dashboards, client portals, booking systems, internal tools and MVPs.",
    items: "dashboards, client portals, booking systems, internal tools, MVPs",
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-h" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <h2 id="services-h" className="text-4xl md:text-6xl">What we build</h2>
      <ul className="mt-14 border-t border-ink">
        {services.map((s) => (
          <li key={s.name} className="grid gap-4 border-b border-mist py-10 md:grid-cols-12 md:gap-8">
            <h3 className="text-3xl md:col-span-5 md:text-[2.6rem]">{s.name}</h3>
            <div className="max-w-[62ch] md:col-span-6 md:col-start-7">
              <p>{s.desc}</p>
              <p className="mt-3 text-[0.95rem] text-ink-soft">Typical deliverables: {s.items}.</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-10 max-w-[62ch]">
        Something else? Automations, integrations and APIs are part of the job too.{" "}
        <a href="#contact" className="text-verdigris underline underline-offset-4">Tell us what you need.</a>
      </p>
    </section>
  );
}

const steps: [string, string][] = [
  ["Scope call", "A free 30-minute conversation about what you need, who it's for and what success looks like."],
  ["Fixed quote", "A written scope, timeline and price you can sign. No hourly surprises."],
  ["Build in the open", "You see a working demo every week, and can steer while it's still cheap to change."],
  ["Launch and support", "We deploy it, hand over everything, and stay on for changes."],
];

export function Process() {
  return (
    <section id="process" aria-labelledby="process-h" className="bg-ink text-chalk">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <h2 id="process-h" className="text-4xl md:col-span-4 md:text-6xl">How we work</h2>
          <ol className="md:col-span-7 md:col-start-6">
            {steps.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-t border-sidebar-border py-8 md:grid-cols-[5rem_minmax(0,1fr)]">
                <span className="text-4xl font-bold text-amber md:text-5xl" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="text-2xl md:text-3xl"><span className="sr-only">Step {i + 1}: </span>{t}</h3>
                  <p className="mt-2 max-w-[55ch] text-mist">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const faqs: [string, string][] = [
  ["How much does a project cost?", "It depends on scope. Small websites and chatbots usually need a short call first so we understand what you need. Every project gets a fixed-price written quote before any work starts."],
  ["How long does it take?", "Typical small projects take 2 to 6 weeks depending on scope. Larger web apps take longer, and the timeline is written into your quote."],
  ["Who owns the code?", "You do. Once the project is paid for, the code, designs and everything we build for it belong to you."],
  ["Do you work with clients outside Pakistan?", "Yes. We are remote-first and work with clients worldwide. Payment is by international bank transfer."],
  ["What happens after launch?", "We hand everything over. If you want, we offer optional monthly support for fixes, updates and improvements."],
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-10 md:grid-cols-12">
        <h2 id="faq-h" className="text-4xl md:col-span-4 md:text-6xl">Questions</h2>
        <Accordion type="single" collapsible className="border-t border-ink md:col-span-8">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q} className="border-mist">
              <AccordionTrigger className="py-6 text-left text-xl font-medium hover:no-underline md:text-2xl">{q}</AccordionTrigger>
              <AccordionContent className="max-w-[62ch] pb-6 text-[1.0625rem] leading-relaxed">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-mist">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="flex items-center gap-2 text-xl">
            <Logo size={22} />
            <Wordmark />
          </div>
          <p className="mt-3 text-ink-soft">{site.name}. {site.tagline}</p>
        </div>
        <div className="text-[0.95rem] md:text-right">
          <a href={`mailto:${site.email}`} className="text-verdigris underline underline-offset-4">{site.email}</a>
          <p className="mt-2 text-ink-soft">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
