import { Section } from "@/components/policy/Section";
import type { App } from "@/lib/apps";

export function SummarySection({ app }: { app: App }) {
  return (
    <Section id="at-a-glance" title="At a glance" accent={app.accent}>
      <ul
        className="flex flex-col gap-3 rounded-2xl border p-6"
        style={{
          backgroundColor: `color-mix(in oklab, ${app.accent} 6%, transparent)`,
          borderColor: `color-mix(in oklab, ${app.accent} 22%, transparent)`,
        }}
      >
        {app.summary.map((point) => (
          <li key={point} className="flex gap-3 text-base leading-7">
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="mt-1.5 size-4 shrink-0"
              style={{ color: app.accent }}
            >
              <path
                d="M4 10.5l4 4 8-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {point}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function CollectedSection({ app }: { app: App }) {
  return (
    <Section id="data-collected" title="Data we collect" accent={app.accent}>
      {app.collects.length === 0 ? (
        <p className="rounded-2xl border border-border-soft bg-muted-surface p-6 text-base leading-7">
          {app.name} does not collect any data. Nothing is sent off your device.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {app.collects.map((entry) => (
            <div
              key={entry.category}
              className="rounded-2xl border border-border-soft bg-surface p-6 transition-colors hover:border-foreground/20"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-semibold tracking-tight">{entry.category}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                    entry.linked
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {entry.linked ? "Linked to you" : "Not linked to you"}
                </span>
              </div>
              <p className="mt-2.5 text-base leading-7 text-muted">{entry.purpose}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {entry.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-muted-surface px-2.5 py-1 font-mono text-xs text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

export function NotCollectedSection({ app }: { app: App }) {
  return (
    <Section id="data-not-collected" title="Data we do not collect" accent={app.accent}>
      <p className="max-w-[68ch] text-base leading-7 text-muted">
        {app.name} never asks for, receives, or stores any of the following:
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {app.notCollected.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 rounded-xl border border-border-soft bg-surface px-3.5 py-2.5 text-sm"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0 text-muted/60">
              <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5.5 5.5l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PermissionsSection({ app }: { app: App }) {
  return (
    <Section id="permissions" title="Device permissions" accent={app.accent}>
      <div className="flex flex-col gap-3">
        {app.permissions.map((permission) => (
          <div
            key={permission.name}
            className="rounded-2xl border border-border-soft bg-surface p-6 transition-colors hover:border-foreground/20"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-semibold tracking-tight">{permission.name}</h3>
              <span
                className={`rounded-md px-2 py-0.5 text-xs ${
                  permission.required
                    ? "bg-foreground/10 font-medium"
                    : "bg-muted-surface text-muted"
                }`}
              >
                {permission.required ? "Required" : "Optional"}
              </span>
            </div>
            <p className="mt-2.5 text-base leading-7 text-muted">{permission.reason}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ThirdPartiesSection({ app }: { app: App }) {
  return (
    <Section id="third-parties" title="Third-party services" accent={app.accent}>
      <p className="max-w-[68ch] text-base leading-7 text-muted">
        {app.name} relies on the services below. Each one handles data under its own
        privacy policy.
      </p>
      <ul className="mt-5 divide-y divide-border-soft overflow-hidden rounded-2xl border border-border-soft bg-surface">
        {app.thirdParties.map((party) => (
          <li
            key={party.name}
            className="flex flex-col gap-1.5 p-5 transition-colors hover:bg-muted-surface sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <span className="min-w-0">
              <span className="block font-medium tracking-tight">{party.name}</span>
              <span className="block text-sm leading-6 text-muted">{party.purpose}</span>
            </span>
            <a
              href={party.url}
              target="_blank"
              rel="noreferrer noopener"
              className="shrink-0 whitespace-nowrap rounded-lg border border-border-soft px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-foreground/25 hover:text-foreground"
            >
              Privacy policy ↗
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ContactCard({ app, email }: { app: App; email: string }) {
  return (
    <div
      className="rounded-2xl border p-7"
      style={{
        backgroundColor: `color-mix(in oklab, ${app.accent} 6%, transparent)`,
        borderColor: `color-mix(in oklab, ${app.accent} 22%, transparent)`,
      }}
    >
      <h2 className="text-lg font-semibold tracking-tight">
        Questions about {app.name}?
      </h2>
      <p className="mt-2 max-w-[60ch] text-base leading-7 text-muted">
        We usually reply within a few business days.
      </p>
      <a
        href={`mailto:${email}?subject=${encodeURIComponent(`${app.name} — privacy question`)}`}
        className="mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        style={{ backgroundColor: app.accent }}
      >
        {email}
      </a>
    </div>
  );
}
