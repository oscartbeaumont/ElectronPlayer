## ElectronPlayer
#### If you are experiencing issues playing DRM content using the Mac version please try the `v3.0.0` beta which can be found [here](https://electronplayer-beta.otbeaumont.me/)

[![Build Status](https://travis-ci.org/oscartbeaumont/ElectronPlayer.svg?branch=master)](https://travis-ci.org/oscartbeaumont/ElectronPlayer)
[![ElectronPlayer](https://snapcraft.io/electronplayer/badge.svg)](https://snapcraft.io/electronplayer)

An Electron Based Web Video Services Player. Supporting Netflix, Youtube, Twitch, Floatplane, Hulu, Amazon Prime Video And More. This is the successor to [Netflix-Desktop](https://github.com/oscartbeaumont/Netflix-Desktop).

![ElectronPlayer Menu](docs/ElectronPlayer.png)

_The apps main menu interface_

## The Pain of Widevine

People using this app should be aware of its difficultly to maintain due to the requirement of Widevine. Widevine is a DRM plugin created by Google and it is used by Netflix, Hulu and many other streaming services. Widevine has already caused an outright fail of Netflix within this app and the only solution I could find ended up with the app having multiple `package.json` files one for each os. They also each use different versions of Electron. The Mac version is using the older version of Electron and it is locked on a version which was published on the 5th of June 2019. Unless a fix presents itself this app will be discontinued in its current form when Netflix stop working on Mac. I have no clue when that will be but my guess is 1-2 years because I am sadly not expecting any working solutions to come foward. The only other possible solution is obtaining a Widevine signing certificate from Google. Which is not possible due to this being a "small" open source project. I may also [copy metastream](https://github.com/samuelmaddock/metastream/issues/85) and move the app to a browser based PWA instead of fully discontinuing it. A good article about this issue can be [read here](https://blog.samuelmaddock.com/posts/google-widevine-blocked-my-browser/).

# Features

- Multiple Streaming Services Support (JSON Configuration to add extra)
- Adblock
- Always On Top Window
- Set Startup Page (Any Service or Remember Last Opended Page)
- Frameless Window
- Rough Mac Picture in Picture Support (Floating Window, Above All Desktop and Fullscreen Applications)
- Full Screen Window on Startup

# Installation

## Windows

Please note Windows is currently only partially supported, as it doesn't support the Widevine package I am using. I am working on fixing this. Its progress can be loosely tracked in issue [#2](https://github.com/oscartbeaumont/ElectronPlayer/issues/2) and issue [#35](https://github.com/oscartbeaumont/ElectronPlayer/issues/35)

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

- Add Tests - once Electron versions are the same between Mac and Linux
- Add Windows Support
- Add Dependency Updates Alerter Bot

## Should fix at some point

- Menubar Transparency Glitch On Mac
