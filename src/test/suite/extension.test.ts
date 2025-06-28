import * as assert from 'assert';
import * as vscode from 'vscode';
import * as minimatch from 'minimatch';

suite('Golang Go to Implementation Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('comerc.golang-go-to-impl'));
  });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('comerc.golang-go-to-impl');
    assert.ok(extension);

    if (!extension!.isActive) {
      await extension!.activate();
    }

    assert.ok(extension!.isActive);
  });

  test('Command should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('golangGoToImplementation'));
  });

  test('Configuration should be accessible', () => {
    const config = vscode.workspace.getConfiguration('golangGoToImplementation');
    assert.ok(config);

    const excludePatterns = config.get('excludePatterns');
    assert.ok(Array.isArray(excludePatterns));
  });

  test('Default exclude patterns should be set', () => {
    const config = vscode.workspace.getConfiguration('golangGoToImplementation');
    const excludePatterns: string[] = config.get('excludePatterns', []);

    assert.ok(excludePatterns.length > 0);
    assert.ok(excludePatterns.includes('**/*_mock.go'));
    assert.ok(excludePatterns.includes('**/mock/**/*.go'));
    assert.ok(excludePatterns.includes('**/mocks/**/*.go'));
    assert.ok(excludePatterns.includes('**/mock_*.go'));
  });
}); 