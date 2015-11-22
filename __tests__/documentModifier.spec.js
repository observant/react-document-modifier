/*eslint-env node, mocha */

const expect = require('chai').expect;
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const DocumentModifier = require('../dist/');

describe('DocumentModifier (in a browser)', () => {

	it('changes the document title on mount', (done) => {
		const title = 'hello world';
		const Component = React.createClass({
			componentDidMount: () => {
				expect(global.document.title).to.equal(title);
				done();
			},
			render: () => {
				return React.createElement(DocumentModifier, { properties: {title: title} });
			},
		});
		ReactTestUtils.renderIntoDocument(React.createElement(Component));
	});
});
