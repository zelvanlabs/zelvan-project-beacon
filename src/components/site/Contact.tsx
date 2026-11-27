import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase";
import { budgets, serviceLabels, services, validateLead, type LeadForm } from "@/lib/labels";

const empty: LeadForm = { name: "", email: "", company: "", service: "", budget: "", message: "" };
const field = "mt-2 block w-full rounded-[2px] border border-mist bg-card px-3 py-2.5 text-base text-ink focus-visible:outline-2 focus-visible:outline-verdigris aria-[invalid=true]:border-destructive";

export function Contact() {
  const [form, setForm] = useState<LeadForm>(empty);
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof LeadForm) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    const errs = validateLead(form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setSending(true);
    try {
      const body: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim(),
        service: form.service,
        message: form.message.trim(),
        website: honey,
      };
      if (form.company.trim()) body["company"] = form.company.trim();
      if (form.budget) body["budget"] = form.budget;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setServerError(json.error ?? "Something went wrong sending your message. Please try again, or email us directly.");
      } else {
        setDone(true);
        setForm(empty);
      }
    } catch {
      setServerError("We couldn't reach our server. Check your connection and try again, or email us directly.");
    } finally {
      setSending(false);
    }
  }

  const err = (k: keyof LeadForm) =>
    errors[k] ? <p id={`${k}-err`} className="mt-1.5 text-[0.95rem] text-destructive">{errors[k]}</p> : null;
  const aria = (k: keyof LeadForm) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-err` } : {});

  return (
    <section id="contact" aria-labelledby="contact-h" className="border-t border-mist">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-12 md:px-8 md:py-32">
        <div className="md:col-span-5">
          <h2 id="contact-h" className="text-4xl md:text-6xl">Tell us what you are building</h2>
          <p className="mt-6 max-w-[45ch]">
            A few lines is enough. We read every message and reply within one business day, usually to set up a free scope call.
          </p>
          <p className="mt-6">
            Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="text-verdigris underline underline-offset-4">{site.email}</a>
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {done ? (
            <div role="status" className="border-t border-ink pt-8">
              <p className="text-3xl font-bold tracking-tight">Thanks, we got it. We reply within one business day.</p>
              <button type="button" onClick={() => setDone(false)} className="mt-6 text-verdigris underline underline-offset-4">
                Send another message
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="font-medium">Name</label>
                  <input id="name" autoComplete="name" value={form.name} onChange={set("name")} className={field} {...aria("name")} />
                  {err("name")}
                </div>
                <div>
                  <label htmlFor="email" className="font-medium">Email</label>
                  <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={field} {...aria("email")} />
                  {err("email")}
                </div>
              </div>
              <div>
                <label htmlFor="company" className="font-medium">Company <span className="font-normal text-ink-soft">(optional)</span></label>
                <input id="company" autoComplete="organization" value={form.company} onChange={set("company")} className={field} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="service" className="font-medium">What do you need?</label>
                  <select id="service" value={form.service} onChange={set("service")} className={field} {...aria("service")}>
                    <option value="">Choose one</option>
                    {services.map((s) => <option key={s} value={s}>{serviceLabels[s]}</option>)}
                  </select>
                  {err("service")}
                </div>
                <div>
                  <label htmlFor="budget" className="font-medium">Budget <span className="font-normal text-ink-soft">(optional)</span></label>
                  <select id="budget" value={form.budget} onChange={set("budget")} className={field}>
                    <option value="">Prefer not to say</option>
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="font-medium">Message</label>
                <textarea id="message" rows={6} value={form.message} onChange={set("message")} className={field} placeholder="What are you building, and who is it for?" {...aria("message")} />
                {err("message")}
              </div>
              <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
              </div>
              {serverError && <p role="alert" className="border-l-2 border-destructive pl-3 text-destructive">{serverError}</p>}
              <Button type="submit" size="lg" disabled={sending}>{sending ? "Sending..." : "Send enquiry"}</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
