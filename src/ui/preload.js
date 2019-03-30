/*
This script is run during the loading of a webpage.
It pulls all the required node apis for the menu
without injecting them into external websites,
this is done for obvious security benefits.
*/

// Prevent Injecting To Loaded Websites
if (window.location.protocol == "file:") {
  global.React = require("react");
  global.ReactDOM = require("react-dom");
  global.ipc = require("electron").ipcRenderer;
  global.services = require("electron").remote.getGlobal("services");
}
