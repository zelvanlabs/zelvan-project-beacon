import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: Page,
});

function Page() {
  return <h1 className="text-3xl">Settings</h1>;
}
