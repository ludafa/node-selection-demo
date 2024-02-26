const {
  app,
  BrowserWindow,
  globalShortcut,
} = require("electron");
const path = require("path");
const {
  checkAccessibilityPermissions,
  getSelection,
} = require("node-selection");
const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

const setupNodeSelection = async () => {
  const permitted = await checkAccessibilityPermissions({ prompt: true });
  if (!permitted) {
    console.log("grant accessibility permissions and restart this program");
    return;
  }

  globalShortcut.register("Command+Option+x", async () => {
    try {
      const { text, process } = await getSelection();
      console.log(text, process);
    } catch (e) {
      console.log("getSelectedText failed", e.stack);
    }
  });
};

const bootstrap = async () => {
  await app.whenReady();
  createWindow();
  setupNodeSelection();
};

bootstrap();
