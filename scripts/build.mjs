import { readFile } from "node:fs/promises";
import { build } from "esbuild";

const output = "person-map-card.js";
const checking = process.argv.includes("--check");
const result = await build({
  entryPoints: ["src/index.js"],
  outfile: output,
  bundle: true,
  format: "iife",
  target: "es2022",
  loader: { ".css": "text" },
  banner: { js: "/* Generated from src/. Edit the source files, then run npm run build. */" },
  write: !checking,
});

if (checking) {
  const committed = await readFile(output, "utf8");
  if (committed !== result.outputFiles[0].text) {
    throw new Error("The dashboard file is out of date. Run npm run build.");
  }
  console.log("Dashboard file matches src/.");
}
