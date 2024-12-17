// scripts/extract-tests.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Funzione per cercare blocchi describe/it nei file
function extractTests(fileContent) {
  const describeRegex = /describe\(['"`](.*?)['"`]/g;
  const itRegex = /it\(['"`](.*?)['"`]/g;

  const tests = [];
  let match;

  while ((match = describeRegex.exec(fileContent))) {
    tests.push(`Describe: ${match[1]}`);
  }

  while ((match = itRegex.exec(fileContent))) {
    tests.push(`It: ${match[1]}`);
  }

  return tests;
}

// Analizza i file modificati
function analyzeFiles(files) {
  const result = [];

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const tests = extractTests(content);

      if (tests.length > 0) {
        result.push({ file, tests });
      }
    }
  });

  return result;
}

// Trova i file modificati (esempio con glob)
const testFiles = glob.sync('**/*.test.{js,ts}', { ignore: 'node_modules/**' });

const testResults = analyzeFiles(testFiles);

if (testResults.length > 0) {
  console.log('### Unit Test Modificati:');
  testResults.forEach((entry) => {
    console.log(`\n**File**: ${entry.file}`);
    entry.tests.forEach((test) => console.log(`- ${test}`));
  });
} else {
  console.log('Nessun test trovato.');
}
