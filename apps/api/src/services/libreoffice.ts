import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "@pptx-to-pdf/shared";

export const checkSofficeAvailable = async () => {
  return new Promise<boolean>((resolve) => {
    const proc = spawn("soffice", ["--version"]);
    proc.on("error", () => resolve(false));
    proc.on("exit", (code) => resolve(code === 0));
  });
};

export const convertPptxToPdf = async ({
  inputFile,
  outputDir,
  timeoutMs
}: {
  inputFile: string;
  outputDir: string;
  timeoutMs: number;
}) => {
  const args = ["--headless", "--convert-to", "pdf:impress_pdf_Export", "--outdir", outputDir, inputFile];

  await new Promise<void>((resolve, reject) => {
    const proc = spawn("soffice", args, { shell: false });
    let stderr = "";
    const timeout = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new AppError(422, ERROR_CODES.CONVERSION_TIMEOUT, "변환 시간이 초과되었습니다."));
    }, timeoutMs);

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", () => {
      clearTimeout(timeout);
      reject(new AppError(500, ERROR_CODES.LIBREOFFICE_NOT_FOUND, "LibreOffice를 실행할 수 없습니다."));
    });

    proc.on("exit", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
      } else {
        reject(new AppError(422, ERROR_CODES.CONVERSION_FAILED, `변환 실패: ${stderr || "unknown"}`));
      }
    });
  });

  const expectedPdf = path.join(outputDir, `${path.parse(inputFile).name}.pdf`);
  await fs.access(expectedPdf).catch(() => {
    throw new AppError(422, ERROR_CODES.OUTPUT_NOT_FOUND, "출력 PDF를 찾을 수 없습니다.");
  });

  return expectedPdf;
};
