import { createRef } from 'react';
import { Button, IconButton, Field, Input, NativeSelect } from '@cristiannichifor/civic-ui';

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
