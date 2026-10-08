import { useState } from "react";
import { FiArchive, FiCode, FiDownload, FiFile, FiFileText, FiFilm, FiImage, FiMusic, FiSearch, FiTrash2 } from "react-icons/fi";
import { fileCategories, filterFiles, formatBytes, getFileCategory, getFileTypeLabel, sortFiles } from "../../../utils/files.js";
import styles from "./styles.module.css";

const categoryIcons = { image: FiImage, video: FiFilm, audio: FiMusic, document: FiFileText, archive: FiArchive, code: FiCode, other: FiFile };

const FileTable = ({ files, onRequestRemove, onRequestClear, onExport }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("largest");
  const filtered = sortFiles(filterFiles(files, query, category), sort);

  return (
    <section className={styles.tablePanel} aria-labelledby="file-list-title">
      <div className={styles.heading}><div><p>SELECTED FILES</p><h2 id="file-list-title">File inventory</h2><span>{filtered.length} of {files.length} files shown</span></div>{files.length > 0 && <div className={styles.actions}><button type="button" onClick={onExport}><FiDownload aria-hidden="true" /> Export report</button><button className={styles.clearButton} type="button" onClick={onRequestClear}><FiTrash2 aria-hidden="true" /> Clear all</button></div>}</div>
      {files.length > 0 && <div className={styles.filters}>
        <label className={styles.search} htmlFor="file-search"><FiSearch aria-hidden="true" /><input id="file-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a file by name or type" /></label>
        <label className={styles.selectFilter} htmlFor="file-category"><span>Type</span><select id="file-category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All types</option>{fileCategories.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label className={styles.selectFilter} htmlFor="file-sort"><span>Sort</span><select id="file-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="largest">Largest first</option><option value="smallest">Smallest first</option><option value="name">Name</option><option value="type">File type</option></select></label>
      </div>}
      {filtered.length > 0 ? (
        <div className={styles.tableScroll}>
          <table>
            <caption>Local file names, types, and sizes. File contents are not read.</caption>
            <thead><tr><th scope="col">File name</th><th scope="col">Category</th><th scope="col">Type</th><th scope="col" className={styles.numeric}>Size</th><th scope="col"><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>
            <tbody>{filtered.map((file) => {
              const fileCategory = getFileCategory(file);
              const Icon = categoryIcons[fileCategory];
              return <tr key={file.id}><td><div className={styles.fileName}><span style={{ color: fileCategories.find((item) => item.id === fileCategory)?.color }}><Icon aria-hidden="true" /></span><b title={file.name}>{file.name}</b></div></td><td><span className={styles.category}>{fileCategories.find((item) => item.id === fileCategory)?.label}</span></td><td><span className={styles.type}>{getFileTypeLabel(file)}</span></td><td className={styles.numeric}>{formatBytes(file.size)}</td><td><button className={styles.removeButton} type="button" aria-label={`Remove ${file.name} from report`} onClick={() => onRequestRemove(file)}><FiTrash2 aria-hidden="true" /></button></td></tr>;
            })}</tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty}><span><FiSearch aria-hidden="true" /></span><h3>{files.length ? "No files match these filters" : "No files in the report yet"}</h3><p>{files.length ? "Try a different name or file category." : "Choose files above to see their sizes and types here."}</p>{files.length > 0 && <button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Reset filters</button>}</div>
      )}
    </section>
  );
};

export default FileTable;

