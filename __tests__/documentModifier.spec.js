/*eslint-env node, mocha */
/*global global, describe, it, before*/

import { expect, assert } from 'chai';
import React from 'react';
import DocumentModifier from '../dist/index.js';

import { mount } from 'enzyme';

describe(`${new Date()}: DocumentModifier core functionality`, () => {
	beforeEach(() => {
		//clear properties we will be testing for
		//we have to do this, because document is persistent and wouldn't be cleared with unmount
		global.document.title = undefined;
		global.document.body.class = undefined;
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
				return <DocumentModifier properties={ {title: newTitle} } />;
			},
		});

		const wrapper = mount(<Component />);
		wrapper.unmount();
	});

	it('adds a class name to `document.body` on mount', (done) => {
		const className = 'noscroll';

		assert.notEqual(global.document.body.class, className);

		const Component = React.createClass({
			componentDidMount: () => {
				expect(global.document.body.class).to.equal(className);
				done();
			},
			render: () => {
				return <DocumentModifier properties={ {body: {class: className}} } />;
			},
		});

		const wrapper = mount(<Component />);
		wrapper.unmount();
	});

	it('can resolve nested properties (title)', (done) => {
		const parentTitle = 'I am the parent';
		const childTitle = 'Who stole my ice cream';
		const className = 'noscroll';

		assert.notEqual(global.document.title, parentTitle);
		assert.notEqual(global.document.title, childTitle);
		assert.notEqual(global.document.body.class, className);

		const Component = React.createClass({
			componentDidMount: () => {
				expect(global.document.title).to.equal(childTitle); //child title wins
				expect(global.document.body.class).to.equal(className); //while preserving classname
				done();
			},
			render: () => {
				return (
					<DocumentModifier properties={{title: parentTitle, body: {class: className}}}>
						<DocumentModifier properties={{title: childTitle}} />
					</DocumentModifier>
				);
			},
		});

		const wrapper = mount(<Component />);
		wrapper.unmount();
	});
});

describe(`${new Date()}: DocumentModifier`, () => {
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

			const wrapper = mount(<Component />);
			wrapper.unmount();
		};

		expect(wrapperFn).to.throw(Error); //this should be a PropTypes error
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

		const wrapper = mount(<Component />);
		expect(wrapper.html()).to.equal(null);
		wrapper.unmount();
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

		const wrapper = mount(<Component />);
		expect(wrapper.html()).to.equal('<p>Exactly one child!</p>');
		wrapper.unmount();
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

		const wrapper = mount(<Component />);
		expect(wrapper.html()).to.equal('<div><p>My first paragraph</p><p>... and another paragraph element.</p><ul><li>Let\'s throw</li><li>a list into the mix</li></ul></div>')
		wrapper.unmount();
	});

	it('passes down props to `div` for multiple children', (done) => {
		const Component = React.createClass({
			componentDidMount: () => {
				done();
			},
			render: () => {
				return (
					<DocumentModifier properties={{title: 'unit test'}} className="myClass" id="myId">
						<p>My first paragraph</p>
						<p>... and another paragraph element.</p>
					</DocumentModifier>
				);
			},
		});

		const wrapper = mount(<Component />);
		expect(wrapper.html()).to.equal('<div class="myClass" id="myId"><p>My first paragraph</p><p>... and another paragraph element.</p></div>')
		wrapper.unmount();
	});

	it('can accept another <DocumentModifier /> with no children', (done) => {
		const Component = React.createClass({
			componentDidMount: () => {
				done();
			},
			render: () => {
				return (
					<DocumentModifier properties={{title: 'unit test'}} >
						<DocumentModifier properties={{title: 'inner unit test'}} />
					</DocumentModifier>
				);
			},
		});

		const wrapper = mount(<Component />);
		expect(wrapper.html()).to.equal(null);
		wrapper.unmount();
	});

	it('can accept another <DocumentModifier /> with children', (done) => {
		const Component = React.createClass({
			componentDidMount: () => {
				done();
			},
			render: () => {
				return (
					<DocumentModifier properties={{title: 'unit test'}}>
						<DocumentModifier properties={{title: 'inner unit test'}}>
							<p>Some child paragraph...</p>
						</DocumentModifier>
					</DocumentModifier>
				);
			},
		});

		const wrapper = mount(<Component />);
		expect(wrapper.html()).to.equal('<p>Some child paragraph...</p>');
		wrapper.unmount();
	});
});
