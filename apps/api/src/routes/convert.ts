import fs from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { ERROR_CODES } from "@pptx-to-pdf/shared";
import { isAllowedPptx } from "../utils/file-validation.js";
import { AppError, errorResponse, mapMulterError } from "../utils/errors.js";
import { createJobDirs, cleanupPath } from "../services/temp-files.js";
import { convertPptxToPdf } from "../services/libreoffice.js";
import { JobLimiter } from "../services/job-limiter.js";
import { logger } from "../utils/logger.js";

export const createConvertRouter = ({
  tmpRoot,
  maxFileSizeBytes,
  timeoutMs,
  limiter
}: {
  tmpRoot: string;
  maxFileSizeBytes: number;
  timeoutMs: number;
  limiter: JobLimiter;
}) => {
  const router = Router();

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxFileSizeBytes },
    fileFilter: (_req, file, cb) => {
      if (!isAllowedPptx(file.originalname, file.mimetype)) {
        cb(new AppError(400, ERROR_CODES.INVALID_FILE_TYPE, "pptx 파일만 업로드할 수 있습니다."));
        return;
      }
      cb(null, true);
    }
  });

  router.post("/convert", (req, res, next) => {
    upload.single("file")(req, res, (error) => {
      if (!error) return next();
      if (error instanceof AppError) return next(error);
      if ((error as { code?: string }).code) return next(mapMulterError((error as { code: string }).code));
      return next(new AppError(400, ERROR_CODES.INVALID_FILE_TYPE, "파일 업로드 처리에 실패했습니다."));
    });
  });

  router.post("/convert", async (req, res, next) => {
    const startedAt = Date.now();
    let baseDir = "";
    let jobId = "";

    try {
      limiter.acquire();
      const file = req.file;
      if (!file) throw new AppError(400, ERROR_CODES.NO_FILE, "파일이 없습니다.");

      const dirs = await createJobDirs(tmpRoot);
      baseDir = dirs.baseDir;
      jobId = dirs.jobId;

      const safeBaseName = `${uuidv4()}.pptx`;
      const inputFilePath = path.join(dirs.inputDir, safeBaseName);
      await fs.writeFile(inputFilePath, file.buffer);

      const outputPdfPath = await convertPptxToPdf({ inputFile: inputFilePath, outputDir: dirs.outputDir, timeoutMs });
      const downloadName = `${path.parse(file.originalname).name || "converted"}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);
      res.download(outputPdfPath, downloadName, (err) => {
        if (err) next(err);
      });

      res.on("finish", async () => {
        await cleanupPath(baseDir);
      });

      logger.info("conversion_finished", {
        jobId,
        elapsedMs: Date.now() - startedAt,
        success: true
      });
    } catch (error) {
      if (baseDir) {
        await cleanupPath(baseDir);
      }
      logger.error("conversion_failed", {
        jobId,
        elapsedMs: Date.now() - startedAt,
        success: false,
        error: error instanceof Error ? error.message : "unknown"
      });
      next(error);
    } finally {
      limiter.release();
    }
  });

  router.use((error: unknown, _req: unknown, res: { status: (status: number) => { json: (body: unknown) => void } }) => {
    if (error instanceof AppError) {
      return res.status(error.status).json(errorResponse(error.code, humanizeMessage(error)));
    }
    return res.status(500).json(errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다."));
  });

  return router;
};

const humanizeMessage = (error: AppError) => {
  if (error.code === ERROR_CODES.CONVERSION_FAILED || error.code === ERROR_CODES.OUTPUT_NOT_FOUND) {
    return "PPTX를 PDF로 변환하지 못했습니다.";
  }

  return error.message;
};
