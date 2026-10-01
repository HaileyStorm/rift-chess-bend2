# Rift Chess — Bend 2 browser preview

[Play the experiment](https://haileystorm.github.io/rift-chess-bend2/) | [Original game](https://haileystorm.github.io/rift-chess/)

Static distribution only. [Source, local Bend guide, laws, proofs and verification](https://github.com/HaileyStorm/rift-chess/tree/codex/visual-overhaul/bend2) live in the main project checkout. The exact build source and asset hashes are in `build.json`.

Build `8235c81a27d4030e143b` comes from clean source commit
`45d7041ea1e11db48017db96b886b24b60d501d3` and pinned Bend 2.0.27. The rules,
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
rift; White glyphs are unchanged. The settled authored sprites retain their
previous footprint and contact-shadow placement but are 1.00 instead of 1.04
projected rank pitches tall. Lower-base drafts were rejected because their
visible foot could cross the adjacent-square picking boundary at minimum
camera pitch. This adds drawing work during orbit, and owner visual acceptance
remains open.

The picker and the legacy piece renderer now both suppress a stale occupied
entry beneath a missing rift tile, matching the detailed sprite renderer's
visibility rule. This is a narrow invalid-state consistency fix; the detailed
atlas still needs a presentation-bound alpha hit path before lowering sprite
bases or claiming exact rendered-pixel picking at all angles.

This exact clean build passed 24 local rendered Chrome scenarios and 689 checks
with zero defects, plus a separate bound Chrome selection/move/orbit/refinement/
mobile smoke. These are local results; hosted bytes and interactions require
their own post-publication verification.
The
initial-ground worker phase improved locally, but first-visit timing varies and
low-memory/cross-device performance is not established. Earlier Linux
CPU-only source/package/X.Org/PCM/save-restart results bind older native
inputs; this visual source still needs its own native retest. The
original CUDA-on 250 ms deselection failure remains terminal. Physical audio,
native GPU parity, full human visual acceptance and the reviewed direct Bend
2.0.32 candidate/pin gates remain open. This preview does not replace the
original Three.js game.

See `THIRD_PARTY_NOTICES.txt` and `Bend-Apache-2.0.txt`.
