import cors from "cors";
import express from "express";
import { createConvertRouter } from "./routes/convert.js";
import { createHealthRouter } from "./routes/health.js";
import { startupCleanup } from "./services/temp-files.js";
import { JobLimiter } from "./services/job-limiter.js";

const port = Number(process.env.API_PORT ?? 3001);
const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB ?? 50);
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;
const timeoutMs = Number(process.env.CONVERSION_TIMEOUT_MS ?? 60000);
const maxConcurrentJobs = Number(process.env.MAX_CONCURRENT_JOBS ?? 2);
const tmpRoot = process.env.TMP_ROOT ?? "/tmp/pptx-to-pdf";

const bootstrap = async () => {
  await startupCleanup(tmpRoot);
  const limiter = new JobLimiter(maxConcurrentJobs);

  const app = express();
  app.use(cors());
  app.use("/api", createHealthRouter(tmpRoot));
  app.use("/api", createConvertRouter({ tmpRoot, maxFileSizeBytes, timeoutMs, limiter }));

  app.listen(port, () => {
    console.log(`API server listening on ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
