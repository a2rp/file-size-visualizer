export const fileLimit = 200;
export const fileCategories = [
  { id: "image", label: "Images", color: "#e77943" },
  { id: "video", label: "Video", color: "#6d64d8" },
  { id: "audio", label: "Audio", color: "#3e8a79" },
  { id: "document", label: "Documents", color: "#4e78bd" },
  { id: "archive", label: "Archives", color: "#c39a3e" },
  { id: "code", label: "Code", color: "#a65b96" },
  { id: "other", label: "Other", color: "#8c948e" },
];

const extensionCategory = {
  jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image", svg: "image", avif: "image", bmp: "image", heic: "image",
  mp4: "video", mov: "video", webm: "video", mkv: "video", avi: "video", m4v: "video",
  mp3: "audio", wav: "audio", ogg: "audio", flac: "audio", m4a: "audio", aac: "audio",
  pdf: "document", doc: "document", docx: "document", txt: "document", md: "document", rtf: "document", csv: "document", xls: "document", xlsx: "document", ppt: "document", pptx: "document",
  zip: "archive", rar: "archive", "7z": "archive", tar: "archive", gz: "archive", bz2: "archive",
  js: "code", jsx: "code", ts: "code", tsx: "code", html: "code", css: "code", json: "code", py: "code", java: "code", c: "code", cpp: "code", sh: "code", yml: "code", yaml: "code", xml: "code", sql: "code",
};

export const getFileCategory = (file) => {
  const mime = String(file.type ?? "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  const extension = String(file.name ?? "").split(".").pop().toLowerCase();
  return extensionCategory[extension] ?? "other";
};

export const getFileTypeLabel = (file) => {
  const extension = String(file.name ?? "").split(".").pop();
  return extension && extension !== file.name ? extension.toUpperCase() : (file.type || "Unknown");
};

export const formatBytes = (bytes, decimals = 1) => {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) throw new Error("File size must be a non-negative number.");
  if (size === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / (1024 ** index);
  return `${Number(value.toFixed(decimals))} ${units[index]}`;
};

export const summarizeFiles = (files) => {
  const totalBytes = files.reduce((total, file) => total + file.size, 0);
  const categories = fileCategories.map((category) => {
    const matching = files.filter((file) => getFileCategory(file) === category.id);
    const bytes = matching.reduce((total, file) => total + file.size, 0);
    return { ...category, count: matching.length, bytes, share: totalBytes ? bytes / totalBytes : 0 };
  }).filter((category) => category.count).sort((first, second) => second.bytes - first.bytes);
  const largest = files.reduce((current, file) => !current || file.size > current.size ? file : current, null);
  return { fileCount: files.length, totalBytes, averageBytes: files.length ? totalBytes / files.length : 0, largest, categories };
};

export const filterFiles = (files, query = "", category = "all") => {
  const term = query.trim().toLocaleLowerCase();
  return files.filter((file) => (category === "all" || getFileCategory(file) === category)
    && (!term || `${file.name} ${file.type} ${getFileTypeLabel(file)}`.toLocaleLowerCase().includes(term)));
};

export const sortFiles = (files, sort = "largest") => [...files].sort((first, second) => {
  if (sort === "name") return first.name.localeCompare(second.name);
  if (sort === "smallest") return first.size - second.size || first.name.localeCompare(second.name);
  if (sort === "type") return getFileTypeLabel(first).localeCompare(getFileTypeLabel(second)) || first.name.localeCompare(second.name);
  return second.size - first.size || first.name.localeCompare(second.name);
});
