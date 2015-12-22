/*eslint-env node, mocha */
/*global global, describe, it, before*/

import {expect, assert} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import DocumentModifier from '../dist/index.js';

describe(new Date() + '\nDocumentModifier core functionality', () => {
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

describe(new Date() + '\nDocumentModifier component', () => {
	before(() => {
		console.error = (error) => {
			//escalate Warnings to Errors
			//We do this to manually catch Failed propType warnings
			throw new Error(error);
		};
	});

	it('requires `properties` prop', (done) => {
		const wrapperFn = () => {
			const Component = React.createClass({
				render: () => {
					return (
						<DocumentModifier />
					);
				},
			});

			ReactTestUtils.renderIntoDocument(React.createElement(Component));
		};

		expect(wrapperFn).to.throw(Error);
		done();
	});

	it('can accept no children', (done) => {
		const Component = React.createClass({
			componentDidMount: () => {
				done();
			},
			render: () => {
				return (
					<DocumentModifier properties={{title: 'unit test'}} />
				);
			},
		});

		ReactTestUtils.renderIntoDocument(React.createElement(Component));
	});

	it('can accept exactly one child', (done) => {
		const Component = React.createClass({
			componentDidMount: () => {
				done();
			},
			render: () => {
				return (
					<DocumentModifier properties={{title: 'unit test'}}>
						<p>Exactly one child!</p>
					</DocumentModifier>
				);
			},
		});

		ReactTestUtils.renderIntoDocument(React.createElement(Component));
	});

	it('can accept multiple children', (done) => {
		const Component = React.createClass({
			componentDidMount: () => {
				done();
			},
			render: () => {
				return (
					<DocumentModifier properties={{title: 'unit test'}}>
						<p>My first paragraph</p>
						<p>... and another paragraph element.</p>
						<ul>
							<li>Let's throw</li>
							<li>a list into the mix</li>
						</ul>
					</DocumentModifier>
				);
			},
		});

		ReactTestUtils.renderIntoDocument(React.createElement(Component));
	});
});
