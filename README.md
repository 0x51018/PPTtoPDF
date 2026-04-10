# PPTX to PDF Converter

개인용 홈서버에서 쉽게 실행할 수 있는 PPTX → PDF 변환 웹서비스입니다. 사용자가 웹에서 `.pptx` 파일 1개를 업로드하면 API 서버가 LibreOffice headless 모드로 PDF를 생성하고 즉시 다운로드합니다.

## 요구 사항

- Node.js 20+
- pnpm
- Docker / Docker Compose (컨테이너 실행 시)
- 로컬 실행 시 LibreOffice(soffice) 설치 필요

## Docker

API 컨테이너는 LibreOffice가 포함되어 있으며 `soffice`를 사용해 변환합니다.

## Docker Compose

```bash
docker compose up --build
```

- Web: http://localhost:3000
- API: http://localhost:3001

## 로컬 실행 방법

```bash
cp .env.example .env
corepack enable
pnpm install
pnpm --filter @pptx-to-pdf/shared build
pnpm dev
```

## 환경 변수

`.env.example` 참고:

- `WEB_PORT`: 웹 포트
- `API_PORT`: API 포트
- `NEXT_PUBLIC_API_BASE_URL`: 웹에서 호출할 API 주소
- `MAX_FILE_SIZE_MB`: 업로드 최대 용량(MB)
- `MAX_CONCURRENT_JOBS`: 동시 변환 수
- `CONVERSION_TIMEOUT_MS`: 작업 타임아웃(ms)
- `TMP_ROOT`: 임시 작업 루트

## 폴더 구조

- `apps/web`: Next.js 업로드 UI
- `apps/api`: Express API + LibreOffice 변환
- `packages/shared`: 공통 상수/타입
- `infra/docker`: Dockerfile
- `scripts`: 개발 보조 스크립트

## API 사용법

### `POST /api/convert`

- `multipart/form-data`
- field 이름: `file`
- `.pptx`만 허용, 최대 50MB

성공:
- `200 application/pdf`
- `Content-Disposition: attachment`

실패:
- `400` 잘못된 파일/요청
- `413` 용량 초과
- `422` 변환 실패/타임아웃
- `429` 동시 작업 수 초과
- `500` 서버 오류

### `GET /api/health`

예시 응답:

```json
{
  "ok": true,
  "libreOffice": "available",
  "tempDirWritable": true
}
```

## 트러블슈팅

- `soffice not found`
  - 로컬 환경에 LibreOffice 설치 여부 확인
  - Docker 사용 시 API 컨테이너 재빌드
- 폰트 누락으로 인한 레이아웃 차이
  - API 컨테이너에 필요한 폰트 패키지 추가 설치
- 변환 timeout
  - `CONVERSION_TIMEOUT_MS` 증가
  - 파일 크기/복잡도 확인

## 제한 사항

- 애니메이션/전환 효과/매크로는 PDF에서 재현되지 않음
- PowerPoint 렌더링과 완전히 동일하지 않을 수 있음
- DB/로그인/영구 저장 미지원

## 확장 아이디어

LibreOffice PDF filter parameter를 사용하면 이미지 품질, PDF/A, 워터마크, 범위 선택 등으로 확장할 수 있습니다.
