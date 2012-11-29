## Derplander
#### Only one may exit. Unfortunately, all you can do is clone more of them.

Created for [github/game-off-2012](https://github.com/github/game-off-2012)

### Overview

Each level begins with a single unit ("derp"). It will continue to move to the right without regard for safety. The level is won if one **and only one** unit exits the level.

### Game concepts

*Derp (Unit)*

* Can be selected with the mouse. A green ring shows the selection.
* Press "c" to create a clone.
  * There must be an empty space behind the selected unit.
  * There must be a tile for the cloned unit to stand.
  * The selected unit must not be riding on a moving platform.
* Will climb only another unit.
* Can fall a single tile safely.

*Elevator up/down*

* A lone tile will move with a single occupant.
* Two adjacent tiles require both to have an occupant.

*Spikes*

* A unit will impale itself for the needs of the many.

*Floor switch*

* Toggles the exit door open/closed.


### Starting the game
The game can be found here: [http://wtjones.github.com/game-off-2012](http://wtjones.github.com/game-off-2012)


### Cheats
Specific levels can be accessed by specifying 'startlevel' in the query string. Example: [http://wtjones.github.com/derplander?startlevel=2](http://wtjones.github.com/derplander/?startlevel=2)

### Tools

* Graphics: see license section below
* Chrome
* Crafy.js
* jQuery
* Paint.NET
* Sublime Text 2
* [random-generator.com](http://random-generator.com/index.php?title=Castle) (for level names)

### License (graphics)

Part of (or All) the graphic tiles used in this program is the public
domain roguelike tileset "RLTiles".
Some of the tiles have been modified by wtjones.

You can find the original tileset at:
http://rltiles.sf.net

