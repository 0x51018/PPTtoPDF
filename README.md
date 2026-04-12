# PPTX to PDF Converter

A self-hosted web service for converting PPTX files to PDF. Upload a `.pptx` file through the web UI, and the API server converts it with LibreOffice in headless mode and returns the PDF for immediate download.

## Requirements

- Node.js 20+
- pnpm
- Docker / Docker Compose (for containerized deployment)
- LibreOffice (`soffice`) installed locally when running without Docker

## Docker

The API container bundles LibreOffice and uses `soffice` for conversion.

## Docker Compose

```bash
docker compose up --build
```

- Web: http://localhost:3000
- API: http://localhost:3001

## Local Development

```bash
cp .env.example .env
corepack enable
pnpm install
pnpm --filter @pptx-to-pdf/shared build
pnpm dev
```

## Environment Variables

See `.env.example`:

| Variable | Description |
|---|---|
| `WEB_PORT` | Web server port |
| `API_PORT` | API server port |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL used by the web app |
| `MAX_FILE_SIZE_MB` | Maximum upload size in MB |
| `MAX_CONCURRENT_JOBS` | Maximum concurrent conversion jobs |
| `CONVERSION_TIMEOUT_MS` | Conversion timeout in milliseconds |
| `TMP_ROOT` | Temporary working directory root |

## Language / Locale

The web UI supports English (`en`) and Korean (`ko`). The default language is **English**.

To change the language, set the `NEXT_PUBLIC_LOCALE` build argument (or environment variable) before building:

```bash
# English (default)
NEXT_PUBLIC_LOCALE=en docker compose up --build

# Korean
NEXT_PUBLIC_LOCALE=ko docker compose up --build
```

When running locally:

```bash
NEXT_PUBLIC_LOCALE=ko pnpm dev
```

## Folder Structure

- `apps/web` — Next.js upload UI
- `apps/api` — Express API + LibreOffice conversion
- `packages/shared` — Shared constants and types
- `infra/docker` — Dockerfiles
- `scripts` — Development and deployment helper scripts

## API Reference

### `POST /api/convert`

- Content type: `multipart/form-data`
- Field name: `file`
- Accepts `.pptx` only, up to 50 MB

**Success:**
- `200 application/pdf`
- `Content-Disposition: attachment`

**Errors:**
| Status | Meaning |
|---|---|
| `400` | Invalid file or request |
| `413` | File too large |
| `422` | Conversion failed or timed out |
| `429` | Too many concurrent jobs |
| `500` | Internal server error |

### `GET /api/health`

Example response:

```json
{
  "ok": true,
  "libreOffice": "available",
  "tempDirWritable": true
}
```

## Troubleshooting

- **`soffice not found`**
  - Verify LibreOffice is installed in your local environment
  - When using Docker, rebuild the API container
- **Font/layout differences**
  - Install additional font packages inside the API container
- **Conversion timeout**
  - Increase `CONVERSION_TIMEOUT_MS`
  - Check the file size and complexity

## Limitations

- Animations, transitions, and macros are not reproduced in the PDF
- Rendering may differ slightly from PowerPoint
- No database, login, or persistent storage

## Extension Ideas

Use LibreOffice PDF filter parameters to add image quality control, PDF/A compliance, watermarks, page range selection, and more.

