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

import { Select, enLabels, type CivicLabels } from '@cristiannichifor/civic-ui';
import { roLabels } from '@cristiannichifor/civic-ui/locales/ro';
const presets: CivicLabels[] = [enLabels, roLabels];
<Pagination {...roLabels.Pagination} page={1} pageCount={presets.length} onPageChange={() => undefined} />;
<Select {...roLabels.Select} label="Format" options={[]} />;
// @ts-expect-error Presets only expose the labels a component accepts.
roLabels.Pagination.unknownLabel;
// @ts-expect-error A preset must cover every component's labels.
const incomplete: CivicLabels = { Pagination: enLabels.Pagination };

import { StatusMessage } from '@cristiannichifor/civic-ui';
<StatusMessage tone="error" title="Failed" onRetry={() => undefined} {...roLabels.StatusMessage} />;
<Table label="Compact" density="compact" mobileLayout="cards"><tbody /></Table>;
// @ts-expect-error Status messages only have success, warning and error tones.
<StatusMessage tone="info" title="Note" />;
// @ts-expect-error Table density is a closed set.
<Table label="Dense" density="dense"><tbody /></Table>;
import { formatRON, formatDateRO, formatNumberRO } from '@cristiannichifor/civic-ui/locales/ro';
const formatted: string[] = [formatRON(1), formatRON(1, { maximumFractionDigits: 0 }), formatDateRO(new Date()), formatDateRO('2026-01-01', { month: 'short' }), formatNumberRO(2)];
// @ts-expect-error Amounts are numbers, not preformatted strings.
formatRON('1');
