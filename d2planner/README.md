# d2planner
This project acts as a frontend for Diablo 2 game data processed by [`mpq_data_parser`](../mpq_data_parser).

## Key components
* [`Planner`](./src/Planner.js) - Manages top-level state for most of the key features. Handles importing game data files and tracking skill levels.
* [`Tree`](./src/Tree.js) - Handles visual display of skill and character requirements and current skill points.
* [`Tooltip`](./src/Tooltip.js) - Displays skill descriptions programatically generated from game data and state. Most of the app's library code is built around this.

## Development
Local development is standard for [Create React App](https://github.com/facebook/create-react-app) projects:
* `npm start` - to run the app in development mode.
* `npm test` - to start the test runner.
Tests are also run on GitHub Actions, and are required to pass for merging.

## Deployment
TODO
