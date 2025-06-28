import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

suite('Project Structure Tests', () => {

  const projectRoot = path.resolve(__dirname, '../../../');

  test('Should have all required project files', () => {
    const requiredFiles = [
      'package.json',
      'README.md',
      'LICENSE',
      'tsconfig.json',
      '.eslintrc.json',
      '.vscodeignore',
      'src/extension.ts'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(projectRoot, file);
      assert.ok(fs.existsSync(filePath), `Required file missing: ${file}`);
    });
  });

  test('Should have proper package.json structure', () => {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Check required fields
    assert.ok(packageContent.name, 'Package name is required');
    assert.ok(packageContent.version, 'Package version is required');
    assert.ok(packageContent.main, 'Package main entry is required');
    assert.ok(packageContent.engines, 'VS Code engine version is required');
    assert.ok(packageContent.contributes, 'Contributes section is required');

    // Check commands
    assert.ok(packageContent.contributes.commands, 'Commands should be defined');
    assert.ok(packageContent.contributes.commands.length > 0, 'At least one command should be defined');

    // Check keybindings
    assert.ok(packageContent.contributes.keybindings, 'Keybindings should be defined');
    assert.ok(packageContent.contributes.keybindings.length > 0, 'At least one keybinding should be defined');

    // Check configuration
    assert.ok(packageContent.contributes.configuration, 'Configuration should be defined');
    assert.ok(packageContent.contributes.configuration.properties, 'Configuration properties should be defined');
  });

  test('Should have proper TypeScript configuration', () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    assert.ok(tsconfigContent.compilerOptions, 'Compiler options should be defined');
    assert.ok(tsconfigContent.compilerOptions.target, 'Target should be defined');
    assert.ok(tsconfigContent.compilerOptions.module, 'Module should be defined');
    assert.ok(tsconfigContent.compilerOptions.outDir, 'Output directory should be defined');
  });

  test('Should have test files in correct location', () => {
    const testDir = path.join(projectRoot, 'src/test/suite');
    assert.ok(fs.existsSync(testDir), 'Test directory should exist');

    const testFiles = fs.readdirSync(testDir);
    const testFileCount = testFiles.filter(file => file.endsWith('.test.ts')).length;

    assert.ok(testFileCount >= 5, `Should have at least 5 test files, found ${testFileCount}`);
  });

  test('Should have proper .vscodeignore file', () => {
    const vscodeignorePath = path.join(projectRoot, '.vscodeignore');
    const content = fs.readFileSync(vscodeignorePath, 'utf8');

    // Should exclude development files
    assert.ok(content.includes('src/**'), 'Should exclude source files');
    assert.ok(content.includes('**/*.test.ts'), 'Should exclude test files');
    assert.ok(content.includes('.vscode/**'), 'Should exclude .vscode directory');
    assert.ok(content.includes('node_modules/**'), 'Should exclude node_modules');
  });

  test('Should have GitHub Actions workflow', () => {
    const workflowPath = path.join(projectRoot, '.github/workflows/test.yml');
    assert.ok(fs.existsSync(workflowPath), 'GitHub Actions workflow should exist');

    const content = fs.readFileSync(workflowPath, 'utf8');
    assert.ok(content.includes('npm run test:coverage') || content.includes('npm test'), 'Workflow should run tests');
    assert.ok(content.includes('npm run lint'), 'Workflow should run linter');
  });
}); 