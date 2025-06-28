# Changelog

All notable changes to the "golang-go-to-impl" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-29

### Changed
- **BREAKING**: Replaced `minimatch` dependency with custom glob pattern implementation
- Improved glob pattern matching reliability for VS Code extension environment
- Enhanced pattern matching for files outside workspace (e.g., Go modules in pkg/mod)
- Better error handling and debug logging for pattern matching

### Fixed
- Resolved "command not found" errors caused by minimatch loading issues in VS Code
- Fixed glob pattern matching for external Go modules and dependencies
- Improved extension activation reliability

### Technical
- Removed external dependencies (`minimatch`) for better compatibility
- Custom glob-to-regex conversion with support for `**`, `*`, and `?` wildcards
- Uses only VS Code built-in APIs (`vscode.workspace.asRelativePath`)
- Reduced extension bundle size and eliminated dependency conflicts

### Why the change?
VS Code extensions run in a special environment where some Node.js modules (like `minimatch`) 
can cause loading failures and "command not found" errors. Our custom implementation is:
- More reliable in VS Code extension context
- Handles both workspace and external files correctly  
- Eliminates dependency-related activation issues
- Maintains full glob pattern compatibility

## [1.0.0] - 2025-06-28

### Added
- Initial release of Go to Implementation (Golang) extension
- Filter mock files using configurable glob patterns
- Enhanced "Go to Implementation" command with `Ctrl+Alt+F12` / `Cmd+Opt+F12`
- Support for common mock patterns: `**/*_mock.go`, `**/mock/**/*.go`, `**/mocks/**/*.go`, `**/mock_*.go`
- Real implementation filtering (functions with receivers only)
- Cross-platform path normalization
- Comprehensive test suite with 30 tests
- CI/CD pipeline with automated publishing to VS Code Marketplace and OpenVSX Registry

### Features
- Excludes mock files from Go to Implementation results
- Customizable exclude patterns via settings
- Graceful error handling for unreadable files
- Multi-line function signature support
- Performance optimized for large codebases

### Technical
- TypeScript implementation
- Uses minimatch for glob pattern matching
- Mocha test framework with @vscode/test-electron
- ESLint code quality checks
- Automated GitHub Actions workflows 