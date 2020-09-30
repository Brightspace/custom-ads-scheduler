
// Press Next -> On step 2

// Press Next, Press Next again -> On step 3

// Press Next, Press Reset -> On Step 1

// Press Next, Press Next, Press Reset -> On Step 1

// Spy on the finish callback, Press Next x2, Press Finish -> Callback hit

import '../src/components/d2l-wizard-manager.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
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

	describe('step contents', () => {

		afterEach(() => {
			fixtureCleanup();
		});

		it('check that we successfully loaded the expected contents of step 1', async() => {
			const el = await fixture(defaultFixture);

			const wizard = el.shadowRoot.getElementById('wizard');
			const wizardPages = wizard.shadowRoot.querySelector('iron-pages');
			const wizardSlot = wizardPages.shadowRoot.querySelector('slot');
			const wizardSlotNodes = wizardSlot.assignedNodes({ flatten: true });
			const selectedNodes = wizardSlotNodes.filter((n) => {
				return n.className === 'iron-selected';
			});
			expect(selectedNodes.length).to.equal(1); // There should only be one selected wizard slot
			const step = selectedNodes[0];
			const stepSlot = step.shadowRoot.querySelector('slot');
			const stepSlotNodes = stepSlot.assignedNodes({ flatten: true });
			const targetSlotNodes = stepSlotNodes.filter((n) => {
				return n.localName === 'd2l-select-data-set';
			});
			expect(targetSlotNodes.length).to.equal(1); // We should have found one instance of our target component
			expect(targetSlotNodes[0].shadowRoot.children.length).greaterThan(0); // The component tag should have loaded its contents
		});
	});
});
