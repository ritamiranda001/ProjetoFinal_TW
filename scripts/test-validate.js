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

const runValidate = (rootPath) => {
  return spawnSync(process.execPath, [validateScript, "--root", rootPath], {
    encoding: "utf8",
  });
};

const assert = (condition, message) => {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
};

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "validate-test-"));

createRequiredStructure(tempRoot);
const validResult = runValidate(tempRoot);
assert(
  validResult.status === 0,
  "Expected validate to pass for valid structure.",
);

fs.rmSync(path.join(tempRoot, "src/app/core/models"), {
  recursive: true,
  force: true,
});
const invalidResult = runValidate(tempRoot);
assert(
  invalidResult.status === 1,
  "Expected validate to fail when structure is missing.",
);

console.log("validate-project.js tests passed.");
process.exit(0);
