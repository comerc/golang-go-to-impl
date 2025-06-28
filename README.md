# Go to Implementation (Golang)

[![Test](https://github.com/comerc/golang-go-to-impl/actions/workflows/test.yml/badge.svg)](https://github.com/comerc/golang-go-to-impl/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Project status](https://img.shields.io/github/release/comerc/golang-go-to-impl.svg?123)](https://github.com/comerc/golang-go-to-impl/releases/latest)

**A Visual Studio Code extension to exclude some files when using "Go to Implementation" in Go projects.**

## Description

This extension improves the default **Go to Implementation** behavior in Visual Studio Code for Go projects by **filtering out some files** (e.g., `*_mock.go`, `mocks/*`) from navigation results. It is ideal for projects using generators like [uber-go/mock](https://github.com/uber-go/mock) or [vektra/mockery](https://github.com/vektra/mockery) etc. Also useful for ignoring external packages (e.g., with adapters).

## Key Features

- ✅ Filters files based on customizable glob patterns (e.g., `**/*_mock.go`, `**/mocks/**/*.go`).
- ✅ Customize mock file patterns via `settings.json`.
- ✅ Displays a pick list if multiple valid implementations exist.
- ✅ Provides an enhanced **Go to Implementation** with `ctrl+alt+f12` (`cmd+opt+f12` on Mac) while keeping the native command unchanged.

## Manual Installation

1. Clone the repository:
```bash
$ git clone https://github.com/comerc/golang-go-to-impl.git
```
2. Navigate to the directory:
```bash
$ cd golang-go-to-impl
```
3. Install dependencies:
```bash
$ npm install
```
4. Build the project:
```bash
$ npm run compile
```
5. Run the extension in debug mode (for development):
  - Open the folder in VS Code.
  - Press `F5` to launch the extension host.
6. Create a VSIX package:
```bash
$ npm run package
```
7. Install the extension via Command Palette: 
"Extensions: Install from VSIX..."

## Usage

1. Open a `.go` file in Visual Studio Code.
2. Click on an **interface method** or **function signature**.
3. Press `ctrl+alt+f12` (`cmd+opt+f12` on Mac) to trigger **Go to Implementation**.
4. The extension will:
   - Fetch implementation locations from the language server (e.g., `gopls`).
   - Filter out mock files based on configured patterns.
   - Navigate to the result or show a pick list.
5. Easy navigation back with `alt+f12` (`opt+f12` on Mac) to return to the previous location.

## Configuration

Customize mock file patterns in `settings.json`:

```js
{
  "golangGoToImplementation.excludePatterns": [
    "**/*_mock.go",     // Files ending with _mock.go
    "**/mock/**/*.go",  // Files in mock directories
    "**/mocks/**/*.go", // Files in mocks directories
    "**/mock_*.go",     // Files starting with mock_ followed by any characters
  ]
}
```

### Example Custom Patterns:
```js
{
  "golangGoToImplementation.excludePatterns": [
    "**/test/**",       // Files in test directories
    "**/testdata/**",   // Files in test directories
    "**/stubs/**/*.go", // Files in stubs directories
    "**/generated/*.go" // Auto-generated files
  ]
}
```

## Dependencies

- **[gopls](https://pkg.go.dev/golang.org/x/tools/gopls)**: Go language server supporting **Go to Implementation**.
- **[minimatch](https://www.npmjs.com/package/minimatch)**: For flexible glob pattern matching.

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork this repository.
2. Create a feature branch: `git checkout -b new-feature`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin new-feature`.
5. Submit a Pull Request.

## License

MIT © [comerc](https://github.com/comerc)

## Issues or Suggestions?

Report bugs or request features at:
[https://github.com/comerc/golang-go-to-impl/issues](https://github.com/comerc/golang-go-to-impl/issues)

## Keywords

`Go`, `Golang`, `VSCode`, `Mock`, `Go to Implementation`, `gopls`, `Mock Generator`, `Interface Navigation`

## Notes

- Works only for Go files (`editorLangId == 'go'`).
- Does not interfere with built-in commands for other languages.

## Example Output

### Before (Without Extension)
```
interfaces.go:10: func DoSomething()
→ Implementations found:
  - service.go
  - mocks/mock_service.go
  - testdata/fake_service.go
```

### After (With Extension)
```
interfaces.go:10: func DoSomething()
→ Implementations found:
  - service.go
```

## Video

### Before (Without Extension)

[![Before](https://img.youtube.com/vi/UBpYWz70xFU/0.jpg)](https://www.youtube.com/watch?v=UBpYWz70xFU&t=0.25)

### After (With Extension)

[![After](https://img.youtube.com/vi/kbm4_u_xArI/0.jpg)](https://www.youtube.com/watch?v=kbm4_u_xArI&t=0.25)
