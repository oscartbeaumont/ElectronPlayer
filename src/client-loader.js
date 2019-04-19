/* This is injecting into remote webpages before redirecting.
  This is done to show the user that a new page is loading,
  instead of looking like it is doing nothing. This is especially
  for pages like Netflix that take a long time to load.
*/

console.log('ElectronPlayer: Injected Loader');

document.head.innerHTML = `<title>Loading...</title>`;

document.body.innerHTML = `
  <div class="electronplayer_spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>

  <style>
  body:before {
    content: "";
    position: fixed;
    left: 0;
    right: 0;
    background-color: rgba(52, 52, 52, 0.95);
    width: 100%;
    height: 100%;
    transform: scale(1.1);
    filter: blur(1px);
  }
  
  .electronplayer_spinner {
    display: inline-block;
    position: absolute;
    width: 64px;
    height: 64px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .electronplayer_spinner div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 51px;
    height: 51px;
    margin: 6px;
    border: 6px solid #fff;
    border-radius: 50%;
    animation: electronplayer_spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }

  .electronplayer_spinner div:nth-child(1) {
    animation-delay: -0.45s;
  }

  .electronplayer_spinner div:nth-child(2) {
    animation-delay: -0.3s;
  }

  .electronplayer_spinner div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes electronplayer_spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
`;
