import { createFileRoute, Link } from "@tanstack/react-router";
import { IntakeForm } from "@/components/intake-form";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/intake")({ component: IntakePage });

function IntakePage() {
  return (
    <Shell
      title="Bring in"
      lede="Ordinary language and arriving files enter the same event-driven pipeline. Talking is kept. Files are checksummed before anything else reads them."
    >
      <IntakeForm />
      <p className="mt-4 text-sm text-muted">
        After a photo batch lands, it shows in{" "}
        <Link to="/media" className="text-primary">
          Media
        </Link>
        . Documents show in{" "}
        <Link to="/documents" className="text-primary">
          Documents
        </Link>
        . Talking without a desk assignment is memory, not a job.
      </p>
    </Shell>
  );
}
