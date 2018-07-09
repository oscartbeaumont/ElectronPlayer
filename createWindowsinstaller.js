const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log("Please Be Warned That Creating The Installer Takes An Incredible Amount Of Time, Just Wait and it Will Work");
  console.log('Creating Windows Installer...')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'dist')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Netflix-win32-x64/'),
    authors: 'Oscar Beaumont',
    noMsi: false,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Netflix.exe',
    setupExe: 'NetflixInstaller.exe',
    setupIcon: path.join(rootPath, 'assets', 'icon.ico')
  })
}
