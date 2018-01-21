#!/bin/bash
rm -rf dist
mkdir dist

electron-packager . Netflix --platform=darwin --arch=x64 --version=1.0.0
electron-packager . Netflix --platform=linux --arch=x64 --version=1.0.0

mv Netflix-darwin-x64/Netflix.app dist/Netflix.app
rm -rf Netflix-darwin-x64

mv Netflix-linux-x64/ dist/linux/
rm -rf Netflix-linux-x64

echo "#!/bin/bash
cp -R ./ /usr/bin/netflix-dist/
echo '#!/bin/bash
/usr/bin/netflix-dist/Netflix' > /usr/bin/netflix
chmod +x /usr/bin/netflix
echo 'Netflix Has Been Installed To The System!'" >> dist/linux/install.sh
chmod +x dist/linux/install.sh
