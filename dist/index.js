'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSideEffect = require('react-side-effect');

var _reactSideEffect2 = _interopRequireDefault(_reactSideEffect);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocumentModifier = _react2.default.createClass({
	displayName: 'DocumentModifier',

	propTypes: {
		children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element)]),
		properties: _react2.default.PropTypes.object.isRequired
	},

	render: function render() {
		return this.props.children ? _react2.default.Children.only(this.props.children) : null;
	}
});

function reducePropsToState() {
	var propsList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	var finalProps = {}; //our goal is return the final document.`props` tree for the current application state - this is a "pure" function

	//This will traverse the tree, starting with the highest-most component and working its way down through all the children.
	_lodash2.default.forEach(propsList, function (props) {
		//At each level, we will merge into `props` from the `properties` attribute - overwriting any parent-ly set values
		//This means that the further nested component's properties will win,
		//whilst still preserving parent properties that never get overwritten
		_lodash2.default.merge(finalProps, props.properties);
	});

	return finalProps;
}

//UTILITIES
function deepDOMUpdate(target, source) {
	var domNode = arguments.length <= 2 || arguments[2] === undefined ? document : arguments[2];
	var defaultClear = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

	//This function will update the `domNode` (and its child properties), as described by the `target`
	//The `source` is used to mark (and clear) props that were removed in the last reduce

	var result = target.asMutable(); //we will return the new `virtualDocumentProps`

	_lodash2.default.forEach(target, function (value, key) {
		if (_lodash2.default.isObject(value)) {
			deepDOMUpdate(target[key], source[key], domNode[key]); //if it's an object, then recurse
		} else {
				result[key] = source ? source[key] : undefined; //clear out a now null property
				domNode[key] = result[key] || defaultClear; //update the DOM
			}
	});

	return result;
}
//END UTILITIES

//Let's hold (in memory) an immutable map of all the properties currently on the DOM
var virtualDocumentProps = (0, _seamlessImmutable2.default)({});

function handleStateChangeOnClient(props) {
	virtualDocumentProps = virtualDocumentProps.merge(props, { deep: true }); //merge in the final props for current state into our virtual model
	virtualDocumentProps = (0, _seamlessImmutable2.default)(deepDOMUpdate(virtualDocumentProps, props, document)); //Update the DOM to reflect the current state, clearing out invalid props
}

exports.default = (0, _reactSideEffect2.default)(reducePropsToState, handleStateChangeOnClient)(DocumentModifier);