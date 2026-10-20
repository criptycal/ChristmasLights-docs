# Christmas Lights documentation

Public buyer documentation for David Salamanca's Christmas Lights plugin for Unreal Engine, covering Fab installation, setup, and everyday use.

**Website:** https://criptycal.github.io/ChristmasLights-docs/

This repository contains only the static documentation website. It contains no private C++ source, Unreal assets, original game project files, or access credentials.

## Edit or preview

Edit `index.html`, `styles.css`, and `app.js` directly. There is no framework, package installation, build step, analytics, third-party font, or external script. Serve this directory with any static HTTP server for a local preview.

GitHub Pages publishes the root of `main`. `.nojekyll` tells Pages to serve the static files directly. Keep all paths relative so the site works under `/ChristmasLights-docs/`.

Keep the guide focused on customer tasks: installation, plugin activation, finding assets, building light strings, and troubleshooting. Describe settings accurately and use the Fab listing as the reference for supported versions and platforms. Keep internal development notes and release planning out of the public guide.

Documentation feedback can be filed through this repository's Issues tab. Do not include credentials or private project files in public issues.

Copyright 2026 David Salamanca. All rights reserved.


The guide uses a warm red palette. Files in `assets/` include the author-provided individual-light rotation recording converted to an 800 x 380, 12 fps, seven-second GIF and its static preview. The Real Time Geometry recording is a 12.5-second, 800 x 568, 12 fps GIF with its dark ending trimmed and a static preview. Each animation independently loads when visible, has a play/pause control, and stays still by default for readers who prefer reduced motion. Keep demonstration media optimized and include descriptive alternative text. Preserve the actual bulb-color swatches when changing the website theme.


`index.html` versions the stylesheet and script URLs with the first 12 characters of their SHA-256 hashes (UTF-8, LF line endings). Update those query strings whenever either file changes, so returning visitors do not mix new markup with cached code or styles. Demonstrations use real GIFs as their HTML fallback; `<picture>` supplies a still preview for reduced-motion readers even without JavaScript. The script adds in-view playback and pause controls.
