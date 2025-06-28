import * as path from 'path';
import * as fs from 'fs';
import Mocha from 'mocha';

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((c, e) => {
    try {
      // Find test files
      const testFiles = findTestFiles(testsRoot);

      // Add files to the test suite
      testFiles.forEach(f => mocha.addFile(f));

      // Run the mocha test
      mocha.run(failures => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      console.error(err);
      e(err);
    }
  });
}

function findTestFiles(dir: string): string[] {
  const testFiles: string[] = [];

  function searchDir(currentDir: string) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (file.endsWith('.test.js')) {
        testFiles.push(fullPath);
      }
    }
  }

  searchDir(dir);
  return testFiles;
} 