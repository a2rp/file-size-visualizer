import { FiGithub, FiHardDrive } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteHeader = () => (
  <header className={styles.header}>
    <div className={styles.bar}>
      <a className={styles.brand} href="#top" aria-label="File Size Visualizer home">
        <span className={styles.brandMark}><FiHardDrive aria-hidden="true" /></span>
        <span>File <b>Sizes</b></span>
      </a>
      <nav className={styles.navigation} aria-label="Main navigation">
        <a href="#files">Files</a>
        <a href="#about">How it works</a>
      </nav>
      <a className={styles.repository} href="https://github.com/a2rp/file-size-visualizer" target="_blank" rel="noreferrer">
        <FiGithub aria-hidden="true" /> <span>Repository</span>
      </a>
    </div>
  </header>
);

export default SiteHeader;

