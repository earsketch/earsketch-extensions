# EarSketch Extensions

The official collection of EarSketch extension panels.

## Quickstart from hello-world (recommended)

This is the quickest way to create an extension because all tooling, config files, and project structure are already in place.

Copy the `hello-world` extension, which is already configured to use the shared TypeScript, Vite, ESLint, and Prettier setup.

```sh
cp -R extensions/hello-world extensions/my-extension
```

After copying the extension:

- Change the `name` in `package.json`

- Change the `name` in `public/es-ext.json`

- Update the contents of `README.md`

### Install and run

From the repository root:

```sh
npm install
npm run dev --workspace my-extension
```

## Quickstart from a new Vite project

Use this approach when working in a separate repository or when you do not want to use the shared configurations provided here.

Create a new Vite project with the React and TypeScript template:

```sh
npm create vite@latest my-extension -- --template react-ts
cd my-extension
npm install
npm run dev
```

### Update the extension manifest

Create `public/es-ext.json` with the extension's metadata:

```json
{
  "manifest_version": 1,
  "extension_api_version": "1",
  "name": "My Extension",
  "version": "1.0",
  "description": "An extension for EarSketch",
  "icons": {
    "32": "favicon.ico",
    "128": "favicon.ico"
  },
  "side_panel": {
    "default_path": "index.html"
  },
  "permissions": ["sidePanel"]
}
```

## Permissions

To interact with EarSketch, extensions declare the permissions they need. The following values are supported in the manifest's `permissions` array:

- `getColorTheme`: Read color theme
- `getCurrentUser`: Read current user information
- `getDawState`: Access DAW state
- `getEditorContents`: Read editor contents
- `getPlaybackStatus`: Access playback status
- `getScriptExecutionResult`: Access script execution results
- `getTempoMap`: Access tempo map and beat timestamps
- `pasteCode`: Insert code into the editor
- `sidePanel`: Display a side panel
