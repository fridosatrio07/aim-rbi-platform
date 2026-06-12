import { rmSync } from "node:fs";
import { resolve } from "node:path";

const nextCachePath = resolve(process.cwd(), ".next");
rmSync(nextCachePath, { recursive: true, force: true });
console.log("Cleaned Next.js generated cache: .next");