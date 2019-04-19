/* This is injecting into remote webpages to add a
menubar which can be used to move the window around
and exit from frameless window on linux which were
the frameless window hides the settings menu.
*/

console.log('ElectronPlayer: Injected Header');

document.body.insertAdjacentHTML(
  'beforeend',
  `
    <div class="ElectronPlayer-topbar"></div>
    <span class="ElectronPlayer-exit-btn" onclick="ipc.send('exit-fullscreen')">&times;</span>
    <style>
        .ElectronPlayer-topbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 13px;
          opacity: 0;
          background: black;
          z-index: 99999;
          -webkit-app-region: drag;
        }

        .ElectronPlayer-topbar:hover {
          opacity: 1;
        }

        .ElectronPlayer-exit-btn {
          position: fixed;
          top: 0;
          left: 0;
          color: rgba(255, 255, 255, 0.15);;
          font-size: 40px;
          font-weight: 600;
          padding-left: 5px;
          z-index: 99999;
        }

        .ElectronPlayer-exit-btn:hover {
          color: white;
        }
    </style>
`
);
