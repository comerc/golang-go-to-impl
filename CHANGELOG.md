# Changelog

All notable changes to the "golang-go-to-impl" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-XX

### Added
- Initial release of Go to Implementation (Golang) extension
- Filter mock files using configurable glob patterns
- Enhanced "Go to Implementation" command with `Ctrl+Alt+F12` / `Cmd+Alt+F12`
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