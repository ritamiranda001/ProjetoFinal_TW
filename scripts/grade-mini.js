const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const validateScript = path.resolve(__dirname, "validate-project.js");

const createRequiredStructure = (rootPath) => {
  const requiredPaths = [
    "src/app",
    "src/app/core",
    "src/app/core/services",
    "src/app/core/models",
    "src/app/features",
    "src/app/shared",
  ];

  requiredPaths.forEach((dirPath) => {
    fs.mkdirSync(path.join(rootPath, dirPath), { recursive: true });
  });

  fs.writeFileSync(path.join(rootPath, "src/app/app.routes.ts"), "");
  fs.writeFileSync(path.join(rootPath, "src/app/app.config.ts"), "");
  fs.writeFileSync(path.join(rootPath, "README.md"), "");
  fs.writeFileSync(path.join(rootPath, "PROJECT_INFO.md"), "");
};

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "grade-mini-"));
createRequiredStructure(tempRoot);

const htmlReportPath = path.resolve(process.cwd(), "grade-report-mini.html");

console.log(`Mini project created at: ${tempRoot}`);
console.log("Running grade...\n");

const result = spawnSync(
  process.execPath,
  [validateScript, "--grade", "--root", tempRoot, "--html", htmlReportPath],
  {
    stdio: "inherit",
  },
);

fs.rmSync(tempRoot, { recursive: true, force: true });

console.log(`\nHTML report saved to: ${htmlReportPath}`);

if (result.status && result.status !== 0) {
  process.exit(result.status);
}

process.exit(0);
