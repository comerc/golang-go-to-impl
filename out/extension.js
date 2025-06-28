"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const minimatch_1 = __importDefault(require("minimatch"));
function activate(context) {
    // Golang "Go to Implementation" (filters excludeFiles + only real implementations)
    const disposable = vscode.commands.registerCommand('golangGoToImplementation', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const position = editor.selection.active;
        const uri = editor.document.uri;
        // Fetch original implementations
        const locations = await vscode.commands.executeCommand('vscode.executeImplementationProvider', uri, position);
        if (!locations || locations.length === 0) {
            vscode.window.showInformationMessage('No implementations found.');
            return;
        }
        // Load user configuration
        const config = vscode.workspace.getConfiguration('golangGoToImplementation');
        const excludePatterns = config.get('excludePatterns', [
            "**/*_mock.go",
            "**/mock/**/*.go",
            "**/mocks/**/*.go",
            "**/mock_*.go"
        ]);
        // Normalize and filter out excluded files
        const filtered = locations.filter(location => {
            const normalizedPath = location.uri.fsPath.replace(/\\/g, '/');
            const isExcluded = excludePatterns.some(pattern => (0, minimatch_1.default)(normalizedPath, pattern));
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
        }
        else {
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
exports.activate = activate;
async function filterRealImplementations(locations) {
    const realImplementations = [];
    for (const location of locations) {
        try {
            const document = await vscode.workspace.openTextDocument(location.uri);
            const lineText = document.lineAt(location.range.start.line).text;
            // Check if this line contains a function with receiver
            // Pattern: func (receiver Type) methodName(
            const receiverPattern = /func\s*\(\s*\w+\s+[\w\*\[\]]+\s*\)\s*\w+\s*\(/;
            if (receiverPattern.test(lineText)) {
                realImplementations.push(location);
            }
            else {
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
        }
        catch (error) {
            console.log('[DEBUG] Error reading file:', location.uri.fsPath, error);
            // If we can't read the file, include it anyway to be safe
            realImplementations.push(location);
        }
    }
    return realImplementations;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map