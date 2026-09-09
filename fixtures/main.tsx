import { useState, version, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Bookmark } from 'lucide-react';
import { Button, IconButton, Field, Input, NativeSelect } from '@cristiannichifor/civic-ui';
import '@cristiannichifor/civic-ui/styles.css';
import '@cristiannichifor/civic-ui/themes/neutral.css';
import '@cristiannichifor/civic-ui/themes/usr.css';
import './host.css';

const ref = createRef<HTMLSelectElement>();
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
  </main>;
}
createRoot(document.getElementById('root')!).render(<App />);
