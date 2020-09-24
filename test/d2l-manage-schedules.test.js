import '../src/components/d2l-manage-schedules.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { ManageSchedulesServiceFactory } from '../src/services/manageSchedulesServiceFactory';
import { ManageSchedulesTestService } from './utilities/manageSchedulesTestService';
import { newRandomSchedule } from './utilities/scheduleGenerator';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';

const defaultFixture = html`
<d2l-manage-schedules tempShouldHaveSchedules></d2l-manage-schedules>
`;

let getManageSchedulesServiceStub;

describe('d2l-manage-schedules', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(defaultFixture);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-manage-schedules');
		});
	});

	describe('serialize schedules', () => {
		beforeEach(() => {
			getManageSchedulesServiceStub = sinon.stub(ManageSchedulesServiceFactory, 'getManageSchedulesService');
			getManageSchedulesServiceStub.returns(new ManageSchedulesTestService());
		});

		afterEach(() => {
			getManageSchedulesServiceStub.restore();
			fixtureCleanup();
		});

		it('should not render table if no schedules', async() => {
			const el = await fixture(defaultFixture);
			const table = el.shadowRoot.querySelector('table');
			expect(table).to.be.null;
		});

		it('should have all schedules in table', async() => {
			setupTestData([
				newRandomSchedule(),
				newRandomSchedule(),
				newRandomSchedule()
			]);

			const el = await fixture(defaultFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(3);
		});

		it('binds correct values in table', async() => {
			const testSchedule = {
				name: 'A',
				type: 'Differential',
				frequency: 'Daily',
				startDate: '09/01/2020',
				endDate: '12/31/2020',
				enabled: true
			};

			setupTestData([testSchedule]);

			const el = await fixture(defaultFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(1);
			const rowData = rows[0].querySelectorAll('td');
			expect(rowData[0].innerText).to.contain(testSchedule.name);
			expect(rowData[1].innerText).to.contain(testSchedule.type);
			expect(rowData[2].innerText).to.contain(testSchedule.frequency);
			expect(rowData[3].innerText).to.contain(`${testSchedule.startDate} - ${testSchedule.endDate}`);
			expect(rowData[4].innerText).to.contain(testSchedule.enabled ? 'Enabled' : 'Disabled');
		});

		it('should display the loading spinner when loading', async() => {
			setupLongLoad();
			const el = await fixture(defaultFixture);

			const loadingSpinner = el.shadowRoot.querySelector('d2l-loading-spinner');
			expect(loadingSpinner).to.not.be.null;
		});
	});

});

function setupTestData(schedules) {
	const patches = {};
	if (schedules && Array.isArray(schedules)) {
		patches['getSchedules'] = async() => schedules;
	}
	getManageSchedulesServiceStub.returns(new ManageSchedulesTestService(patches));
}

function setupLongLoad() {
	const patches = {
		getSchedules: async() => {
			return new Promise(resolve => setTimeout(resolve, 5000));
		}
	};
	getManageSchedulesServiceStub.returns(new ManageSchedulesTestService(patches));
}
