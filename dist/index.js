'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSideEffect = require('react-side-effect');

var _reactSideEffect2 = _interopRequireDefault(_reactSideEffect);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocumentModifier = function DocumentModifier(props) {
	if (_react2.default.Children.count(props.children) === 1) {
		return _react2.default.Children.only(props.children);
	}

	var divProps = (0, _omit3.default)(props, 'properties');

	return _react2.default.Children.count(props.children) > 1 ? _react2.default.createElement(
		'div',
		divProps,
		props.children
	) : null;
};

DocumentModifier.propTypes = {
	children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element)]),
	properties: _react2.default.PropTypes.object.isRequired
};

function reducePropsToState() {
	var propsList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var finalProps = {}; //our goal is return the final document.`props` tree for the current application state - this is a "pure" function

	//This will traverse the tree, starting with the highest-most component and working its way down through all the children.
	(0, _forEach3.default)(propsList, function (props) {
		//At each level, we will merge into `props` from the `properties` attribute - overwriting any parent-ly set values
		//This means that the further nested component's properties will win,
		//whilst still preserving parent properties that never get overwritten
		(0, _merge3.default)(finalProps, props.properties);
	});

	return finalProps;
}

//UTILITIES
function deepDOMUpdate(target, source) {
	var domNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
	var defaultClear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

	//This function will update the `domNode` (and its child properties), as described by the `target`
	//The `source` is used to mark (and clear) props that were removed in the last reduce

	var result = target.asMutable(); //we will return the new `virtualDocumentProps`

	(0, _forEach3.default)(target, function (value, key) {
		if ((0, _isObject3.default)(value)) {
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