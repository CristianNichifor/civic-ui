import { createRoot } from 'react-dom/client';
import {
  AlertDialog, Button, Dialog, FilterToolbar, LoadingIndicator, Pagination, Select, StatusMessage, ValidationSummary,
  enLabels, type CivicLabels,
} from '@cristiannichifor/civic-ui';
import { roLabels } from '@cristiannichifor/civic-ui/locales/ro';
import '@cristiannichifor/civic-ui/styles.css';
import '@cristiannichifor/civic-ui/themes/neutral.css';

// Without a preset the components must render exactly the 0.7.0 English defaults.
function Defaults() {
  return <>
    <Pagination page={1} pageCount={2} onPageChange={() => undefined} />
    <Select label="Format" options={[{ value: 'a', label: 'A' }]} />
    <Dialog trigger={<Button>Open dialog</Button>} title="Dialog" description="Body" />
    <AlertDialog trigger={<Button>Open alert</Button>} title="Alert" description="Body" onConfirm={() => undefined} />
    <LoadingIndicator />
    <FilterToolbar><span /></FilterToolbar>
    <ValidationSummary errors={[{ id: 'x', message: 'Missing' }]} />
    <StatusMessage tone="warning" title="Stale" onRetry={() => undefined} />
  </>;
}

function Preset({ labels }: { labels: CivicLabels }) {
  return <>
    <Pagination {...labels.Pagination} page={1} pageCount={2} onPageChange={() => undefined} />
    <Select {...labels.Select} label="Format" options={[{ value: 'a', label: 'A' }]} />
    <Dialog {...labels.Dialog} trigger={<Button>Open dialog</Button>} title="Dialog" description="Body" />
    <AlertDialog {...labels.AlertDialog} trigger={<Button>Open alert</Button>} title="Alert" description="Body" onConfirm={() => undefined} />
    <LoadingIndicator {...labels.LoadingIndicator} />
    <FilterToolbar {...labels.FilterToolbar}><span /></FilterToolbar>
    <ValidationSummary {...labels.ValidationSummary} errors={[{ id: 'x', message: 'Missing' }]} />
    <StatusMessage {...labels.StatusMessage} tone="warning" title="Stale" onRetry={() => undefined} />
  </>;
}

const preset = new URLSearchParams(location.search).get('preset');
createRoot(document.getElementById('root')!).render(
  <main className="civic-scope civic-neutral" lang={preset === 'ro' ? 'ro' : 'en'}>
    {preset === 'ro' ? <Preset labels={roLabels} /> : preset === 'en' ? <Preset labels={enLabels} /> : <Defaults />}
    <script type="application/json" id="labels">{JSON.stringify({ en: enLabels, ro: roLabels })}</script>
  </main>,
);
