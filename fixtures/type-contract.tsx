import { createRef } from 'react';
import { Button, IconButton, Field, Input, NativeSelect } from '@cristiannichifor/civic-ui';
import { Textarea, Checkbox, RadioGroup, Dialog, AlertDialog, Table, Pagination, Tabs, DropdownMenu, Tooltip } from '@cristiannichifor/civic-ui';

<Button ref={createRef<HTMLButtonElement>()} onClick={event => event.currentTarget.focus()} />;
<IconButton label="Save" ref={createRef<HTMLButtonElement>()} />;
<Input ref={createRef<HTMLInputElement>()} onChange={event => event.currentTarget.value} />;
<NativeSelect ref={createRef<HTMLSelectElement>()} onChange={event => event.currentTarget.value} />;
<Field id="title" label="Title">{attributes => <Input {...attributes} />}</Field>;
// @ts-expect-error Icon buttons must have a name.
<IconButton />;
// @ts-expect-error Field IDs are required for label associations.
<Field label="Title">{attributes => <Input {...attributes} />}</Field>;
// @ts-expect-error Select references must point to the native select element.
<NativeSelect ref={createRef<HTMLInputElement>()} />;

<Textarea ref={createRef<HTMLTextAreaElement>()} rows={4} />;
<Checkbox ref={createRef<HTMLInputElement>()} label="Include" onChange={event => event.currentTarget.checked} />;
<RadioGroup label="Visibility" value="public" onValueChange={value => value.toUpperCase()} options={[{ value: 'public', label: 'Public' }]} />;
<Table label="Documents" ref={createRef<HTMLTableElement>()}><tbody /></Table>;
<Dialog trigger={<Button>Edit</Button>} title="Edit" description="Settings" onOpenChange={open => Boolean(open)} />;
<AlertDialog trigger={<Button>Archive</Button>} title="Archive?" description="Confirm archival" onConfirm={() => undefined} />;
<Pagination page={1} pageCount={2} onPageChange={page => page.toFixed()} />;
<Tabs label="Views" items={[{ value: 'all', label: 'All', content: null }]} />;
<Tooltip content="Help"><Button>Help</Button></Tooltip>;
<DropdownMenu label="Actions" trigger={<Button>Actions</Button>} items={[{ id: 'save', label: 'Save', onSelect: () => undefined }]} />;
// @ts-expect-error Checkboxes require a visible label.
<Checkbox />;
// @ts-expect-error Textarea references must point to the native textarea.
<Textarea ref={createRef<HTMLInputElement>()} />;
// @ts-expect-error Dialogs require an accessible title and description.
<Dialog trigger={<Button>Edit</Button>} />;
// @ts-expect-error Table scroll regions require a name.
<Table />;
// @ts-expect-error Pagination does not accept string page numbers.
<Pagination page="1" pageCount={2} onPageChange={() => undefined} />;
