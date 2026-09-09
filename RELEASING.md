# GitHub-Only Releases

No npm account, registry token or npm publication is used. `private: true` intentionally remains set. The scoped name is the package's import identifier, not a claim of npm registry ownership.

## Review and Publish

1. Merge the reviewed release-preparation PR manually. Keep the package version, root lockfile and changelog consistent.
2. Run **Prepare GitHub release** from the Actions tab on `main`. The workflow is manual-only and rejects other branch refs. It rebuilds, checks the archive and licenses, tests both React consumers, runs browser and release-asset tests, and prepares assets from the verified bytes.
3. Review the resulting draft release, its target commit, CI results, tarball and `SHA256SUMS`. Publish the draft manually. No workflow automatically publishes or merges anything.
4. Never replace published assets or reuse a version. Corrections require a new version and release. Creating a draft for an already existing release fails rather than overwriting it.

Only the release job has repository write permission. It uses the built-in GitHub token for draft creation, not a stored registry secret. Normal PR CI remains read-only.

## Consume a Published Release

Version 0.1.0 is published on GitHub Releases:

```bash
npm install --save-exact https://github.com/CristianNichifor/civic-ui/releases/download/v0.1.0/civic-ui-0.1.0.tgz
```

Commit the consumer's package manifest and lockfile together. The manifest pins the versioned HTTPS artifact; npm's lockfile records its integrity. Review the release checksum before adoption. Do not use a moving `latest` URL, a local filesystem path, or install this name from the npm registry.

For an independent checksum check, download the tarball and `SHA256SUMS` from the same release into one directory and run `sha256sum -c SHA256SUMS`. Checksums detect changed bytes; they are not a separate signature or proof of publisher identity.

React and Lucide remain peer dependencies. Initial installation needs access to the public release/registry or populated caches. Built local apps do not need a GitHub or npm account at runtime. This does not add a service worker or guarantee server-stopped reloads.

Consumer migrations belong in separate reviewed changes. Preserve each host's theme adapter and rerun its behavior/data parity, responsive UI, keyboard and offline checks. Package changes do not update consuming applications automatically.
