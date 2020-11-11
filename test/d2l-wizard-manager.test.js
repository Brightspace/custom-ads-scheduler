
// Press Next -> On step 2

// Press Next, Press Next again -> On step 3

// Press Next, Press Reset -> On Step 1

// Press Next, Press Next, Press Reset -> On Step 1

// Spy on the finish callback, Press Next x2, Press Finish -> Callback hit

import '../src/components/d2l-wizard-manager.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const defaultFixture = html`
<d2l-wizard-manager></d2l-wizard-manager>
`;

describe('d2l-wizard-manager', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(defaultFixture);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-wizard-manager');
		});
	});

});
