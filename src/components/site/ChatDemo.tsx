import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";

type Msg = { from: "visitor" | "zel"; text: string };

const intro: Msg[] = [
  { from: "visitor", text: "Hi, we get the same support questions all day. Could you build us a chatbot for that?" },
  { from: "zel", text: "Yes. We start with a free 30-minute scope call to understand your questions and documents." },
  { from: "zel", text: "Then you get a fixed written quote. While we build, you see a working demo every week." },
  { from: "zel", text: "When it's ready we launch it on your site and stay on for changes. Anything you'd like to know?" },
];

const chips: { q: string; a: string; scroll?: boolean }[] = [
  { q: "How long does a project take?", a: "Typical small projects take 2 to 6 weeks, depending on scope. You get a timeline in the quote before we start." },
  { q: "Who owns the code?", a: "You do. Once the project is paid for, the code and everything we build for it is yours." },
  { q: "Can you work with my existing site?", a: "Yes. We can add to or extend the site you have, or rebuild it if that makes more sense. We'll tell you honestly which." },
  { q: "Talk to a human", a: "Of course. Taking you to the contact form now, a real person reads every message.", scroll: true },
];

export function ChatDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setMsgs(intro);
      setReady(true);
      return;
    }
    let t = 400;
    intro.forEach((m, i) => {
      if (m.from === "zel") {
        timers.current.push(window.setTimeout(() => setTyping(true), t));
        t += 900;
      }
      timers.current.push(
        window.setTimeout(() => {
          setTyping(false);
          setMsgs((prev) => [...prev, m]);
          if (i === intro.length - 1) setReady(true);
        }, t),
      );
      t += m.from === "visitor" ? 700 : 500;
    });
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  function ask(c: (typeof chips)[number]) {
    setUsed((u) => [...u, c.q]);
    setMsgs((prev) => [...prev, { from: "visitor", text: c.q }, { from: "zel", text: c.a }]);
    if (c.scroll) {
      window.setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("name")?.focus({ preventScroll: true });
      }, 600);
    }
  }

  return (
    <section
      id="demo"
      aria-label="Scripted chat demo with Zel"
      className="flex h-[30rem] flex-col rounded-[2px] bg-ink text-chalk"
    >
      <header className="flex items-center justify-between gap-3 border-b border-sidebar-border px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Logo zColor="var(--chalk)" size={20} />
          <p className="truncate font-medium">Zel, demo bot</p>
        </div>
        <span className="shrink-0 rounded-[2px] border border-sidebar-border px-2 py-0.5 text-sm text-mist">
          Scripted demo
        </span>
      </header>
      <div ref={logRef} role="log" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {msgs.map((m, i) => (
          <p
            key={i}
            className={
              "msg-in max-w-[85%] rounded-[2px] px-4 py-2.5 text-[0.98rem] leading-snug " +
              (m.from === "visitor" ? "ml-auto bg-amber text-ink" : "bg-sidebar-accent text-chalk")
            }
          >
            <span className="sr-only">{m.from === "visitor" ? "Visitor: " : "Zel: "}</span>
            {m.text}
          </p>
        ))}
        {typing && (
          <div className="flex w-fit gap-1 rounded-[2px] bg-sidebar-accent px-4 py-3" aria-label="Zel is typing">
            {[0, 1, 2].map((d) => (
              <span key={d} className="typing-dot block size-1.5 rounded-full bg-chalk" style={{ animationDelay: `${d * 150}ms` }} />
            ))}
          </div>
        )}
      </div>
      <div className="min-h-[4.5rem] border-t border-sidebar-border px-5 py-3">
        {ready && (
          <ul className="flex flex-wrap gap-2" aria-label="Ask Zel">
            {chips.filter((c) => !used.includes(c.q) || c.scroll).map((c) => (
              <li key={c.q}>
                <button
                  type="button"
                  onClick={() => ask(c)}
                  className="rounded-[2px] border border-mist/50 px-3 py-1.5 text-sm text-chalk transition-colors hover:border-amber hover:text-amber focus-visible:outline-amber"
                >
                  {c.q}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
