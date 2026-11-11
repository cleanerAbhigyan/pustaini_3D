import { readFile, mkdir, writeFile } from "node:fs/promises";
import { gzipSync, brotliCompressSync } from "node:zlib";

const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
function collect(key, seen = new Set()) {
  if (seen.has(key)) return seen;
  seen.add(key);
  for (const dep of manifest[key].imports ?? []) collect(dep, seen);
  return seen;
}
const initial = collect("index.html");
const lazyKey = Object.keys(manifest).find((key) =>
  key.endsWith("RunwayScene.tsx"),
);
const lazy = [...collect(lazyKey)].filter((key) => !initial.has(key));
async function sizes(keys) {
  return Promise.all(
    [...keys].map(async (key) => {
      const file = manifest[key].file;
      const buffer = await readFile(`dist/${file}`);
      return {
        file,
        bytes: buffer.length,
        gzipBytes: gzipSync(buffer).length,
        brotliBytes: brotliCompressSync(buffer).length,
      };
    }),
  );
}
const result = { initial: await sizes(initial), lazyRunway: await sizes(lazy) };
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/bundle-sizes.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
