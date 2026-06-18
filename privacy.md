# Privacy Policy

A transparent overview of how **Click & Bookmark** respects your data. This extension is built with a strict privacy-first mindset: **zero collection, zero transmission, and zero third-party tracking.**

---

## Data Collection & Usage

This extension **does not collect, store, or transmit any data** from your browser or device.

* **No Analytics:** There are no trackers, telemetry scripts, or analytics frameworks embedded in the source code.
* **No External Servers:** The extension operates entirely locally and never communicates with external cloud systems or remote databases.
* **No Personal Data:** It does not request, store, or have access to your personal information, email addresses, or account credentials.

---

## Browser Permissions Explained

To integrate seamlessly with your browser's interface, specific technical permissions are required. Here is exactly why they are used:

> ### Technical Breakdown
> * **`bookmarks`** >   Used strictly to read your local folder names (to build the right-click menu structure) and to create a new bookmark item when you click a folder. This data never leaves your device.
> * **`contextMenus`** >   Used to inject the unified **"Save page in..."** options into your right-click overlay.
> * **`activeTab`** >   Used safely to fetch the current website's URL and page title, but *only* at the exact millisecond you explicitly click a target folder to save it.

---

## Storage Architecture

Unlike standard extensions, this tool contains no independent databases or `chrome.storage` rules. 

```text
[Webpage] ──(Right-Click)──> [Extension Core] ──(Native API)──> [Your Browser Bookmarks File]
