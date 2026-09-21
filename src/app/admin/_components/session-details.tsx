import type { Session } from "@/types/auth";

// Rendered on the server, so the time zone is stated rather than guessed.
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

type SessionDetailsProps = {
  session: Session;
};

export function SessionDetails({ session }: SessionDetailsProps) {
  const rows = [
    { label: "Username", value: session.username },
    { label: "Session expires", value: `${dateFormatter.format(session.expiresAt)} UTC` },
    { label: "Stored in", value: "Signed, httpOnly cookie (HS256 JWT)" },
  ];

  return (
    <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Session
      </h2>
      <dl className="mt-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-3">
            <dt className="text-zinc-500">{row.label}</dt>
            <dd className="font-medium text-zinc-900 sm:col-span-2 dark:text-zinc-100">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
