export type HealthResponse = {
  ok: boolean;
  libreOffice: "available" | "unavailable";
  tempDirWritable: boolean;
};
