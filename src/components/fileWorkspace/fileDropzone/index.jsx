import { useState } from "react";
import { FiFolder, FiUploadCloud } from "react-icons/fi";
import styles from "./styles.module.css";

const FileDropzone = ({ onFiles, disabled }) => {
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    if (fileList?.length) onFiles(Array.from(fileList));
  };

  return (
    <section className={`${styles.zone} ${dragging ? styles.dragging : ""} ${disabled ? styles.disabled : ""}`} aria-label="Add files for size analysis" onDragEnter={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }} onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); if (!disabled) handleFiles(event.dataTransfer.files); }}>
      <label className={styles.label} htmlFor="file-picker">
        <input id="file-picker" type="file" multiple disabled={disabled} onChange={(event) => { handleFiles(event.target.files); event.target.value = ""; }} />
        <span className={styles.uploadIcon}><FiUploadCloud aria-hidden="true" /></span>
        <strong>{dragging ? "Drop files to add them" : "Drop files here"}</strong>
        <span className={styles.description}>or <b>browse your device</b> to choose files</span>
        <span className={styles.detail}><FiFolder aria-hidden="true" /> Up to 200 files · nothing is uploaded</span>
      </label>
    </section>
  );
};

export default FileDropzone;
