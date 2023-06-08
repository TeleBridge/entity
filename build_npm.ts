import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";
import pkg from "./package.json" assert { type: "json" };

const tag = Deno.env.get("GITHUB_REF");
const version = "0.1.0" // i don't even understand how this worked on @telegraf/entity but whatever

if (!version)
	throw new Error("VERSION environment variable not found. Use similar to `VERSION=0.1.0 deno run -A build_npm.ts`");

await emptyDir("./.npm");

// @ts-ignore
delete pkg.main, delete pkg.types, delete pkg.scripts;

await build({
	entryPoints: ["./mod.ts"],
	outDir: "./.npm",
	shims: {},
	test: false,
	mappings: { "https://deno.land/x/typegram@v5.0.0/mod.ts": { name: "typegram", version: "^5.0.0" } },
	package: { ...pkg, version },
});

// post build steps
Deno.copyFileSync("LICENSE", ".npm/LICENSE");
Deno.copyFileSync("README.md", ".npm/README.md");
