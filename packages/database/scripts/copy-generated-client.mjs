import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, "..");
const sourceDir = resolve(projectRoot, "src/generated");
const targetDir = resolve(projectRoot, "dist/generated");

await rm(targetDir, { recursive: true, force: true });
await mkdir(resolve(projectRoot, "dist"), { recursive: true });
await cp(sourceDir, targetDir, { recursive: true });
