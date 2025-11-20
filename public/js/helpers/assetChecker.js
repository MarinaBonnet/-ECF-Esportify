import { readdirSync, readFileSync, watch, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import chalk from "chalk"; // npm install chalk

const modulesPath = resolve("./plateforme/js/modules");

const nativeFunctions = new Set([
  "console",
  "document",
  "window",
  "setTimeout",
  "setInterval",
  "querySelector",
  "querySelectorAll",
  "getElementById",
  "addEventListener",
  "remove",
  "add",
  "includes",
  "toggle",
  "getAttribute",
  "setAttribute",
  "toString",
  "createElement",
  "appendChild",
  "preventDefault",
  "focus",
  "trim",
  "play",
  "catch",
  "animate",
  "clearRect",
  "random",
  "requestAnimationFrame",
  "floor",
  "hsla",
  "beginPath",
  "moveTo",
  "lineTo",
  "stroke",
  "Date",
  "json",
  "error",
  "closest",
  "parseInt",
  "find",
  "map",
  "split",
  "prepend",
  "reset",
  "showModal",
  "openMenu",
  "closeMenu",
  "removeAttribute",
]);

function getJSFiles(dir) {
  try {
    return readdirSync(dir).filter((file) => file.endsWith(".js"));
  } catch (err) {
    console.log(chalk.red(`❌ Erreur lecture dossier : ${err.message}`));
    return [];
  }
}

function readFileContent(filePath) {
  try {
    return readFileSync(filePath, "utf-8");
  } catch (err) {
    console.log(
      chalk.red(`❌ Erreur lecture fichier ${filePath} : ${err.message}`)
    );
    return "";
  }
}

function extractExportedFunctions(content) {
  const matches = content.matchAll(/export function (\w+)/g);
  return [...matches].map((m) => m[1]);
}

function extractUsedFunctions(content) {
  const matches = content.matchAll(/\b(\w+)\(/g);
  return new Set([...matches].map((m) => m[1]));
}

function extractImportedFunctions(content) {
  const matches = content.matchAll(/import .*{([^}]+)}.*from/g);
  const imported = new Set();
  for (const match of matches) {
    for (const fn of match[1].split(",")) {
      imported.add(fn.trim());
    }
  }
  return imported;
}

function logUnusedFunctions(filesContentMap) {
  console.log(chalk.yellow("🧹 Fonctions non utilisées :"));
  const allContent = Object.values(filesContentMap).join("\n");
  const globalUsage = extractUsedFunctions(allContent);

  const result = [];

  for (const [file, content] of Object.entries(filesContentMap)) {
    const exported = extractExportedFunctions(content);
    const unused = exported.filter((fn) => !globalUsage.has(fn));
    if (unused.length) {
      console.log(chalk.red(`- ${file} : ${unused.join(", ")}`));
      result.push({ file, unused });
    }
  }

  return result;
}

function logMissingImports(filesContentMap) {
  console.log(chalk.yellow("\n🚨 Imports manquants :"));

  const result = [];

  for (const [file, content] of Object.entries(filesContentMap)) {
    const used = extractUsedFunctions(content);
    const declared = new Set(extractExportedFunctions(content));
    const imported = extractImportedFunctions(content);

    const missing = [];
    for (const fn of used) {
      if (!declared.has(fn) && !imported.has(fn) && !nativeFunctions.has(fn)) {
        missing.push(fn);
      }
    }

    if (missing.length) {
      console.log(chalk.red(`- ${file} : ${missing.join(", ")}`));
      result.push({ file, missing });
    }
  }

  return result;
}

function runDiagnostics() {
  console.clear();
  console.log(chalk.cyanBright("✅ Lancement du diagnostic Esportify\n"));

  const files = getJSFiles(modulesPath);
  const filesContentMap = {};

  for (const file of files) {
    const fullPath = join(modulesPath, file);
    filesContentMap[file] = readFileContent(fullPath);
  }

  const unused = logUnusedFunctions(filesContentMap);
  const missing = logMissingImports(filesContentMap);

  console.log(chalk.greenBright("\n✅ Analyse terminée."));

  return { unusedFunctions: unused, missingImports: missing };
}

const diagnostic = runDiagnostics();

if (process.argv.includes("--watch")) {
  console.log(
    chalk.magenta("\n👀 Mode watch activé — surveillance des fichiers...")
  );
  watch(modulesPath, { recursive: true }, () => {
    const diag = runDiagnostics();
    exportToJSON(diag);
  });
}

function exportToJSON(data, filename = "diagnostic.json") {
  try {
    writeFileSync(
      `./plateforme/dev/${filename}`,
      JSON.stringify(data, null, 2)
    );
    console.log(chalk.green(`📦 Export JSON réussi : ${filename}`));
  } catch (err) {
    console.log(chalk.red(`❌ Erreur export JSON : ${err.message}`));
  }
}

exportToJSON(diagnostic);
