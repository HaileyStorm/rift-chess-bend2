# Rift Chess — Bend 2 browser preview

[Play the experiment](https://haileystorm.github.io/rift-chess-bend2/) | [Original game](https://haileystorm.github.io/rift-chess/)

Static distribution only. [Source, local Bend guide, laws, proofs and verification](https://github.com/HaileyStorm/rift-chess/tree/codex/visual-overhaul/bend2) live in the main project checkout. The exact build source and asset hashes are in `build.json`.

Build `f2369ed40dae326d895e` comes from clean source commit
`4f6e52f2e93ac5c925c0348682e55bace4e7ffcf` and pinned Bend 2.0.27. The rules,
opponent, picking, camera, board, pieces, menus, anti-aliased bitmap text,
animation, input policy, record codec and synthesized sound are Bend code.
The browser adapter transports events and assets, presents Bend pixels on
Canvas, plays Bend PCM through Web Audio, and mirrors Bend controls for
accessibility. It contains no chess or visible UI policy. A source-bound Bend
bot library and a Bend scene renderer run in static module workers; their
assets are included in the offline service-worker cache.

The View controls sit beside the desktop board and zoom from the default
115% through 130%. A compact 256-pixel motion tree retains piece/hole detail
while reducing browser orbit traversal; a camera-only 450 ms quiet window
avoids launching intermediate ornate sprite jobs during successive view
inputs. Topology changes such as Shift Undo refine without that delay. These
are local responsiveness improvements, not an owner-approved visual finish.
Settled tiles use one owner for exposed vertical faces at the outer board and
open rift boundaries, with visible fine seams on all four tile-top edges.
The default pitch is steeper, the authored sprites are slightly shorter and
seated lower, and each has a restrained contact shadow. The exact older saved
factory view migrates on load, while other saved angles remain unchanged. The
lightweight in-motion board still omits those detailed walls until its
asynchronous settled refinement. A nine-yaw pixel gate and 13-group local
Chrome game scenario passed; owner visual acceptance and cross-device
performance remain open.
The rendered selection and observatory themes remain available while changing
the camera. Older hashed browser assets and
content-addressed CLI C exports remain here
for returning clients and historical provenance. An earlier shared-source
NativeV2 build ran on real Linux X11 CPU and CUDA devices, with exact image
parity for its tested move; routed PCM and a saved-game relaunch were also
observed. A later CPU-only package/X11/PCM/restart result belongs to the
previous `f8a7fbf` edge source, not this visual revision. The CPU emitter now
requires an interim 88 GiB host/visible-cgroup headroom floor based on its
reported 69 GiB peak. This source's fresh CPU package,
GUI/PCM/restart and GPU runtime parity remain open. Bend 2.0.28 remains an
unadopted candidate; a separate local ABI bridge and browser/worker probes do
not change this published 2.0.27 pin.
This preview does not replace the
original Three.js game. GPU results and their limits are documented with the
source; they do not establish improved delivered game FPS.

See `THIRD_PARTY_NOTICES.txt` and `Bend-Apache-2.0.txt`.
