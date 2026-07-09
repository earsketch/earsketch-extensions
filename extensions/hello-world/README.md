# hello-world

A example extension for getting started with development.

## Getting started

### Create a new react project using vite

```sh
npm create vite@latest

# Choose: "React", "Typescript", "ESLint"

npm install

npm run dev
```

### Add the extension manifest

```sh
touch public/es-ext.json
```

```json
{
  "manifest_version": 1,
  "extension_api_version": "1",
  "name": "Hello, World!",
  "version": "1.0",
  "description": "A simple extension starting point for development",
  "side_panel": {
    "default_path": "index.html"
  },
  "permissions": [
    "sidePanel"
  ]
}
```
