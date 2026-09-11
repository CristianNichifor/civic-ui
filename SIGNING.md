# Commit Signing Policy

Maintainers use SSH commit signing for new work:

```bash
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

The public signing key must be added to the maintainer's GitHub account. GitHub's `Verified` badge confirms the cryptographic signature and account association; an author name or email alone is not proof of signing.

Historical unsigned commits are retained when already merged. We do not rewrite shared history solely to add signatures. Release tags and assets must remain traceable to a signed release commit.
