import assert from "node:assert/strict";
import test from "node:test";
import { fileLimit, filterFiles, formatBytes, getFileCategory, sortFiles, summarizeFiles } from "./files.js";

const files = [
  { name: "photo.png", type: "image/png", size: 2_097_152 },
  { name: "notes.md", type: "", size: 1_024 },
  { name: "movie.mp4", type: "video/mp4", size: 8_388_608 },
  { name: "bundle.zip", type: "application/zip", size: 0 },
];

test("formats byte units and zero-byte files", () => {
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(1_572_864), "1.5 MB");
  assert.throws(() => formatBytes(-1), /non-negative/);
});

test("classifies files from MIME type or extension", () => {
  assert.equal(getFileCategory(files[0]), "image");
  assert.equal(getFileCategory(files[1]), "document");
  assert.equal(getFileCategory(files[2]), "video");
  assert.equal(getFileCategory({ name: "thing.bin", type: "" }), "other");
});

test("summarizes total bytes, largest file, and category shares", () => {
  const summary = summarizeFiles(files);
  assert.equal(summary.fileCount, 4);
  assert.equal(summary.totalBytes, 10_486_784);
  assert.equal(summary.largest.name, "movie.mp4");
  assert.equal(summary.categories[0].id, "video");
  assert.equal(summary.categories.reduce((total, category) => total + category.share, 0), 1);
  assert.equal(summarizeFiles([]).largest, null);
});

test("filters by file name, MIME, and category and sorts by selected order", () => {
  assert.equal(filterFiles(files, "notes").length, 1);
  assert.equal(filterFiles(files, "png", "image").length, 1);
  assert.equal(filterFiles(files, "movie", "image").length, 0);
  assert.deepEqual(sortFiles(files, "smallest").map((file) => file.name), ["bundle.zip", "notes.md", "photo.png", "movie.mp4"]);
  assert.equal(sortFiles(files, "name")[0].name, "bundle.zip");
  assert.equal(fileLimit, 200);
});
