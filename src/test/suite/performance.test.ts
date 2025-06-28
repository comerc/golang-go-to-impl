import * as assert from 'assert';
import minimatch from 'minimatch';

suite('Performance Tests', () => {

  const defaultPatterns = [
    "**/*_mock.go",
    "**/mock/**/*.go",
    "**/mocks/**/*.go",
    "**/mock_*.go"
  ];

  test('Should filter large number of files efficiently', () => {
    // Generate test data
    const testFiles = [];
    for (let i = 0; i < 1000; i++) {
      testFiles.push(`pkg/service${i}.go`);
      testFiles.push(`pkg/service${i}_mock.go`);
      testFiles.push(`mock/service${i}.go`);
    }

    const startTime = Date.now();

    const filtered = testFiles.filter(file => {
      const shouldExclude = defaultPatterns.some(pattern => minimatch(file, pattern));
      return !shouldExclude;
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Filtered ${testFiles.length} files in ${duration}ms`);

    // Should complete within reasonable time (less than 100ms for 3000 files)
    assert.ok(duration < 100, `Filtering took too long: ${duration}ms`);

    // Should exclude mock files
    assert.ok(filtered.length < testFiles.length);

    // Verify no mock files remain
    const hasMockFiles = filtered.some(file =>
      file.includes('_mock.go') || file.includes('/mock/')
    );
    assert.ok(!hasMockFiles, 'Mock files should be filtered out');
  });

  test('Should handle regex pattern matching efficiently', () => {
    const receiverPattern = /func\s*\(\s*\w+\s+[\w\*\[\]]+\s*\)\s*\w+\s*\(/;

    const testLines = [];
    for (let i = 0; i < 1000; i++) {
      testLines.push(`func (r *Repo${i}) Method${i}() error {`);
      testLines.push(`func Method${i}() error {`);
      testLines.push(`type Interface${i} interface {`);
    }

    const startTime = Date.now();

    const matchingLines = testLines.filter(line => receiverPattern.test(line));

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Tested ${testLines.length} lines in ${duration}ms`);

    // Should complete within reasonable time
    assert.ok(duration < 50, `Regex matching took too long: ${duration}ms`);

    // Should find only lines with receivers
    assert.strictEqual(matchingLines.length, 1000);
  });

  test('Should handle path normalization efficiently', () => {
    const windowsPaths = [];
    for (let i = 0; i < 1000; i++) {
      windowsPaths.push(`C:\\Users\\test\\project\\pkg\\service${i}.go`);
      windowsPaths.push(`C:\\Users\\test\\project\\mock\\service${i}.go`);
    }

    const startTime = Date.now();

    const normalizedPaths = windowsPaths.map(path => path.replace(/\\/g, '/'));

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Normalized ${windowsPaths.length} paths in ${duration}ms`);

    // Should complete very quickly
    assert.ok(duration < 20, `Path normalization took too long: ${duration}ms`);

    // Verify normalization worked
    const hasBackslashes = normalizedPaths.some(path => path.includes('\\'));
    assert.ok(!hasBackslashes, 'All backslashes should be replaced');
  });
}); 