// background.js - Click & Bookmark

let isRebuilding = false;
let rebuildRequested = false;
let rebuildTimeout = null;

// Build the menu on install or startup
chrome.runtime.onInstalled.addListener(() => {
  debouncedRebuild();
});

chrome.runtime.onStartup.addListener(() => {
  debouncedRebuild();
});

// Listen for changes in Chrome Bookmarks to keep the menu synced
chrome.bookmarks.onCreated.addListener(() => debouncedRebuild());
chrome.bookmarks.onRemoved.addListener(() => debouncedRebuild());
chrome.bookmarks.onChanged.addListener(() => debouncedRebuild());
chrome.bookmarks.onMoved.addListener(() => debouncedRebuild());

function debouncedRebuild() {
  if (rebuildTimeout) clearTimeout(rebuildTimeout);
  rebuildTimeout = setTimeout(() => {
    rebuildContextMenus();
  }, 100); // Optimized debounce delay
}

function rebuildContextMenus() {
  if (isRebuilding) {
    rebuildRequested = true;
    return;
  }
  isRebuilding = true;
  rebuildRequested = false;

  let treeNodes = null;
  let removed = false;

  function proceed() {
    if (treeNodes && removed) {
      buildMenus(treeNodes);
    }
  }

  // Optimize speed: Fetch bookmarks and clear menus in parallel
  chrome.bookmarks.getTree((nodes) => {
    treeNodes = nodes;
    proceed();
  });

  chrome.contextMenus.removeAll(() => {
    removed = true;
    proceed();
  });
}

function finalizeRebuild() {
  isRebuilding = false;
  if (rebuildRequested) {
    rebuildContextMenus();
  }
}

function buildMenus(treeNodes) {
  // Create main menu item
  chrome.contextMenus.create({
    id: "pagesaver-root",
    title: "Save page in...",
    contexts: ["page"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.warn("Context menu error:", chrome.runtime.lastError.message);
    }
  });

  const folderList = [];
  
  // Traverse the tree to filter only folders, skipping system roots (1, 2, 3)
  function extractFolders(nodes, depth = 0) {
    nodes.forEach(node => {
      if (!node.url && node.id !== "0") { 
        const isSystemRoot = node.id === "1" || node.id === "2" || node.id === "3";
        if (!isSystemRoot) {
          folderList.push({
            id: node.id,
            title: node.title || "Unnamed folder",
            depth: depth
          });
        }
      }
      if (node.children) {
        // Do not indent children of system root folders (keep depth at 0 for user's top-level folders)
        const nextDepth = (node.id === "0" || node.id === "1" || node.id === "2" || node.id === "3") ? depth : depth + 1;
        extractFolders(node.children, nextDepth);
      }
    });
  }

  extractFolders(treeNodes);

  // Filter out empty or unnamed folders/system folders
  const validFolders = folderList.filter(f => f.title.trim() !== "");

  if (validFolders.length === 0) {
    // CASE: No folders have been created by the user yet
    
    // Option 1: Save directly to the root folder (Bookmarks Bar / id '1')
    chrome.contextMenus.create({
      id: "save-to-bm-1", 
      parentId: "pagesaver-root",
      title: "Main Folder (Bookmarks Bar)",
      contexts: ["page"]
    });

    // Separator line between save options and actions
    chrome.contextMenus.create({
      id: "separator-1",
      parentId: "pagesaver-root",
      type: "separator",
      contexts: ["page"]
    });

    // Disabled informational label
    chrome.contextMenus.create({
      id: "info-label",
      parentId: "pagesaver-root",
      title: "Open bookmarks sidebar/manager to add folders",
      enabled: false,
      contexts: ["page"]
    });

    // Option 2: Button to open the Bookmarks Manager page
    chrome.contextMenus.create({
      id: "open-bookmarks-manager",
      parentId: "pagesaver-root",
      title: "Open Bookmarks Manager (Ctrl+Shift+O)",
      contexts: ["page"]
    }, () => {
      finalizeRebuild();
    });

  } else {
    // CASE: Folders are present
    let created = 0;
    
    validFolders.forEach(folder => {
      const prefix = "— ".repeat(Math.max(0, folder.depth - 1));
      
      chrome.contextMenus.create({
        id: `save-to-bm-${folder.id}`,
        parentId: "pagesaver-root",
        title: prefix + folder.title,
        contexts: ["page"]
      }, () => {
        created++;
        if (created >= validFolders.length) {
          finalizeRebuild();
        }
      });
    });
  }
}

// Listener for clicks on menu items
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return;

  // Action 1: Open Chrome Bookmarks manager in a new tab
  if (info.menuItemId === "open-bookmarks-manager") {
    chrome.tabs.create({ url: "chrome://bookmarks/" });
    return;
  }

  // Action 2: Save bookmark in the selected folder
  if (tab.url && info.menuItemId.startsWith("save-to-bm-")) {
    const targetFolderId = info.menuItemId.replace("save-to-bm-", "");

    chrome.bookmarks.create({
      parentId: targetFolderId,
      title: tab.title || "Untitled page",
      url: tab.url
    }, (newBookmark) => {
      if (chrome.runtime.lastError) {
        console.error("Error saving bookmark:", chrome.runtime.lastError.message);
      }
    });
  }
});
