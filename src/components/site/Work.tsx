import { useSuspenseQuery } from "@tanstack/react-query";
import { publishedProjectsQuery } from "@/lib/projects-query";
import { serviceLabels } from "@/lib/labels";

const concepts = [
  ["Clinic support chatbot", "Chatbot", "A customer-support bot for a clinic that answers questions about opening hours, services and appointments from the clinic's own documents."],
  ["Local service booking site", "Website", "A fast booking site for a local service business, with a simple calendar and content the owner can edit."],
  ["Lead dashboard", "Web app", "A small web app that collects enquiries, tracks their status and shows how many turn into work each week."],
];

export function Work() {
  const { data: projects } = useSuspenseQuery(publishedProjectsQuery);
  return (
    <section id="work" aria-labelledby="work-h" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <h2 id="work-h" className="text-4xl md:text-6xl">Work</h2>
      {projects.length > 0 ? (
        <ul className="mt-14 border-t border-ink">
          {projects.map((p) => (
            <li key={p.id} className="grid gap-4 border-b border-mist py-10 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <h3 className="text-3xl">{p.title}</h3>
                <p className="mt-2 text-ink-soft">
                  {serviceLabels[p.category]}
                  {p.is_demo && <span className="ml-3 rounded-[2px] bg-muted px-2 py-0.5 text-sm text-ink">In-house demo</span>}
                </p>
              </div>
              <div className="max-w-[62ch] md:col-span-6 md:col-start-7">
                {p.cover_url && (
                  <img src={p.cover_url} alt={`Screenshot of ${p.title}`} loading="lazy" width={1200} height={750} className="mb-5 aspect-[16/10] w-full border border-mist object-cover" />
                )}
                {p.summary && <p>{p.summary}</p>}
                {p.tags && p.tags.length > 0 && <p className="mt-3 text-[0.95rem] text-ink-soft">{p.tags.join(", ")}</p>}
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-verdigris underline underline-offset-4">
                    Visit {p.title}<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p className="mt-8 max-w-[62ch] text-lg">We are early. These are the first things we are building in-house so you can see how we work.</p>
          <ul className="mt-12 border-t border-ink">
            {concepts.map(([t, c, d]) => (
              <li key={t} className="grid gap-4 border-b border-mist py-10 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-5">
                  <h3 className="text-3xl">{t}</h3>
                  <p className="mt-2 text-ink-soft">{c} <span className="ml-3 rounded-[2px] border border-ink px-2 py-0.5 text-sm text-ink">In progress</span></p>
                </div>
                <p className="max-w-[62ch] md:col-span-6 md:col-start-7">{d}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
