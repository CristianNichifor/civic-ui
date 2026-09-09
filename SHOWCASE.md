# Component Showcase

The [showcase](https://cristiannichifor.github.io/civic-ui/) is published from
reviewed `main` after its checks pass. A PR preview is local, not a deployed site.

Run `npm ci --ignore-scripts`, `npm run verify`, then `npm run preview` and open
http://127.0.0.1:5221/showcase.html. The page uses the freshly packed package,
not a source alias. Both React 18.3.1 and 19.1.1 consumers build and type-check it.
The public deployment uses the React 19 build.

## Examples and Themes

Existing Button, IconButton, Field, Input and NativeSelect components are rendered
with editable values, native validation attributes, disabled/read-only states,
long labels, keyboard focus and real hover styles. Review/save/reset actions only
change in-memory example state. Source snippets can be selected, copied or
downloaded; clipboard access can be denied by a browser and reports that failure.
Button snippets require caller-owned handlers/state. They are not standalone apps.

Neutral has light and dark modes. The USR adapter is light-only here and receives
example host tokens; it does not load an official font, logo or identity kit.
Neither theme implies affiliation or official approval.

## Boundaries

- Synthetic examples only; no accounts, analytics, APIs or persistence.
- Interactions make no external requests. Explicit source/documentation/release
  links navigate to GitHub and need a network connection.
- Initial installation requires network access or populated caches. In-page
  interactions work offline after loading; no service worker is included and
  reloading with the server stopped is not guaranteed.
- Chromium, Firefox and WebKit are tested at 320/390/1440 pixels. WebKit is not
  Safari/iOS device certification. Screen readers and SSR/RSC are not certified;
  this is not a complete accessibility audit.
- The showcase is not shipped inside the library tarball. Publishing the site
  neither publishes to npm nor replaces a versioned GitHub release.

## Deployment

The package-check workflow builds both consumers and runs all browser/release
checks. On a push to `main`, it stages the React 19 build with the showcase as
`index.html`, uploads a Pages artifact, and deploys it with a separate Pages-only
permission grant. PR runs never deploy. Repository Pages must use GitHub Actions.
