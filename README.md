# Rift Chess — Bend 2 browser preview

[Play the experiment](https://haileystorm.github.io/rift-chess-bend2/) | [Original game](https://haileystorm.github.io/rift-chess/)

Static distribution only. [Source, local Bend guide, laws, proofs and verification](https://github.com/HaileyStorm/rift-chess/tree/codex/visual-overhaul/bend2) live in the main project checkout. The exact build source and asset hashes are in `build.json`.

Build `f61152159a6331b9db2d` comes from clean source commit
`6721cf06169beb2165f1a18a595d36e811e342e2` and Bend 2.0.27. The rules,
opponent, picking, camera, board, pieces, menus, anti-aliased bitmap text,
animation, input policy, record codec and synthesized sound are Bend code.
The browser adapter transports events and assets, presents Bend pixels on
Canvas, plays Bend PCM through Web Audio, and mirrors Bend controls for
accessibility. It contains no chess or visible UI policy. A source-bound Bend
bot library and a Bend scene renderer run in static module workers; their
assets are included in the offline service-worker cache.

The View controls sit beside the desktop board and zoom from the default
115% through 130%. The rendered selection and observatory themes remain
available while changing the camera. Older hashed browser assets and
content-addressed CLI C exports remain here
for returning clients and historical provenance. An earlier shared-source
NativeV2 build ran on real Linux X11 CPU and CUDA devices, with exact image
parity for its tested move; routed PCM and a saved-game relaunch were also
observed. That native binary predates this camera/menu build, whose fresh
CPU package and GUI probe are pending. This preview does not replace the
original Three.js game. GPU results and their limits are documented with the
source; they do not establish improved delivered game FPS.

See `THIRD_PARTY_NOTICES.txt` and `Bend-Apache-2.0.txt`.
