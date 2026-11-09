import { useMemo, useState } from "react";
import { FiDatabase, FiShield } from "react-icons/fi";
import { fileLimit, formatBytes, getFileCategory, summarizeFiles } from "../../utils/files.js";
import FileConfirm from "./fileConfirm/index.jsx";
import FileDropzone from "./fileDropzone/index.jsx";
import FileSummary from "./fileSummary/index.jsx";
import FileTable from "./fileTable/index.jsx";
import styles from "./styles.module.css";

const fileId = (file, index) => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${index}-${file.name}`;

const saveReport = (files, summary) => {
  const report = {
    generatedAt: new Date().toISOString(),
    fileCount: summary.fileCount,
    totalBytes: summary.totalBytes,
    categories: summary.categories.map(({ id, label, count, bytes, share }) => ({ id, label, count, bytes, share })),
    files: files.map((file) => ({ name: file.name, type: file.type, sizeBytes: file.size, category: getFileCategory(file) })),
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "file-size-report.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const FileWorkspace = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [fileTableKey, setFileTableKey] = useState(0);
  const summary = useMemo(() => summarizeFiles(files), [files]);

  const addFiles = (incomingFiles) => {
    const incoming = Array.from(incomingFiles ?? []);
    const availableSlots = Math.max(0, fileLimit - files.length);
    const acceptedFiles = incoming.slice(0, availableSlots);
    const skippedCount = incoming.length - acceptedFiles.length;

    if (!acceptedFiles.length) {
      setError(`This report already contains the maximum of ${fileLimit} files. Remove a file before adding more.`);
      setNotice("");
      return;
    }
    const records = acceptedFiles.map((file, index) => ({
      id: fileId(file, files.length + index),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));
    setFiles((current) => [...current, ...records]);
    setError(skippedCount
      ? `${skippedCount} ${skippedCount === 1 ? "file was" : "files were"} skipped because each report is limited to ${fileLimit} files.`
      : "");
    setNotice(`${records.length} ${records.length === 1 ? "file added" : "files added"}. Only file metadata is analyzed.`);
  };

  const confirmAction = () => {
    if (pendingAction?.kind === "clear") {
      setFiles([]);
      setFileTableKey((key) => key + 1);
      setNotice("The file report is clear. Your files on disk were not changed.");
    } else if (pendingAction?.kind === "remove") {
      setFiles((current) => current.filter((file) => file.id !== pendingAction.file.id));
      if (files.length === 1) setFileTableKey((key) => key + 1);
      setNotice(`${pendingAction.file.name} removed from the report.`);
    }
    setError("");
    setPendingAction(null);
  };

  const exportReport = () => {
    if (!files.length) return;
    saveReport(files, summary);
    setNotice("Metadata report downloaded as JSON.");
    setError("");
  };

  const confirmTitle = pendingAction?.kind === "clear" ? "Clear this file report?" : "Remove this file from the report?";
  const confirmDescription = pendingAction?.kind === "clear"
    ? `This removes all ${files.length} selected entries from the current report. It does not delete or change files on your device.`
    : pendingAction ? `“${pendingAction.file.name}” will be removed from this report. The file on your device will not be changed.` : "";

  return (
    <section className={styles.workspace} id="files" aria-labelledby="workspace-title">
      <div className={styles.heading}><div><p>LOCAL FILE INSPECTOR</p><h2 id="workspace-title">Read your file mix.</h2><span>Choose files to compare their sizes and see where the space adds up.</span></div><div className={styles.privacy}><FiShield aria-hidden="true" /><span>Files stay on your device</span></div></div>
      <FileDropzone onFiles={addFiles} disabled={files.length >= fileLimit} />
      {error && <p className={styles.error} role="alert">{error}</p>}
      {notice && <p className={styles.notice} role="status" aria-live="polite">{notice}</p>}
      <FileSummary summary={summary} />
      <FileTable key={fileTableKey} files={files} onRequestRemove={(file) => setPendingAction({ kind: "remove", file })} onRequestClear={() => setPendingAction({ kind: "clear" })} onExport={exportReport} />
      <div className={styles.privacyFoot}><FiDatabase aria-hidden="true" /><p>Analysis reads file names, MIME types, and sizes only. File contents are never opened or uploaded. Up to {fileLimit} entries per report.</p><span>{formatBytes(summary.totalBytes)} / TOTAL</span></div>
      {pendingAction && <FileConfirm title={confirmTitle} description={confirmDescription} confirmLabel={pendingAction.kind === "clear" ? "Clear report" : "Remove file"} onCancel={() => setPendingAction(null)} onConfirm={confirmAction} />}
    </section>
  );
};

export default FileWorkspace;
