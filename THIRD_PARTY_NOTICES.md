# Third-Party Notices

The original code distributed in this package is MIT-licensed. Dependencies retain their own licenses and copyright notices; the package license does not replace them.

## Runtime Peers

- React: MIT, copyright Meta Platforms, Inc. and affiliates. [Upstream license](https://github.com/facebook/react/blob/main/LICENSE).
- Lucide React: ISC, copyright Lucide Icons and Contributors. Its Feather-derived icons have additional MIT notices, copyright Cole Bemis. This includes ChevronDown used by NativeSelect. [Upstream licenses](https://lucide.dev/license).

React, its JSX runtime, and Lucide are external imports, not bundled implementations. For convenience and attribution, the build copies the complete license texts from the installed, locked React and Lucide packages into `dist/licenses/react-LICENSE` and `dist/licenses/lucide-react-LICENSE`. Consumers distributing these dependencies or bundled icons must preserve their applicable notices too.

React DOM is also a runtime peer under MIT, including optional portal rendering. Its license is retained in its installed package.

## Runtime Dependencies (0.2.0)

The package imports these pinned, MIT-licensed Radix primitives without bundling their implementations: `@radix-ui/react-dialog` 1.1.23, `@radix-ui/react-alert-dialog` 1.1.23, `@radix-ui/react-dropdown-menu` 2.1.24, `@radix-ui/react-tabs` 1.1.21 and `@radix-ui/react-tooltip` 1.2.16. [Radix license](https://github.com/radix-ui/primitives/blob/main/LICENSE).

Their installed transitive dependencies include Radix support packages, Floating UI, aria-hidden, react-remove-scroll and its helpers (MIT), and tslib (0BSD). The root lockfile records resolved versions and license metadata. Dependency license texts remain in installed packages; application distributors must preserve applicable notices. These permissive dependencies do not change Civic UI's MIT license. Transitive ranges are locked by each consumer's own lockfile, not the published tarball.

TypeScript and Vite are build tools, not distributed runtime code; their licenses remain in their installed packages.

## Scope

This package contains no logos, fonts, images, party documents or personal records. The USR theme adapter maps host-supplied CSS tokens; it does not provide an official identity kit or grant rights to third-party trademarks or brand assets. The MIT license applies to the package's original software, not to the entire parent demo repository or unrelated assets.

The runtime license review covers the pinned versions exercised by the local fixtures. Dependency upgrades and any later asset additions need a fresh notice/license check. This is not a license audit of every application consuming the package.
