import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "@pptx-to-pdf/shared";

export class JobLimiter {
  private readonly max: number;
  private running = 0;

  constructor(max: number) {
    this.max = max;
  }

  acquire() {
    if (this.running >= this.max) {
      throw new AppError(429, ERROR_CODES.TOO_MANY_CONCURRENT_JOBS, "요청이 많습니다. 잠시 후 다시 시도해주세요.");
    }
    this.running += 1;
  }

  release() {
    this.running = Math.max(0, this.running - 1);
  }
}
