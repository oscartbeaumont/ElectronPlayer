#!/bin/bash
#Create The Exported Builds Folder
rm -rf dist
mkdir dist
#INstalled The Required Nodejs Modules
npm install
#Do OS Detection Then Do The Install
os=`uname`
if [[ "$os" == "Linux" ]]; then
   echo "Install Netflix Electron To Your Linux System!"
   electron-packager . Netflix --platform=linux --arch=x64 --version=1.0.0
   mv Netflix-linux-x64/ dist/linux/
   rm -rf Netflix-linux-x64
   #Install To The System
   cp -R ./ /usr/bin/netflix-dist/
  echo '#!/bin/bash
  /usr/bin/netflix-dist/Netflix' > /usr/bin/netflix
  chmod +x /usr/bin/netflix
  echo "Netflix Has Been Installed To The System. Start It By Running 'netflix' In Your Terminal!"
elif [[ "$os" == "Darwin" ]]; then
   echo "Installing Netflix Electron To Your MacOS System!"
   electron-packager . Netflix --platform=darwin --arch=x64 --version=1.0.0
   mv Netflix-darwin-x64/Netflix.app dist/Netflix.app
   rm -rf Netflix-darwin-x64
   #Install To The System
   cp dist/Netflix.app /Applications/Netflix.app
   echo "Netflix Has Been Installed To The Applications Folder!"
else
   echo "You Are Trying To Install This On A Platform That is Not Supported Yet. Maybe Add Support For It Through A Pull Request!"
fi
