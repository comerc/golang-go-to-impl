import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Golang "Go to Implementation" (filters excludeFiles + only real implementations)
    const disposable = vscode.commands.registerCommand('golangGoToImplementation', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const position = editor.selection.active;
        const uri = editor.document.uri;

        // Fetch original implementations
        const locations = await vscode.commands.executeCommand<vscode.Location[]>(
            'vscode.executeImplementationProvider',
            uri,
            position
        );

        if (!locations || locations.length === 0) {
            vscode.window.showInformationMessage('No implementations found.');
            return;
        }

        // Load user configuration
        const config = vscode.workspace.getConfiguration('golangGoToImplementation');
        const excludePatterns: string[] = config.get('excludePatterns', [
            "**/*_mock.go",
            "**/mock/**/*.go",
            "**/mocks/**/*.go",
            "**/mock_*.go"
        ]);

        // Filter out excluded files using custom glob pattern matching
        const filtered = locations.filter(location => {
            const relativePath = vscode.workspace.asRelativePath(location.uri.fsPath);
            const isExcluded = excludePatterns.some(pattern => matchesPattern(relativePath, pattern));
            return !isExcluded;
        });

        // Filter to only real implementations (functions with receivers)
        const finalLocations = await filterRealImplementations(filtered);

        if (finalLocations.length === 0) {
            vscode.window.showInformationMessage('No implementations found.');
            return;
        }

        if (finalLocations.length === 1) {
            await vscode.window.showTextDocument(finalLocations[0].uri, {
                selection: finalLocations[0].range
            });
        } else {
            const quickPickItems = finalLocations.map(loc => ({
                label: vscode.workspace.asRelativePath(loc.uri),
                description: '',
                location: loc
            }));

            const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
                placeHolder: 'Select an implementation to navigate to'
            });

            if (selectedItem) {
                await vscode.window.showTextDocument(selectedItem.location.uri, {
                    selection: selectedItem.location.range
                });
            }
        }
    });

    context.subscriptions.push(disposable);
}

// Proper glob pattern matcher
function matchesPattern(relativePath: string, pattern: string): boolean {
    // Convert glob pattern to regex properly
    let regexPattern = pattern
        // Handle glob patterns first - be more specific about ** vs *
        .replace(/\*\*\/\*/g, '§DOUBLESTAR_SLASH_STAR§')  // **/* pattern
        .replace(/\*\*/g, '§DOUBLESTAR§')                 // ** pattern
        .replace(/\*/g, '§STAR§')                         // * pattern
        .replace(/\?/g, '§QUESTION§')                     // ? pattern
        // Then escape special regex characters
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        // Then restore glob patterns as regex
        .replace(/§DOUBLESTAR_SLASH_STAR§/g, '.*')        // **/* matches any path
        .replace(/§DOUBLESTAR§/g, '.*')                   // ** matches any directory depth
        .replace(/§STAR§/g, '[^/]*')                      // * matches anything except /
        .replace(/§QUESTION§/g, '.');                     // ? matches single character

    const regex = new RegExp('^' + regexPattern + '$');
    const result = regex.test(relativePath);

    // console.log('[DEBUG] Pattern:', pattern, '→ regex:', regexPattern, 'against:', relativePath, 'result:', result);
    return result;
}

async function filterRealImplementations(locations: vscode.Location[]): Promise<vscode.Location[]> {
    const realImplementations: vscode.Location[] = [];

    for (const location of locations) {
        try {
            const document = await vscode.workspace.openTextDocument(location.uri);
            const lineText = document.lineAt(location.range.start.line).text;

            // Check if this line contains a function with receiver
            // Pattern: func (receiver Type) methodName(
            const receiverPattern = /func\s*\(\s*\w+\s+[\w\*\[\]]+\s*\)\s*\w+\s*\(/;

            if (receiverPattern.test(lineText)) {
                realImplementations.push(location);
            } else {
                // Also check the next few lines in case the function signature spans multiple lines
                const startLine = location.range.start.line;
                const endLine = Math.min(startLine + 3, document.lineCount - 1);

                let multiLineText = '';
                for (let i = startLine; i <= endLine; i++) {
                    multiLineText += document.lineAt(i).text + ' ';
                }

                if (receiverPattern.test(multiLineText)) {
                    realImplementations.push(location);
                }
            }
        } catch (error) {
            console.log('[DEBUG] Error reading file:', location.uri.fsPath, error);
            // If we can't read the file, include it anyway to be safe
            realImplementations.push(location);
        }
    }

    return realImplementations;
}

export function deactivate() { }