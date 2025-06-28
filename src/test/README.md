# Tests for Go to Implementation (Golang) Extension

This directory contains tests for the VS Code extension that enhances "Go to Implementation" functionality for Go projects.

## Test Structure

### `suite/extension.test.ts`
Core extension tests:
- Extension presence verification
- Extension activation
- Command registration
- Configuration availability
- Default settings

### `suite/excludePatterns.test.ts`
File exclusion pattern tests:
- Excluding mock files with `_mock` suffix
- Excluding files in `mock/` and `mocks/` directories
- Excluding files with `mock_` prefix
- Handling custom patterns
- Path normalization (Windows/Unix)

### `suite/filterRealImplementations.test.ts`
Real implementation filtering tests:
- Detecting functions with receivers
- Excluding interface declarations
- Handling multi-line function signatures
- Supporting complex receiver types

### `suite/integration.test.ts`
Integration tests:
- Handling empty arrays
- Graceful handling of file read errors
- Path normalization
- Complex Go function signatures
- Configuration changes

### `suite/performance.test.ts`
Performance tests:
- Filtering large numbers of files
- Regex matching efficiency
- Path normalization speed

## Running Tests

```bash
# Run all tests
npm test

# Compile only
npm run compile

# Linting
npm run lint

# Compile + lint + tests
npm run pretest
```

## Test Configuration

- **Test runner**: Mocha
- **Test framework**: TDD style
- **VS Code API**: @vscode/test-electron
- **Types**: @types/mocha, @types/node

## Test Coverage

Tests cover:
- ✅ Core extension functionality
- ✅ File exclusion patterns
- ✅ Real implementation filtering
- ✅ Error handling
- ✅ Performance
- ✅ Integration scenarios

## Notes

- Tests run in an isolated VS Code environment
- Uses real VS Code API
- Tests don't require a real Go project
- All mock data is generated programmatically 