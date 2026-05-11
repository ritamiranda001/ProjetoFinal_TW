const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const patterns = [
  /^grade-report-test-grupo\d+\.html$/,
  /^grade-report-mini\.html$/,
];

const files = fs
  .readdirSync(root)
  .filter((name) => patterns.some((re) => re.test(name)));

if (files.length === 0) {
  console.log("Nothing to clean up.");
  process.exit(0);
}

files.forEach((name) => {
  fs.rmSync(path.join(root, name));
  console.log(`Deleted: ${name}`);
});

console.log("\nCleanup done.");
