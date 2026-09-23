# Rift Chess - complete Bend 2 adaptation

[Play the experiment](https://haileystorm.github.io/rift-chess-bend2/) | [Original game](https://haileystorm.github.io/rift-chess/)

Static distribution only. [Source, local Bend guide, laws, proofs and verification](https://github.com/HaileyStorm/rift-chess/tree/codex/bend2-adaptation/bend2) live on the separate adaptation branch. The exact build source and asset hashes are in `build.json`.

The game rules, match history, opponent, picking, camera, immutable pixel renderer,
bitmap text, menus, animation, input policy, record codec and synthesized sound
are Bend 2.0.25 compiled to JavaScript. The browser adapter transports events,
copies Bend pixels to Canvas, plays Bend PCM through Web Audio, and supplies
storage/file effects and a Bend-labeled accessibility mirror. It contains no
chess or visible UI logic.

A source-bound browser-independent C export of the separate Bend command-line
game is published as a content-addressed `.c` file beside these static assets;
the graphical native source did not complete C emission on the bounded host.
The C export is not a linked or executed native binary. This experiment does
not replace the original Three.js game. Native parallel performance remains
unmeasured.

See `THIRD_PARTY_NOTICES.txt` and `Bend-Apache-2.0.txt`.
