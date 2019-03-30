# ElectronPlayer

[![Build Status](https://travis-ci.org/oscartbeaumont/ElectronPlayer.svg?branch=master)](https://travis-ci.org/oscartbeaumont/ElectronPlayer)
[![ElectronPlayer](https://snapcraft.io/electronplayer/badge.svg)](https://snapcraft.io/electronplayer)

An Electron Based Web Video Services Player. Supporting Netflix, Youtube, Twitch, Floatplane And More. This is the successor to [Netflix-Desktop](https://github.com/oscartbeaumont/Netflix-Desktop).

![ElectronPlayer Menu](docs/ElectronPlayer.png)

The main menu interface.

## Features

- Rough Mac Picture in Picture Support (Floating Window, Above All Desktop and Fullscreen Applications)
- Always On Top Window Option
- Frameless Window Option
- Multiple Streaming Services Support (JSON Config to add extra)
- Remember Open Service

## Installation

### Please note Windows currently is only partially supported. It doesn't support the Widevine package I am using but I am planning to fix this in the future

[Click Here](https://github.com/oscartbeaumont/ElectronPlayer/releases) to go to the Github Releases and download the correct installer for your platform. If you are running Linux you can also install this application via a snap.

```bash
snap install electronplayer
```

## Contributors

A huge thanks to the following people for helping shape this project.

- [Austin Kregel](https://github.com/austinkregel)

## Developing

```bash
git clone https://github.com/oscartbeaumont/ElectronPlayer.git
cd ElectronPlayer/
yarn
yarn start
```

## TODO

- Update Widevine Package So Electron Can Be Updated & Tests Can Be Added
- Menubar Transparency Glitch On Mac
- Netflix breaks when relaunching window (eg. Enabling PIP)
- Copy and Paste Support
- Add dragable part to window (Maybe embed extra css on the body)
- App Tests
- Code Signing (Using Self Signed Cert Possibly)
