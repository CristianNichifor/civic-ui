import { useState, version, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Bookmark } from 'lucide-react';
import { Button, IconButton, Field, Input, NativeSelect } from '@cristiannichifor/civic-ui';
import '@cristiannichifor/civic-ui/styles.css';
import '@cristiannichifor/civic-ui/themes/neutral.css';
import '@cristiannichifor/civic-ui/themes/usr.css';
import './host.css';

const ref = createRef<HTMLSelectElement>();
function EdgeControls() {
  const [choice, setChoice] = useState('');
  const [actions, setActions] = useState(0);
  const longText = 'A longer category label that wraps naturally across multiple lines on a narrow mobile display';
  return <section aria-label="Control states">
    <Field id="disabled-input" label="Disabled input">{props => <Input {...props} disabled value="Fixed" />}</Field>
    <Field id="disabled-select" label="Disabled select">{props => <NativeSelect {...props} disabled defaultValue="fixed"><option value="fixed">Fixed</option></NativeSelect>}</Field>
    <Button disabled onClick={() => setActions(n => n + 1)}>Disabled action</Button>
    <Field id="invalid-select" label="Required category" description="Choose a category" error={!choice ? 'Category is required' : undefined}>
      {props => <NativeSelect {...props} required value={choice} onChange={event => setChoice(event.target.value)}><option value="">Select category</option><option value="chosen">Chosen</option></NativeSelect>}
    </Field>
    <Field id="long-select" label={longText}>{props => <NativeSelect {...props} defaultValue="long"><option value="long">{longText}</option></NativeSelect>}</Field>
    <Button onClick={() => setActions(n => n + 1)}>Continue with the selected category and review the document</Button>
    <output data-testid="edge-actions">{actions}</output>
  </section>;
}
function App() {
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('local');
  const [submitted, setSubmitted] = useState(false);
  const params = new URLSearchParams(location.search);
  const theme = params.get('theme') === 'usr' ? 'usr' : 'neutral';
  return <main className={`civic-scope civic-${theme}`} data-civic-mode={params.get('mode') || 'light'}>
    <h1>Document</h1><p data-testid="version">React {version}</p>
    <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
      <Field id="title" label="Title" description="Document title" error={submitted && !title ? 'Required' : undefined}>
        {props => <Input {...props} value={title} onChange={event => setTitle(event.target.value)} />}
      </Field>
      <Field id="category" label="Category">
        {props => <NativeSelect {...props} ref={ref} value={category} onChange={event => setCategory(event.target.value)}>
          <option value="local">Local</option><option value="national">National</option>
        </NativeSelect>}
      </Field>
      <div className="actions">
        <Button primary type="submit">Review</Button>
        <IconButton label="Save document" aria-pressed={saved} onClick={() => setSaved(!saved)}><Bookmark aria-hidden="true" /></IconButton>
        <Button disabled>Download</Button>
      </div>
      <output aria-live="polite">{category}{submitted && title ? `: ${title}` : ''}</output>
    </form>
    {params.has('edge') && <EdgeControls />}
  </main>;
}
createRoot(document.getElementById('root')!).render(<App />);
