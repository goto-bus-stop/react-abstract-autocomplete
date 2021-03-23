# react-abstract-autocomplete change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## 2.0.2
* Add React 17.x to acceptable peer dependencies.

## 2.0.1
* Fix clicking on suggestions. ([@pdumais](https://github.com/pdumais) in [#160](https://github.com/goto-bus-stop/react-abstract-autocomplete/pull/160))

## 2.0.0
* Smaller build.
* Move entry point files to `./dist/react-abstract-autocomplete.*.js` instead of `./index.js`.
  This is the only breaking change; it's unlikely to affect anyone unless you were explicitly importing `react-abstract-autocomplete/index.js` or `react-abstract-autocomplete/index.es.js`.
