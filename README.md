# Rift Chess — Bend 2 browser preview

[Play the experiment](https://haileystorm.github.io/rift-chess-bend2/) | [Original game](https://haileystorm.github.io/rift-chess/)

Static distribution only. [Source, local Bend guide, laws, proofs and verification](https://github.com/HaileyStorm/rift-chess/tree/codex/visual-overhaul/bend2) live in the main project checkout. The exact build source and asset hashes are in `build.json`.

Build `e788562833af84fd6840` comes from clean source commit
`9d4a532df368006ef5464dd55888a593ed30e520` and pinned Bend 2.0.27. The rules,
opponent, picking, camera, board, pieces, menus, anti-aliased bitmap text,
animation, input policy, record codec and synthesized sound are Bend code.
The browser adapter transports events and assets, presents Bend pixels on
Canvas, plays Bend PCM through Web Audio, and mirrors Bend controls for
accessibility. It contains no chess or visible UI policy. A source-bound Bend
bot library and a Bend scene renderer run in static module workers; their
assets are included in the offline service-worker cache.

The default camera is 345° yaw, 67° pitch and 115% zoom; Front remains 65°.
Tile side faces cover the board perimeter and rifts. Pieces sit lower on the
squares with a contact shadow, and alpha-bound sprite drawing preserves their
pixels while reducing work. A source-bound, precomputed detailed ground is
used only for the initial camera, topology, theme and exact decoded artwork;
other views or altered/missing artwork use the original Bend renderer. The
additional 7.35 MB image is hashed and included in the offline cache. Older
hashed browser assets and content-addressed CLI C exports remain for returning
clients and provenance. During active orbit, Black's compact Bend glyphs now
use a thin brass edge behind navy to separate them from dark squares and the
rift; White glyphs and the settled authored sprites are unchanged. This adds
drawing work during orbit, and owner visual acceptance remains open.

The exact clean build passed 24 local rendered Chrome scenarios and 685 checks
with zero defects, plus paired initial/move/Front settled-pixel identity against
the prior build and cool/warm orbit inspection. The
initial-ground worker phase improved locally, but first-visit timing varies and
low-memory/cross-device performance is not established. The reported Linux
CPU-only source/package/X.Org/PCM/save-restart result was for older native
inputs; a distinct current-source CPU-only retest has been requested. The
original CUDA-on 250 ms deselection failure remains terminal. Physical audio,
native GPU parity, full human visual acceptance and the Bend 2.0.28 pin
amendment remain open. This preview does not replace the original Three.js game.

See `THIRD_PARTY_NOTICES.txt` and `Bend-Apache-2.0.txt`.
