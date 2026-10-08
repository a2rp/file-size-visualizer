import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const FileConfirm = ({ title, description, confirmLabel, onCancel, onConfirm }) => {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
      if (event.key === "Tab" && event.shiftKey && document.activeElement === cancelRef.current) {
        event.preventDefault();
        confirmRef.current?.focus();
      } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === confirmRef.current) {
        event.preventDefault();
        cancelRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="file-confirm-title" aria-describedby="file-confirm-description">
        <span className={styles.icon}><FiAlertTriangle aria-hidden="true" /></span>
        <h2 id="file-confirm-title">{title}</h2>
        <p id="file-confirm-description">{description}</p>
        <div className={styles.actions}><button ref={cancelRef} type="button" onClick={onCancel}>Cancel</button><button ref={confirmRef} type="button" onClick={onConfirm}>{confirmLabel}</button></div>
      </section>
    </div>
  );
};

export default FileConfirm;
