# Standards Upload Copyright Warning

This repository is public or may become public. Do not commit:

- ISO/API/ASME/NACE/AMPP/IEC PDFs or other licensed standards;
- extracted full text from standards;
- generated full chunks;
- embeddings or vector indexes that contain licensed text;
- proprietary client evidence or private evidence packs.

Commit only:

- source code;
- schemas;
- API contracts;
- metadata structures;
- public-domain/sample dummy content;
- placeholder metadata such as standard code/title/publisher/applicability.

Private runtime paths are ignored by `.gitignore`, including:

- `storage/local-dev/standards/uploads/**`
- `storage/local-dev/standards/parsed-text/**`
- `storage/local-dev/standards/chunks/**`
- `storage/local-dev/standards/embeddings/**`
- `storage/local-dev/evidence-packs/**`

The `.gitkeep` files in those directories are explanatory placeholders only.
