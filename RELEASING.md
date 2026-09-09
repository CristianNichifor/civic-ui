# GitHub-Only Releases

No npm account, registry token or npm publication is used. `private: true` intentionally remains set. The scoped name is the package's import identifier, not a claim of npm registry ownership.

## Review and Publish

1. Merge the reviewed release-preparation PR manually. Keep the package version, root lockfile and changelog consistent.
2. Run **Prepare GitHub release** from the Actions tab on `main`. The workflow is manual-only and rejects other branch refs. It rebuilds, checks the archive and licenses, tests both React consumers, runs browser and release-asset tests, and prepares assets from the verified bytes.
3. Review the resulting draft release, its target commit, CI results, tarball and `SHA256SUMS`. Publish the draft manually. No workflow automatically publishes or merges anything.
4. Never replace published assets or reuse a version. Corrections require a new version and release. Creating a draft for an already existing release fails rather than overwriting it.

Only the release job has repository write permission. It uses the built-in GitHub token for draft creation, not a stored registry secret. Normal PR CI remains read-only.

## CSS-Only Asset (Unreleased)

Release preparation now stages `civic-ui-css-VERSION.tgz` from the same verified
package bytes. Its exact allowlist is CSS, `NATIVE.md` and `LICENSE`, with a second
entry in `SHA256SUMS`. It contains no JavaScript or dependency manifests. The
plain-HTML browser fixture loads the extracted archive over `file://`, with
JavaScript disabled and HTTP(S) requests blocked, in all three engines, then
checks controls with offline emulation enabled (see the WebKit note in NATIVE.md).

Before publishing this addition, prepare and review a new package/lockfile version
and changelog entry. The unchanged 0.2.0 version in this branch is not permission
to overwrite its published release. No CSS-only asset exists for that release.
The asset builder uses GNU tar for reproducible archive metadata, as available in
the Ubuntu release workflow. See [NATIVE.md](NATIVE.md) for the supported markup
and host-owned behavior.

## Consume a Published Release

Version 0.2.0 is published on GitHub Releases:

```bash
npm install --save-exact https://github.com/CristianNichifor/civic-ui/releases/download/v0.2.0/civic-ui-0.2.0.tgz
```

Commit the consumer's package manifest and lockfile together. The manifest pins the versioned HTTPS artifact; npm's lockfile records its integrity. Review the release checksum before adoption. Do not use a moving `latest` URL, a local filesystem path, or install this name from the npm registry.

For an independent checksum check, download the tarball and `SHA256SUMS` from the same release into one directory and run `sha256sum -c SHA256SUMS`. Checksums detect changed bytes; they are not a separate signature or proof of publisher identity.

For 0.2.0, React, React DOM and Lucide are peers; Radix primitives are runtime dependencies. Keep React and React DOM on matching versions. Initial installation needs access to the public release/registry or populated caches. Built local apps do not need a GitHub or npm account at runtime. This does not add a service worker or guarantee server-stopped reloads.

Consumer migrations belong in separate reviewed changes. Preserve each host's theme adapter and rerun its behavior/data parity, responsive UI, keyboard and offline checks. Package changes do not update consuming applications automatically.

Documentation updates on `main` do not replace the documentation bundled in an existing release. A migration using the published API does not need a new library release; runtime changes do, after review and explicit publication approval.
