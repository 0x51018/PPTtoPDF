import path from "node:path";
import { ALLOWED_EXTENSION, ALLOWED_MIME_TYPES } from "@pptx-to-pdf/shared";

export const isAllowedPptx = (originalName: string, mimeType: string) => {
  const ext = path.extname(originalName).toLowerCase();
  return ext === ALLOWED_EXTENSION && ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number]);
};
