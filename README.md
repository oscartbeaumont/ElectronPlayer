## ElectronPlayer

### If your Snap won't launch it is due to the Netflix bug fix. Uninstall the snap and reinstall with the flag `--devmode`. This is only a temporary fix and a better patch will be released soon. - 16/06
### If your Netflix player is not working please update as I have pushed a bug fix. - 16/06

[![Build Status](https://travis-ci.org/oscartbeaumont/ElectronPlayer.svg?branch=master)](https://travis-ci.org/oscartbeaumont/ElectronPlayer)
[![ElectronPlayer](https://snapcraft.io/electronplayer/badge.svg)](https://snapcraft.io/electronplayer)

An Electron Based Web Video Services Player. Supporting Netflix, Youtube, Twitch, Floatplane And More. This is the successor to [Netflix-Desktop](https://github.com/oscartbeaumont/Netflix-Desktop).

![ElectronPlayer Menu](docs/ElectronPlayer.png)

_The apps main menu interface_

# Features

- Rough Mac Picture in Picture Support (Floating Window, Above All Desktop and Fullscreen Applications)
- Always On Top Window
- Frameless Window
- Multiple Streaming Services Support (JSON Configuration to add extra)
- Set Startup Page (Any Service or Remember Last Opended Page)

# Installation

## Windows

**Please note Windows is currently only partially supported, as it doesn't support the Widevine package I am using. I am working on fixing this. Its progress can be loosely tracked in issue [#2](https://github.com/oscartbeaumont/ElectronPlayer/issues/2)**

## macOS

Download the DMG Installer from the [Github Releases here](https://github.com/oscartbeaumont/ElectronPlayer/releases).

## Linux Snap

You can install ElectronPlayer with a snap. This is recommended method of installation for Linux as automatic updates will occur.

```bash
snap install electronplayer
```

## Linux AppImage

Download the AppImage from the [Github Releases here](https://github.com/oscartbeaumont/ElectronPlayer/releases).

## Arch Linux AUR

There is an unofficial package on the Arch Linux User Repository provided by [@Scrumplex](https://github.com/Scrumplex).

[electronplayer](https://aur.archlinux.org/packages/electronplayer/)<sup>AUR</sup>

# Contributors

A huge thanks to the following people for contributing and helping shape this project.

- [Austin Kregel](https://github.com/austinkregel)
- [Rasmus Lindroth](https://github.com/RasmusLindroth)
- [Scrumplex](https://github.com/Scrumplex)

# Developing

Sorry in advance that build system currently to get the app working is a mess and requires multiple package.json's this will hopefully be fixed in the future. Please contact me if you need help.

```bash
git clone https://github.com/oscartbeaumont/ElectronPlayer.git
cd ElectronPlayer/

# For Linux
ln -s package.linux.json package.json
# For Mac
ln -s package.mac.json package.json

npm install
npm start
```

# TODO

- Updated Electron Widevine
- Update All DEPS
- Add Tests
- Add Windows Build Support
- Add Greenkeeper Bot

## Should fix at some point

- Menubar Transparency Glitch On Mac
- Netflix breaks when relaunching window (eg. Enabling PIP)
- Possibly Add Code Signing
