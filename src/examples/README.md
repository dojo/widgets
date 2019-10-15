# examples

This project was generated with the [Dojo CLI](https://github.com/dojo/cli) & [Dojo CLI create app command](https://github.com/dojo/cli-create-app).

## Build

Run `npm run build` or `dojo build --mode dist` (the `mode` option defaults to `dist`) to create a production build for the project. The built artifacts will be stored in the `output/dist` directory.

## Development Build

Run `npm run build:dev` or `dojo build --mode dev` to create a development build for the project. The built artifacts will be stored in the `output/dev` directory.

## Development server

Run `npm run dev` or `dojo build --mode dev --watch file --serve` to create a development build and start a development server. By default the server runs on port `9999`, navigate to `http://localhost:9999/`.

To change the port of the development server use the `--port` option on the `dojo build` command.

To create an in memory development build and start a development server with hot reload, switch the `--watch` option to `memory`.

## Running unit tests

To run units tests in node only use `npm run test` or `dojo test` which uses JIT (just in time) compilation.

To run the unit tests against built bundles, run `npm run test:unit`.

To be re-run the unit tests without needing to re-build the full application each time, first build the app with `--mode unit` and the `--watch` option, `dojo build --mode unit --watch`. Then run `dojo test --config local` to run the unit tests as needed.

The build test artifacts are written to the `output/tests/unit` directory. These tests are located in the `tests/unit` directory.

## Running functional tests

To run the functional tests, run `npm run test:functional`. These tests are located in the `tests/functional` directory.

## Running unit and functional tests together

To run both unit and functional tests as the same time, run `npm run test:all`.

## Further help

To get help for these commands and more, run `dojo` on the command line.
