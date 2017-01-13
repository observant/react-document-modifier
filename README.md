#React Document Modifier

[![npm package](https://img.shields.io/npm/v/react-document-modifier.svg?style=flat-square)](https://www.npmjs.org/package/react-document-modifier)
[![Build Status](https://travis-ci.org/observant/react-document-modifier.svg?branch=master)](https://travis-ci.org/observant/react-document-modifier)

Provides declaritive, nested, stateful `document` modification for React applications.

Inspired by [React Document Title](https://github.com/gaearon/react-document-title). Built with [React Side Effect](https://github.com/gaearon/react-side-effect).

## What problem does this solve?

Often we want to modify our `document` node's children (e.g. `<head>` and `<body>`), which are outside the scope of our React application.

For example, you may want to add a class to `<body>` to prevent overflow scrolling when a modal is visible; or you may want to update the page title using `document.title`, when a new component is mounted (e.g. at routing).

Direct node manipulation is discouraged, as it can cause the DOM to get out-of-sync with our React application state.

## What does React Document Modifier do?

`DocumentModifier` is a higher-order component that takes an Object of `{ property: value }` pairs and sets them on the `document` node. The Object is passed from within your components, ensuring that your application always owns the state of modifications.

### Features

* Can modify any immediate or child property on `document`;
* Like a normal React component, can use its own, or its parent's, `props` and `state`;
* Can be defined in many places throughout the application;
* Supports arbitrary levels of nesting, so you can define app-wide and page-specific modifications;
* Nested components override their parents, preventing duplication;

Warning: this has not been tested in isomorphic/universal environments.

## Installation

```bash
$ npm install --save react-document-modifier
```

Dependencies: 

```json
"dependencies": {
  "lodash": "^3.10.0",
  "react": "^15.0.0",
  "react-side-effect": "^1.0.0",
  "seamless-immutable": "^5.0.0"
},
```

## Usage

DocumentModifier takes one required prop called `properties`, which is an `object`. The object provides the properties and values you want to set, with respect to `document`.

### Immediate properties (e.g. `document.title`)

To apply: `document.title = "My Web App"`

```javaScript
<DocumentModifier properties={{title: 'My Web App'}}>...</DocumentModifier>
```

### Lower-level properties (e.g. `document.body.class`)

To apply: `document.body.class = "noscroll"`

```javaScript
const modifications = {
  body: {
    class: 'noscroll'
  }
};
<DocumentModifier properties={modifications}>...</DocumentModifier>
```

### Nested components

```javascript
var App = React.createClass({
  render: function () {
    // Will apply "My Web App" to `document.title`, if no child overrides it
    return (
      <DocumentModifier properties={{title: 'My Web App'}}>
        <HomePage />
      </DocumentModifier>
    );
  }
});

var HomePage = React.createClass({
  render: function () {
    // Will overwrite any parent title property and use "Home", while this component is mounted
    return (
      <DocumentModifier properties={{title: 'Home'}}>
        <h1>Home, sweet home.</h1>
      </DocumentModifier>
    );
  }
});

var NewArticlePage = React.createClass({
  render: function () {
    // While this component is mounted, the title will update using a value from state
    // It will also add the class 'article-page' to `document.body.class`
    return (
      <DocumentModifier properties={{title: this.state.title || 'Article', body: {class: 'article-page'}}}>
        <div>
          <h1>New Article</h1>
        </div>
      </DocumentModifier>
    );
  }
});
```

## Todo

* Remove dependencies on `lodash` and `seamless-immutable`

## License

MIT - see [LICENSE](LICENSE)

## Looking for more expressive control of `<head>`?

Check out [React Helmet](https://github.com/nfl/react-helmet)! to modify `document.head`.

# This component was built at [Observant](http://www.observant.net)

Observant build an integrated platform for the precision management of water in agriculture. We're hiring engineers, say hello at [@obsrvnt](https://twitter.com/obsrvnt) or visit [http://www.observant.net/careers/](http://www.observant.net/careers/) for more.
