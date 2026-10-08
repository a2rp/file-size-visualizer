import { FiArrowDown, FiFile, FiHardDrive, FiShield } from "react-icons/fi";
import BackToTop from "./components/backToTop/index.jsx";
import FileWorkspace from "./components/fileWorkspace/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => (
  <div className={styles.appShell} id="top">
    <SiteHeader />
    <main>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}><p className={styles.heroLabel}><FiHardDrive aria-hidden="true" /> FILE METADATA / LOCAL ANALYSIS</p><h1 id="hero-title">Make file sizes<br /><span>make sense.</span></h1><p className={styles.heroDescription}>See the space behind a folder of files. Compare formats, find the largest items, and build a clear size report without opening or uploading file contents.</p><a href="#files" className={styles.heroLink}>Inspect a file selection <FiArrowDown aria-hidden="true" /></a><p className={styles.safeNote}><FiShield aria-hidden="true" /> Your file contents stay on this device.</p></div>
          <div className={styles.heroVisual} aria-label="Illustrative file size distribution preview"><div className={styles.visualTop}><span><i /> SIZE MAP / SAMPLE</span><b>NOT YOUR FILES</b></div><div className={styles.fileTiles}><article><b>MP4</b><span>4.8 GB</span></article><article><b>PNG</b><span>1.2 GB</span></article><article><b>PDF</b><span>720 MB</span></article><article><b>ZIP</b><span>340 MB</span></article><article><b>JS</b><span>86 MB</span></article><article><b>OTHER</b><span>24 MB</span></article></div><div className={styles.visualFoot}><span>Proportional tile preview</span><span>LOCAL ONLY</span></div></div>
        </div>
        <div className={styles.heroRail}><span>Names, MIME types, sizes</span><span>200 FILE LIMIT <i /></span></div>
      </section>
      <FileWorkspace />
      <section className={styles.about} id="about" aria-labelledby="about-title"><div className={styles.aboutInner}><div><p>What the report reads</p><h2 id="about-title">File details, without file contents.</h2><span>The browser's file picker provides the metadata used to build each size report.</span></div><div className={styles.aboutGrid}><article><span>01</span><FiFile aria-hidden="true" /><h3>Name and type</h3><p>File names and MIME types help organize the selection into readable groups.</p></article><article><span>02</span><FiHardDrive aria-hidden="true" /><h3>Byte size</h3><p>File sizes are totaled and compared without reading any bytes from the files.</p></article><article><span>03</span><FiShield aria-hidden="true" /><h3>Device only</h3><p>Nothing is uploaded. The report stays in the current browser tab.</p></article></div></div></section>
    </main>
    <SiteFooter />
    <BackToTop />
  </div>
);

export default App;
