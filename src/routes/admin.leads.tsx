import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/leads")({
  component: Page,
});

function Page() {
  return <h1 className="text-3xl">Leads</h1>;
}
