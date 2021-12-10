(()=>{chrome.commands.onCommand.addListener(o=>{o.includes("+Q")&&(console.log("Reloading..."),chrome.runtime.reload())});})();
