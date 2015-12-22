import React from 'react';
import withSideEffect from 'react-side-effect';
import {default as _} from 'lodash';
import {default as immutable} from 'seamless-immutable';

const DocumentModifier = React.createClass({
	displayName: 'DocumentModifier',

	propTypes: {
		children: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.arrayOf(React.PropTypes.element)]),
		properties: React.PropTypes.object.isRequired,
	},

	render: function render() {
		return <div>{ this.props.children }</div>;
	},
});

function reducePropsToState(propsList = []) {
	const finalProps = {}; //our goal is return the final document.`props` tree for the current application state - this is a "pure" function

	//This will traverse the tree, starting with the highest-most component and working its way down through all the children.
	_.forEach(propsList, (props) => {
		//At each level, we will merge into `props` from the `properties` attribute - overwriting any parent-ly set values
		//This means that the further nested component's properties will win,
		//whilst still preserving parent properties that never get overwritten
		_.merge(finalProps, props.properties);
	});

	return finalProps;
}

//UTILITIES
function deepDOMUpdate(target, source, domNode = document, defaultClear = '') {
	//This function will update the `domNode` (and its child properties), as described by the `target`
	//The `source` is used to mark (and clear) props that were removed in the last reduce

	const result = target.asMutable(); //we will return the new `virtualDocumentProps`

	_.forEach(target, (value, key) => {
		if (_.isObject(value)) {
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
let virtualDocumentProps = immutable({});

function handleStateChangeOnClient(props) {
	virtualDocumentProps = virtualDocumentProps.merge(props, {deep: true}); //merge in the final props for current state into our virtual model
	virtualDocumentProps = immutable(deepDOMUpdate(virtualDocumentProps, props, document)); //Update the DOM to reflect the current state, clearing out invalid props
}

export default withSideEffect(
	reducePropsToState,
	handleStateChangeOnClient
)(DocumentModifier);
