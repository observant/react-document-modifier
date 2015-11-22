#React Document Modifier

[![npm package](https://img.shields.io/npm/v/react-helmet.svg?style=flat-square)](https://www.npmjs.org/package/react-document-modifier)

Provides declaritive, nested, stateful `document` modification for React applications

Inspired by [react-document-title](https://github.com/gaearon/react-document-title). Built with [React Side Effect](https://github.com/gaearon/react-side-effect).

## Installation

```
npm install --save react-document-modifier
```

Dependencies: 

* react >= 0.14.0
* react-side-effect >= 1.0.0
* seamless-immutable >= 4.0.0
* lodash >= 3.10.0

## Features

* Can modify any property on `window.document`;
* Like a normal React component, can use its parent's `props` and `state`;
* Can be defined in many places throughout the application;
* Supports arbitrary levels of nesting, so you can define app-wide and page-specific modifications;

## Usage

//coming soon

## Example

//coming soon

## Todo

* Write some tests
* Update documentation
* Remove dependencies on `lodash` and `seamless-immutable`

## License

MIT

## Looking for something more expressive?

Check out [React Helmet](https://github.com/nfl/react-helmet)! to modify `document.head`.