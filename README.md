# d2planner
A simple tool for making and sharing Diablo 2 character builds.

## Core features
There are a few Diablo 2 skill planners out there, these are the features that help this one stand out:
* **Accurate skill data** - powered by the game files
  * Support for multiple patches and mods **(TODO)**
* **Fast to update** - in case we ever go beyond patch 1.14D
* **Build saving and sharing** - through auto-updating URL in your address bar
* **Simple modern UI** - built around ease-of-use
  * Character level tracking based on skill choices
  * Mobile friendly **(TODO)**

## Skill descriptions library
The library code for this project attempts to re-create the processing logic used by the game itself, so we can generate skill descriptions from the same data used by the game. This requires some deeper knowledge of the game and a fair bit of reverse engineering, but has some benefits that are reflected in the app's features:
* This approach requires a deeper understanding of the game that leads to more accurate game data. Some skills are extremely complex, and require details across multiple game files to get right. Not every skill planner puts in this effort.
* Game data is drop-in replacable with this approach, enabling us to support previous or future patches, or even mods. This still requires development effort, but far less than if skill descriptions were hand-curated.

Hopefully this explains some of the complexity in the library code and the design decisions around building a full parser for the game's [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) rather than leaning more on hard-coded values.

## Resources
The Diablo 2 modding community is invaluable to this project. Modders have painstakingly mapped out the games data files and built tools for manipulating them - this project wouldn't be possible without them.
* [The Phrozen Keep](https://d2mods.info/forum/viewtopic.php?t=34455) - breakdowns of game files
* [Ladik's MPQ Editor](https://www.hiveworkshop.com/threads/ladiks-mpq-editor.249562/) - extracting usable files from D2's MPQs
* [QTblEditor](https://github.com/kambala-decapitator/QTblEditor) - extracting csvs from .tbl files inside MPQs
* [Hero Editor](https://www.moddb.com/games/diablo-2-lod/downloads/hero-editor-v-104) - modifying local character files to test skill descriptions
