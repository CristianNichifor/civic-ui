import { useState, version } from 'react';
import { createRoot } from 'react-dom/client';
import { Bookmark, Check, Copy, Download, ExternalLink } from 'lucide-react';
import { Button, IconButton, Field, Input, NativeSelect } from '@cristiannichifor/civic-ui';
import '@cristiannichifor/civic-ui/styles.css';
import '@cristiannichifor/civic-ui/themes/neutral.css';
import '@cristiannichifor/civic-ui/themes/usr.css';
import './showcase.css';

const examples = {
  fields: `import { Field, Input, NativeSelect } from '@cristiannichifor/civic-ui';
import '@cristiannichifor/civic-ui/styles.css';
import '@cristiannichifor/civic-ui/themes/neutral.css';

<section className="civic-scope civic-neutral">
  <Field id="title" label="Title">
    {props => <Input {...props} defaultValue="Public archive" />}
  </Field>
  <Field id="category" label="Category">
    {props => <NativeSelect {...props} defaultValue="local">
      <option value="local">Local</option>
      <option value="national">National</option>
    </NativeSelect>}
  </Field>
</section>`,
  buttons: `import { Button, IconButton } from '@cristiannichifor/civic-ui';
import { Bookmark } from 'lucide-react';

<Button primary onClick={onReview}>Review</Button>
<IconButton label="Save document" aria-pressed={saved}
  onClick={() => setSaved(!saved)}>
  <Bookmark aria-hidden="true" />
</IconButton>`,
};

function Example({ name, source }: { name: string; source: string }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(source); setStatus('Copied'); }
    catch { setStatus('Clipboard unavailable'); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url; link.download = `${name}.tsx`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <details className="example">
    <summary>{name} example</summary>
    <div className="example-actions">
      <IconButton label={`Copy ${name} example`} onClick={copy}><Copy aria-hidden="true" /></IconButton>
      <IconButton label={`Download ${name} example`} onClick={download}><Download aria-hidden="true" /></IconButton>
      <output role="status">{status}</output>
    </div>
    <pre tabIndex={0} aria-label={`${name} source`}><code>{source}</code></pre>
  </details>;
}

function Showcase() {
  const [theme, setTheme] = useState('neutral');
  const [mode, setMode] = useState('light');
  const [title, setTitle] = useState('Public archive');
  const [category, setCategory] = useState('');
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState(0);
  return <div className={`showcase civic-scope civic-${theme}`} data-civic-mode={theme === 'neutral' ? mode : 'light'}>
    <a className="skip" href="#controls">Skip to controls</a>
    <header>
      <div><h1>Civic UI</h1><span className="version">v0.1.0 / React {version}</span></div>
      <nav aria-label="Reference"><a href="#fields">Fields</a><a href="#buttons">Buttons</a><a href="#states">States</a>
        <a href="https://github.com/CristianNichifor/civic-ui/blob/main/SHOWCASE.md">Documentation <ExternalLink size={14} aria-hidden="true" /></a></nav>
    </header>
    <div className="theme-bar">
      <fieldset><legend>Theme</legend>{['neutral', 'usr'].map(value => <label key={value}><input type="radio" name="theme" value={value} checked={theme === value} onChange={() => setTheme(value)} />{value === 'usr' ? 'USR host tokens' : 'Neutral'}</label>)}</fieldset>
      <fieldset disabled={theme === 'usr'}><legend>Neutral mode</legend>{['light', 'dark'].map(value => <label key={value}><input type="radio" name="mode" value={value} checked={(theme === 'usr' ? 'light' : mode) === value} onChange={() => setMode(value)} />{value === 'light' ? 'Light' : 'Dark'}</label>)}</fieldset>
    </div>
    <main id="controls" tabIndex={-1}>
      <section id="fields"><div className="section-title"><span>01</span><h2>Fields</h2></div>
        <div className="field-grid">
          <Field id="showcase-title" label="Title" description="Document title">{props => <Input {...props} value={title} onChange={e => setTitle(e.target.value)} />}</Field>
          <Field id="showcase-category" label="Category" description="Document category" error={!category ? 'Category is required' : undefined}>{props => <NativeSelect {...props} value={category} required onChange={e => setCategory(e.target.value)}><option value="">Select category</option><option value="local">Local</option><option value="national">National</option></NativeSelect>}</Field>
        </div>
        <Example name="Fields" source={examples.fields} />
      </section>
      <section id="buttons"><div className="section-title"><span>02</span><h2>Buttons</h2></div>
        <div className="button-row"><Button primary onClick={() => setReviews(n => n + 1)}><Check aria-hidden="true" />Review</Button><Button onClick={() => { setReviews(0); setSaved(false); }}>Reset</Button><IconButton label="Save document" aria-pressed={saved} onClick={() => setSaved(!saved)}><Bookmark fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /></IconButton><Button disabled>Download</Button><output role="status">Reviews: {reviews}</output></div>
        <Example name="Buttons" source={examples.buttons} />
      </section>
      <section id="states"><div className="section-title"><span>03</span><h2>Control states</h2></div>
        <div className="field-grid">
          <Field id="showcase-disabled" label="Disabled input">{props => <Input {...props} disabled defaultValue="Unavailable" />}</Field>
          <Field id="showcase-readonly" label="Read-only input">{props => <Input {...props} readOnly value="REF-001" />}</Field>
          <Field id="showcase-invalid" label="Required title" error="Title is required">{props => <Input {...props} required defaultValue="" />}</Field>
          <Field id="showcase-disabled-select" label="Disabled select">{props => <NativeSelect {...props} disabled><option>Unavailable</option></NativeSelect>}</Field>
          <Field id="showcase-long" label="A longer category label for public documents and collaborative resources">{props => <NativeSelect {...props}><option>Documents and collaborative resources from the local archive</option><option>National archive</option></NativeSelect>}</Field>
        </div>
      </section>
    </main>
    <footer><span>MIT / Synthetic examples</span><a href="https://github.com/CristianNichifor/civic-ui">Source</a><a href="https://github.com/CristianNichifor/civic-ui/releases/tag/v0.1.0">GitHub release</a></footer>
  </div>;
}
createRoot(document.getElementById('root')!).render(<Showcase />);
