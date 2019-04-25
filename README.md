ElectronPlayer
--------------
[![Build Status](https://travis-ci.org/oscartbeaumont/ElectronPlayer.svg?branch=master)](https://travis-ci.org/oscartbeaumont/ElectronPlayer)
[![ElectronPlayer](https://snapcraft.io/electronplayer/badge.svg)](https://snapcraft.io/electronplayer)

An Electron Based Web Video Services Player. Supporting Netflix, Youtube, Twitch, Floatplane And More. This is the successor to [Netflix-Desktop](https://github.com/oscartbeaumont/Netflix-Desktop).

![ElectronPlayer Menu](docs/ElectronPlayer.png)

The main menu interface.

# Features

- Rough Mac Picture in Picture Support (Floating Window, Above All Desktop and Fullscreen Applications)
- Always On Top Window Option
- Frameless Window Option
- Multiple Streaming Services Support (JSON Config to add extra)
- Remember Open Service

# Installation
**Please note Windows is currently only partially supported, as it doesn't support the Widevine package I am using. I am planning to fix this in the future.**

## macOS
[Click Here](https://github.com/oscartbeaumont/ElectronPlayer/releases) to go to the GitHub Releases and download the installer.

## Linux
There are multiple ways to install ElectronPlayer on Linux.

### Snap

You can install it as a snap:
```bash
snap install electronplayer
```

### AppImage

You can download and use the latest AppImage from the [GitHub Releases](https://github.com/oscartbeaumont/ElectronPlayer/releases).

### Arch Linux AUR

There is an unofficial package on the Arch Linux User Repository provided by [@Scrumplex](https://github.com/Scrumplex).

[electronplayer](https://aur.archlinux.org/packages/electronplayer/)<sup>AUR</sup>


# Contributors

A huge thanks to the following people for helping shape this project.

- [Austin Kregel](https://github.com/austinkregel)
- [Rasmus Lindroth](https://github.com/RasmusLindroth)

# Developing

```bash
git clone https://github.com/oscartbeaumont/ElectronPlayer.git
cd ElectronPlayer/
yarn
yarn start
```

# TODO

- Updated Electon Widevine
- Update All DEPS
- Add Tests
- Add Windows Build Support
- Add Greenkeeper Bot

## Should fix at some point

- Menubar Transparency Glitch On Mac
- Netflix breaks when relaunching window (eg. Enabling PIP)
- Possibly Add Code Signing
