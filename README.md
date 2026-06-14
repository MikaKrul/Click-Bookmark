<p align="center">
  <img src="icon.png" alt="Logo" width="256" height="256">
</p>

# Click & Bookmark

A lightweight, distraction-free browser extension that lets you instantly save any webpage to your native browser bookmark folders directly via the right-click context menu. 

## Features

- **Context-Menu Integration:** Right-click anywhere on a webpage to instantly save it.
- **Dynamic Folder Tree:** Automatically fetches your native browser bookmark folders (including Bookmark Bar, Other Bookmarks, and nested subfolders).
- **Subfolder Visual Depth:** Nested folders are beautifully indented using clean visual markers (`—`).
- **Real-time Sync:** Dynamically syncs and rebuilds the menu whenever you add, rename, move, or delete folders in your browser's native bookmark manager.
- **Privacy-First & Lightweight:** No background tracking, no external storage, and no cloud databases. It uses Chrome's native API.

## Design Details

The extension's interface and icon are tailored to match the default Helium and Chromium browser toolbars:
- **Icon:** A geometric, outline-style star matching the exact `1.5px` stroke thickness used by the browser's native UI icons.
- **Footprint:** Extremely low memory consumption since it runs on a simple, on-demand background service worker.

## Installation (Developer Mode)

Since this extension is optimized for personal use, you can easily load it locally into your browser:

1. Download the latest release to your computer and un-zip it.
2. Open your browser and navigate to the Extensions page (`chrome://extensions`) or your specific browsers extention page.
3. Enable **Developer mode** (usually a toggle switch in the top-right corner).
4. Click on **Load unpacked** (top-left corner).
5. Select the folder containing the extension files (where `manifest.json` is located).

## Repository Structure

```text
├── manifest.json    # Extension configuration and native permissions
├── background.js    # Background service worker handling context menus & bookmark saving
├── icon.png         # Icon
├── README.md        # Documentation
└── privacy.md       # Privacy Policy
