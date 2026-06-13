# Local Development Standards Storage

Use private local development storage for uploaded standards and generated artifacts:

```text
storage/local-dev/standards/uploads
storage/local-dev/standards/parsed-text
storage/local-dev/standards/chunks
storage/local-dev/standards/embeddings
storage/local-dev/evidence-packs/drafts
```

These folders are ignored by Git except for `.gitkeep` warning placeholders. Do not place uploaded standards under `apps/web/public` or any other public static route.

## Local Services

Frontend:

```powershell
cd apps/web
npm run dev
```

NestJS governance API after installing dependencies:

```powershell
cd apps/api-nest
npm install
npm run start:dev
```

FastAPI service after installing Python requirements:

```powershell
cd apps/api-python
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Domain utility tests:

```powershell
cd packages/domain
npm test
```
