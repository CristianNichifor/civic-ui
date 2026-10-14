import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ChartFrame, SiteShell, SourceCitation, StatGrid, StatTile, StatusBadge, StatusMessage, enLabels,
} from '@cristiannichifor/civic-ui';
import { roLabels } from '@cristiannichifor/civic-ui/locales/ro';
import '@cristiannichifor/civic-ui/styles.css';
import '@cristiannichifor/civic-ui/themes/neutral.css';

const params = new URLSearchParams(location.search);
const ro = params.get('lang') === 'ro';
const labels = ro ? roLabels : enLabels;
const rows = [['2024', 120], ['2025', 135], ['2026', 128]] as const;

function Site() {
  const [state, setState] = useState<'ready' | 'empty' | 'error'>((params.get('state') as 'empty' | 'error') || 'ready');
  return <SiteShell
    {...labels.SiteShell}
    familyBar={{
      ...labels.FamilyBar,
      homeHref: '/',
      homeLabel: 'CN Lab',
      toolName: ro ? 'Buget local' : 'Local budget',
      status: <StatusBadge tone="warning">Beta</StatusBadge>,
      languages: [
        { code: 'en', label: 'EN', href: '?lang=en', current: !ro },
        { code: 'ro', label: 'RO', href: '?lang=ro', current: ro },
      ],
    }}
    footer={{
      ...labels.SiteFooter,
      method: <a href="#method">Method</a>,
      privacy: <a href="#privacy">Privacy</a>,
      source: <a href="https://github.com/CristianNichifor/civic-ui">Source code</a>,
      contact: <a href="https://github.com/CristianNichifor/civic-ui/issues">Contact</a>,
    }}
  >
    <h1>{ro ? 'Buget local' : 'Local budget'}</h1>
    <StatGrid label="Key figures">
      <StatTile {...labels.StatTile} label="Spending" value={1234567.8} unit="RON" locale={ro ? 'ro-RO' : 'en-GB'}
        format={{ maximumFractionDigits: 0 }} delta={{ value: 4.2, unit: '%', positive: 'bad' }} asOf="2026-10-01" />
      <StatTile {...labels.StatTile} label="Projects" value={42} locale={ro ? 'ro-RO' : 'en-GB'} delta={{ value: -3, positive: 'good' }} />
      <StatTile {...labels.StatTile} label="Schools" value={17} locale={ro ? 'ro-RO' : 'en-GB'} delta={{ value: 0 }} />
    </StatGrid>
    <p><button type="button" onClick={() => setState('ready')}>Ready</button>
      <button type="button" onClick={() => setState('empty')}>Empty</button>
      <button type="button" onClick={() => setState('error')}>Error</button></p>
    <ChartFrame
      {...labels.ChartFrame}
      title="Spending by year"
      question="Did spending rise after 2024?"
      demo
      asOf="2026-10-01"
      state={state}
      empty={<p>No spending recorded for this filter.</p>}
      error={<StatusMessage {...labels.StatusMessage} tone="error" title="Data could not be loaded" onRetry={() => setState('ready')} />}
      source={<SourceCitation {...labels.SourceCitation} source="Synthetic dataset" href="#data" licence="CC BY 4.0"
        licenceHref="https://creativecommons.org/licenses/by/4.0/" date="2026-10-01" methodHref="#method" />}
      table={<table><caption>Spending by year</caption><thead><tr><th scope="col">Year</th><th scope="col">Million RON</th></tr></thead>
        <tbody>{rows.map(([year, value]) => <tr key={year}><th scope="row">{year}</th><td>{value}</td></tr>)}</tbody></table>}
    >
      <svg role="img" aria-label="Bar chart of spending by year" viewBox="0 0 300 120" width="100%">
        {rows.map(([year, value], i) => <rect key={year} x={20 + i * 90} y={130 - value} width="60" height={value - 10} fill={`var(--civic-viz-${i + 1})`} />)}
      </svg>
    </ChartFrame>
  </SiteShell>;
}

createRoot(document.getElementById('root')!).render(
  <div className="civic-scope civic-neutral" lang={ro ? 'ro' : 'en'}><Site /></div>,
);
