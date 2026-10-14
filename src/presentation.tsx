import { Children, createElement, useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Minus } from "lucide-react";
import { Button } from "./components";
import { StatusBadge } from "./extended";
import { enLabels } from "./labels";

/** A date rendered in a `<time>` element; ISO strings keep their machine-readable value. */
function When({ value }: { value: ReactNode }) {
  return typeof value === "string" ? <time dateTime={value}>{value}</time> : <>{value}</>;
}

export type FamilyBarProps = {
  homeHref: string;
  /** Name of the family hub the back link returns to, such as "CN Lab". */
  homeLabel: string;
  toolName: ReactNode;
  status?: ReactNode;
  languages?: { code: string; label: string; href: string; current?: boolean }[];
  languageLabel?: string;
};

export function FamilyBar({
  homeHref,
  homeLabel,
  toolName,
  status,
  languages,
  languageLabel = enLabels.FamilyBar.languageLabel,
}: FamilyBarProps) {
  return (
    <header className="civic-family-bar">
      <a className="civic-family-bar__home" href={homeHref}>
        <ArrowLeft aria-hidden="true" />
        {homeLabel}
      </a>
      <span className="civic-family-bar__tool">{toolName}</span>
      {status}
      {languages && languages.length > 0 && (
        <nav className="civic-family-bar__languages" aria-label={languageLabel}>
          <ul>
            {languages.map((language) => (
              <li key={language.code}>
                <a
                  href={language.href}
                  hrefLang={language.code}
                  lang={language.code}
                  aria-current={language.current ? "true" : undefined}
                >
                  {language.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export type SiteFooterProps = {
  method?: ReactNode;
  privacy?: ReactNode;
  source?: ReactNode;
  contact?: ReactNode;
  children?: ReactNode;
  label?: string;
};

export function SiteFooter({
  method,
  privacy,
  source,
  contact,
  children,
  label = enLabels.SiteFooter.label,
}: SiteFooterProps) {
  const slots = [method, privacy, source, contact].filter(Boolean);
  return (
    <footer className="civic-site-footer">
      {slots.length > 0 && (
        <nav aria-label={label}>
          <ul>
            {slots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        </nav>
      )}
      {children}
    </footer>
  );
}

export function SiteShell({
  familyBar,
  footer,
  children,
  skipLabel = enLabels.SiteShell.skipLabel,
}: {
  familyBar: FamilyBarProps;
  footer?: SiteFooterProps;
  children: ReactNode;
  skipLabel?: string;
}) {
  const main = useId();
  return (
    <div className="civic-site-shell">
      <a className="civic-skip-link" href={`#${main}`}>
        {skipLabel}
      </a>
      <FamilyBar {...familyBar} />
      <main id={main} tabIndex={-1} className="civic-site-shell__main">
        {children}
      </main>
      <SiteFooter {...footer} />
    </div>
  );
}

export function StatTile({
  label,
  value,
  unit,
  delta,
  asOf,
  locale = "en",
  format,
  increaseLabel = enLabels.StatTile.increaseLabel,
  decreaseLabel = enLabels.StatTile.decreaseLabel,
  noChangeLabel = enLabels.StatTile.noChangeLabel,
  asOfLabel = enLabels.StatTile.asOfLabel,
}: {
  label: ReactNode;
  value: number | ReactNode;
  unit?: ReactNode;
  /** `positive` says whether a rise is good or bad news; omit it when neither. */
  delta?: { value: number; unit?: string; positive?: "good" | "bad" };
  asOf?: ReactNode;
  locale?: string;
  format?: Intl.NumberFormatOptions;
  increaseLabel?: string;
  decreaseLabel?: string;
  noChangeLabel?: string;
  asOfLabel?: string;
}) {
  const trend = !delta ? undefined : delta.value > 0 ? "up" : delta.value < 0 ? "down" : "flat";
  const Icon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const sentiment =
    delta?.positive && trend !== "flat"
      ? (trend === "up") === (delta.positive === "good")
        ? "good"
        : "bad"
      : undefined;
  return (
    <div className="civic-stat-tile">
      <span className="civic-stat-tile__label">{label}</span>
      <span className="civic-stat-tile__value">
        {typeof value === "number" ? (
          <data value={String(value)}>{new Intl.NumberFormat(locale, format).format(value)}</data>
        ) : (
          value
        )}
        {unit && <> {unit}</>}
      </span>
      {delta && (
        <span className="civic-stat-tile__delta" data-trend={trend} data-sentiment={sentiment}>
          <Icon aria-hidden="true" />
          <span className="civic-visually-hidden">
            {trend === "up" ? increaseLabel : trend === "down" ? decreaseLabel : noChangeLabel}{" "}
          </span>
          {trend === "flat" ? (
            <span aria-hidden="true">{noChangeLabel}</span>
          ) : (
            new Intl.NumberFormat(locale, { signDisplay: "exceptZero", maximumFractionDigits: 2 }).format(delta.value) +
            (delta.unit ?? "")
          )}
        </span>
      )}
      {asOf && (
        <span className="civic-stat-tile__as-of">
          {asOfLabel} <When value={asOf} />
        </span>
      )}
    </div>
  );
}

export function StatGrid({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul className="civic-stat-grid" aria-label={label}>
      {Children.map(children, (child) => (child ? <li>{child}</li> : null))}
    </ul>
  );
}

export function SourceCitation({
  source,
  href,
  licence,
  licenceHref,
  date,
  methodHref,
  sourceLabel = enLabels.SourceCitation.sourceLabel,
  licenceLabel = enLabels.SourceCitation.licenceLabel,
  dateLabel = enLabels.SourceCitation.dateLabel,
  methodLabel = enLabels.SourceCitation.methodLabel,
}: {
  source: ReactNode;
  href?: string;
  licence?: ReactNode;
  licenceHref?: string;
  date?: ReactNode;
  methodHref?: string;
  sourceLabel?: string;
  licenceLabel?: string;
  dateLabel?: string;
  methodLabel?: string;
}) {
  const parts: ReactNode[] = [
    <>
      {sourceLabel}: {href ? <a href={href}>{source}</a> : source}
    </>,
  ];
  if (licence)
    parts.push(
      <>
        {licenceLabel}:{" "}
        {licenceHref ? (
          <a href={licenceHref} rel="license">
            {licence}
          </a>
        ) : (
          licence
        )}
      </>,
    );
  if (date)
    parts.push(
      <>
        {dateLabel}: <When value={date} />
      </>,
    );
  if (methodHref) parts.push(<a href={methodHref}>{methodLabel}</a>);
  return (
    <p className="civic-source">
      {parts.map((part, index) => (
        <span key={index}>{part}</span>
      ))}
    </p>
  );
}

export function ChartFrame({
  title,
  question,
  children,
  table,
  source,
  asOf,
  demo,
  state = "ready",
  empty,
  error,
  headingLevel = 3,
  showTableLabel = enLabels.ChartFrame.showTableLabel,
  demoLabel = enLabels.ChartFrame.demoLabel,
  asOfLabel = enLabels.ChartFrame.asOfLabel,
}: {
  title: string;
  question?: ReactNode;
  /** The host-rendered chart. */
  children: ReactNode;
  /** The same data as a host-rendered table; enables the toggle. */
  table?: ReactNode;
  source?: ReactNode;
  asOf?: ReactNode;
  demo?: boolean;
  state?: "ready" | "empty" | "error";
  empty?: ReactNode;
  error?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  showTableLabel?: string;
  demoLabel?: string;
  asOfLabel?: string;
}) {
  const id = useId();
  const [asTable, setAsTable] = useState(false);
  return (
    <figure className="civic-chart-frame" aria-labelledby={`${id}-title`}>
      <div className="civic-chart-frame__header">
        {createElement(`h${headingLevel}`, { id: `${id}-title` }, title)}
        {demo && <StatusBadge tone="warning">{demoLabel}</StatusBadge>}
      </div>
      {question && <p className="civic-chart-frame__question">{question}</p>}
      {state === "ready" && table && (
        <div className="civic-chart-frame__tools">
          <Button aria-pressed={asTable} onClick={() => setAsTable(!asTable)}>
            {showTableLabel}
          </Button>
        </div>
      )}
      <div className="civic-chart-frame__body">
        {state === "empty" ? empty : state === "error" ? error : asTable && table ? table : children}
      </div>
      {(source || asOf) && (
        <figcaption className="civic-chart-frame__caption">
          {source}
          {asOf && (
            <span className="civic-chart-frame__as-of">
              {asOfLabel} <When value={asOf} />
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
