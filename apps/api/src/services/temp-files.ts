import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export const createJobDirs = async (tmpRoot: string) => {
  const jobId = `job-${uuidv4()}`;
  const baseDir = path.join(tmpRoot, jobId);
  const inputDir = path.join(baseDir, "input");
  const outputDir = path.join(baseDir, "output");
  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  return { jobId, baseDir, inputDir, outputDir };
};

export const cleanupPath = async (target: string) => {
  await fs.rm(target, { recursive: true, force: true });
};

export const startupCleanup = async (tmpRoot: string) => {
  await fs.mkdir(tmpRoot, { recursive: true });
  const entries = await fs.readdir(tmpRoot, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("job-"))
      .map((entry) => cleanupPath(path.join(tmpRoot, entry.name)))
  );
};

export const ensureTmpWritable = async (tmpRoot: string) => {
  try {
    await fs.mkdir(tmpRoot, { recursive: true });
    const probe = path.join(tmpRoot, `.probe-${Date.now()}`);
    await fs.writeFile(probe, "ok");
    await fs.rm(probe, { force: true });
    return true;
  } catch {
    return false;
  }
};
