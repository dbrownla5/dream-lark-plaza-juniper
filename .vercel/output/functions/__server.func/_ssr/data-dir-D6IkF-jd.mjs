import { r as __exportAll } from "../_runtime.mjs";
import { c as __exportAll$1 } from "./ssr.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/data-dir-D6IkF-jd.js
var data_dir_D6IkF_jd_exports = /* @__PURE__ */ __exportAll({
	a: () => pgliteDir,
	i: () => ensureDataDirs,
	n: () => data_dir_exports,
	o: () => storageDir,
	r: () => diskStorageEnabled,
	t: () => dataDir
});
var data_dir_exports = /* @__PURE__ */ __exportAll$1({
	dataDir: () => dataDir,
	diskStorageEnabled: () => diskStorageEnabled,
	ensureDataDirs: () => ensureDataDirs,
	pgliteDir: () => pgliteDir,
	storageDir: () => storageDir
});
/** Durable data root. Neon/Vercel keep rows in Postgres; this host keeps files on disk. */
function dataDir() {
	return process.env.DATA_DIR?.trim() || join(process.cwd(), "data");
}
function pgliteDir() {
	return join(dataDir(), "pglite");
}
function storageDir() {
	return join(dataDir(), "storage");
}
function diskStorageEnabled() {
	if (process.env.VERCEL === "1") return false;
	return process.env.DISK_STORAGE !== "0";
}
function ensureDataDirs() {
	mkdirSync(pgliteDir(), { recursive: true });
	if (diskStorageEnabled()) mkdirSync(storageDir(), { recursive: true });
}
//#endregion
export { pgliteDir as a, ensureDataDirs as i, data_dir_D6IkF_jd_exports as n, storageDir as o, diskStorageEnabled as r, dataDir as t };
