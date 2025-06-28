import * as assert from 'assert';
import minimatch from 'minimatch';

suite('Exclude Patterns Tests', () => {

  const defaultPatterns = [
    "**/*_mock.go",
    "**/mock/**/*.go",
    "**/mocks/**/*.go",
    "**/mock_*.go"
  ];

  test('Should exclude mock files with _mock suffix', () => {
    const testFiles = [
      'repo_mock.go',
      'service_mock.go',
      'pkg/repo_mock.go',
      'internal/service_mock.go'
    ];

    testFiles.forEach(file => {
      const shouldExclude = defaultPatterns.some(pattern => minimatch(file, pattern));
      assert.ok(shouldExclude, `Should exclude: ${file}`);
    });
  });

  test('Should exclude files in mock directories', () => {
    const testFiles = [
      'mock/repo.go',
      'pkg/mock/service.go',
      'internal/mock/handler.go',
      'mocks/repo.go',
      'pkg/mocks/service.go'
    ];

    testFiles.forEach(file => {
      const shouldExclude = defaultPatterns.some(pattern => minimatch(file, pattern));
      assert.ok(shouldExclude, `Should exclude: ${file}`);
    });
  });

  test('Should exclude files with mock_ prefix', () => {
    const testFiles = [
      'mock_repo.go',
      'mock_service.go',
      'pkg/mock_handler.go'
    ];

    testFiles.forEach(file => {
      const shouldExclude = defaultPatterns.some(pattern => minimatch(file, pattern));
      assert.ok(shouldExclude, `Should exclude: ${file}`);
    });
  });

  test('Should NOT exclude regular Go files', () => {
    const testFiles = [
      'repo.go',
      'service.go',
      'handler.go',
      'pkg/repo.go',
      'internal/service.go',
      'cmd/main.go'
    ];

    testFiles.forEach(file => {
      const shouldExclude = defaultPatterns.some(pattern => minimatch(file, pattern));
      assert.ok(!shouldExclude, `Should NOT exclude: ${file}`);
    });
  });

  test('Should handle custom exclude patterns', () => {
    const customPatterns = [
      '**/test/**/*.go',
      '**/testdata/**/*.go',
      '**/generated/**/*.go'
    ];

    const testFiles = [
      'test/repo_test.go',
      'pkg/testdata/sample.go',
      'generated/proto.go'
    ];

    testFiles.forEach(file => {
      const shouldExclude = customPatterns.some(pattern => minimatch(file, pattern));
      assert.ok(shouldExclude, `Should exclude with custom pattern: ${file}`);
    });
  });

  test('Should handle path normalization', () => {
    const windowsPath = 'pkg\\mock\\repo.go';
    const normalizedPath = windowsPath.replace(/\\/g, '/');

    const shouldExclude = defaultPatterns.some(pattern => minimatch(normalizedPath, pattern));
    assert.ok(shouldExclude, `Should exclude normalized Windows path: ${normalizedPath}`);
  });
}); 