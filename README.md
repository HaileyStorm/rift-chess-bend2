# Rift Chess — Bend 2 browser preview

[Play the experiment](https://haileystorm.github.io/rift-chess-bend2/) | [Original game](https://haileystorm.github.io/rift-chess/)

Static distribution only. [Source, local Bend guide, laws, proofs and verification](https://github.com/HaileyStorm/rift-chess/tree/codex/visual-overhaul/bend2) live in the main project checkout. The exact build source and asset hashes are in `build.json`.

Build `f261f9d623e679d401f7` comes from clean source commit
`bfc069dc2b4ebd1bdd96e5111073e3243f642beb` and Bend 2.0.27. The rules,
opponent, picking, camera, board, pieces, menus, anti-aliased bitmap text,
animation, input policy, record codec and synthesized sound are Bend code.
The browser adapter transports events and assets, presents Bend pixels on
Canvas, plays Bend PCM through Web Audio, and mirrors Bend controls for
accessibility. It contains no chess or visible UI policy. A source-bound Bend
bot library and a Bend scene renderer run in static module workers; their
assets are included in the offline service-worker cache.

Older hashed browser assets and content-addressed CLI C exports remain here
for returning clients and historical provenance. The CLI has built and run as
a Linux ELF, but the full shared-source graphical native game has not emitted
C. A reduced graphical native diagnostic also runs under WSLg; its simple
visuals are not the browser presentation. This preview does not replace the
original Three.js game. The measured graphics-library GPU fixture and its
limits are documented with the source; they do not establish GPU game speed.

See `THIRD_PARTY_NOTICES.txt` and `Bend-Apache-2.0.txt`.
