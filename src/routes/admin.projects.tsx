import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/projects")({
  component: Page,
});

function Page() {
  return <h1 className="text-3xl">Projects</h1>;
}
