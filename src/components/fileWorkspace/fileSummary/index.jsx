import { FiBarChart2, FiFile, FiMaximize2, FiPieChart } from "react-icons/fi";
import { fileCategories, formatBytes } from "../../../utils/files.js";
import styles from "./styles.module.css";

const metrics = [
  { key: "fileCount", label: "FILES IN VIEW", icon: FiFile, format: (summary) => String(summary.fileCount) },
  { key: "totalBytes", label: "TOTAL SIZE", icon: FiPieChart, format: (summary) => formatBytes(summary.totalBytes) },
  { key: "largest", label: "LARGEST FILE", icon: FiMaximize2, format: (summary) => summary.largest ? formatBytes(summary.largest.size) : "--" },
  { key: "averageBytes", label: "AVERAGE FILE", icon: FiBarChart2, format: (summary) => summary.fileCount ? formatBytes(summary.averageBytes) : "--" },
];

const FileSummary = ({ summary }) => (
  <section className={styles.summary} aria-label="File size summary">
    <div className={styles.metrics}>{metrics.map(({ key, label, icon: Icon, format }) => <article key={key}><span className={styles.metricIcon}><Icon aria-hidden="true" /></span><small>{label}</small><strong title={key === "largest" && summary.largest ? summary.largest.name : undefined}>{format(summary)}</strong>{key === "largest" && summary.largest && <span className={styles.largestName} title={summary.largest.name}>{summary.largest.name}</span>}</article>)}</div>
    <div className={styles.breakdown}>
      <div className={styles.breakdownHeading}><div><p>FILE MIX</p><h2>Where the bytes live</h2></div><span>{summary.categories.length} {summary.categories.length === 1 ? "type" : "types"}</span></div>
      {summary.fileCount ? (
        <>
          <div className={styles.stackedBar} role="img" aria-label={`File size distribution across ${summary.categories.length} categories`}>
            {summary.categories.map((category) => <span key={category.id} style={{ width: `${category.share * 100}%`, backgroundColor: category.color }} title={`${category.label}: ${(category.share * 100).toFixed(1)}%`} />)}
          </div>
          <div className={styles.categoryGrid}>{summary.categories.map((category) => <article key={category.id}>
            <div><i style={{ backgroundColor: category.color }} /><b>{category.label}</b><span>{category.count} {category.count === 1 ? "file" : "files"}</span></div>
            <strong>{formatBytes(category.bytes)}</strong>
            <small>{(category.share * 100).toFixed(1)}% of total size</small>
          </article>)}</div>
        </>
      ) : (
        <div className={styles.emptyBreakdown}><span>{fileCategories.length} file categories</span><p>Add files to see the size breakdown.</p></div>
      )}
    </div>
  </section>
);

export default FileSummary;
