const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export const uploadAndConvert = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/convert`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: { code?: string } };
    throw new Error(payload.error?.code ?? "UNKNOWN");
  }

  const blob = await response.blob();
  return blob;
};
