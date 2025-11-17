# Stopwatch

[https://azatom.github.io/stopwatch/](https://azatom.github.io/stopwatch/)

## Features

- **Offline-ready:** Works without internet (PWA)
- **Lap support:** Record laps, view stats (average, stddev)
- **Copy:** Export lap data to clipboard
- **Key/mouse tagging:** See which key or mouse button was used
- **Installable:** Add to home screen on mobile/desktop

## Installation

### Here
1. Use/bookmark the link above.
2. (Optional) Add to home screen/in urlbar click install icon.

### On own server
1. Copy all files to a folder (e.g., `/stopwatch`).
2. (Optional) Configure your server to serve (without redirect) `index.html` for all `/stopwatch` routes, note the missing slash at the and.

## TODO

- Optional lapstat+key
- Absolute/fromstart/laptime
- Grayed out paused laps? with abs time it is unnecessary
- On mobile other key beside one tap OR grayed paused could b ea hack for that
- Scroll? It is deliberatelly disabled mimicing physical button (tap anywher anyhow, concentrate oon what you are actually measuring). Copy is there instead of scroll.
- Zoom? same as scroll
- PWA: update check
