import { Router } from "express";
import { checkSofficeAvailable } from "../services/libreoffice.js";
import { ensureTmpWritable } from "../services/temp-files.js";

export const createHealthRouter = (tmpRoot: string) => {
  const router = Router();

  router.get("/health", async (_req, res) => {
    const [libreOfficeOk, tempDirWritable] = await Promise.all([checkSofficeAvailable(), ensureTmpWritable(tmpRoot)]);
    res.json({
      ok: true,
      libreOffice: libreOfficeOk ? "available" : "unavailable",
      tempDirWritable
    });
  });

  return router;
};
