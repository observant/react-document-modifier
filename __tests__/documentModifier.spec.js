/*eslint-env node, mocha */
/*global global, describe, it, before*/

import {expect, assert} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import DocumentModifier from '../dist/index.js';

describe(new Date() + '\nDocumentModifier component', () => {
	beforeEach(() => {
		//clear properties we will be testing for
		//we have to do this, because document is persistent and wouldn't be cleared with unmount
		global.document.title = '';
		global.document.body.class = '';
	});

	it('changes the document title on mount', (done) => {
		const newTitle = 'hello world';

		assert.notEqual(global.document.title, newTitle);

		const Component = React.createClass({
			componentDidMount: () => {
				expect(global.document.title).to.equal(newTitle);
				done();
			},
			render: () => {
				return React.createElement(DocumentModifier, { properties: {title: newTitle} });
			},
		});

		ReactTestUtils.renderIntoDocument(React.createElement(Component));
	});

	it('add a class to document.body on mount', (done) => {
		const className = 'noscroll';

		assert.notEqual(global.document.body.class, className);

		const Component = React.createClass({
			componentDidMount: () => {
				expect(global.document.body.class).to.equal(className);
				done();
			},
			render: () => {
				return React.createElement(DocumentModifier, { properties: {body: {class: className}} });
			},
		});

		ReactTestUtils.renderIntoDocument(React.createElement(Component));
	});

	it('can resolve nested properties (title)', (done) => {
		const parentTitle = 'I am the parent';
		const childTitle = 'Who stole my ice cream';
		const className = 'noscroll';

		assert.notEqual(global.document.title, parentTitle);
		assert.notEqual(global.document.title, childTitle);
		assert.notEqual(global.document.body.class, className);

		const ChildComponent = React.createClass({
			render: () => {
				return React.createElement(DocumentModifier, { properties: {title: childTitle} });
			},
		});

		const ParentComponent = React.createClass({
			componentDidMount: () => {
				expect(global.document.title).to.equal(childTitle); //child title wins
				expect(global.document.body.class).to.equal(className); //while preserving classname
				done();
			},
			render: () => {
				return (
						<ChildComponent properties={{title: parentTitle, body: {class: className}}}>
							<p>Some more children...</p>
						</ChildComponent>
				);
			},
		});

		ReactTestUtils.renderIntoDocument(React.createElement(ParentComponent));
	});
});
