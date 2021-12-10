(() => {
  // src/background.js
  chrome.commands.onCommand.addListener((shortcut) => {
    if (shortcut.includes("+Q")) {
      console.log("Reloading...");
      chrome.runtime.reload();
    }
  });
})();
//# sourceMappingURL=background.js.map
