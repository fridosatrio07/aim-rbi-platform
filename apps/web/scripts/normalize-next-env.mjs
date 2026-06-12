import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const filePath = resolve(process.cwd(), "next-env.d.ts");
if (!existsSync(filePath)) process.exit(0);

const content = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`;

writeFileSync(filePath, content, "utf8");
console.log("Normalized next-env.d.ts to the repository dev-time route type reference.");