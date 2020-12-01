import '../src/components/d2l-manage-schedules.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { frequencies, frequenciesEnum, statuses, types, typesEnum } from '../src/constants';
import { ManageSchedulesServiceFactory } from '../src/services/manageSchedulesServiceFactory';
import { ManageSchedulesTestService } from './utilities/manageSchedulesTestService';
import { newRandomSchedule } from './utilities/scheduleGenerator';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';
import translations from '../lang/en';

const defaultFixture = html`
<d2l-manage-schedules></d2l-manage-schedules>
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
			const randomSchedules = [
				newRandomSchedule(),
				newRandomSchedule(),
				newRandomSchedule()
			];

			const el = await setFixtureSchedules(defaultFixture, randomSchedules);

			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(3);
		});

		it('binds correct values in table', async() => {
			const testSchedule = {
				name: 'A',
				typeId: typesEnum.full,
				frequencyId: frequenciesEnum.weekly,
				startDate: '09/01/2020',
				endDate: '12/31/2020',
				isEnabled: true,
				statusId: 3
			};

			const el = await setFixtureSchedules(defaultFixture, [testSchedule]);

			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(1);
			const rowData = rows[0].querySelectorAll('td');
			expect(rowData[0].innerText).to.contain(testSchedule.name);
			expect(rowData[1].innerText).to.contain(translations[`schedule.type.${types[testSchedule.typeId]}`]);
			expect(rowData[2].innerText).to.contain(translations[`schedule.frequency.${frequencies[testSchedule.frequencyId]}`]);
			expect(rowData[3].innerText).to.contain('9/1/2020 12:00 AM - 12/31/2020 12:00 AM');
			expect(rowData[4].innerText).to.contain(testSchedule.isEnabled ? statuses[testSchedule.statusId] : 'Disabled');
		});
	});

});

async function setFixtureSchedules(givenFixture, schedules) {
	const el = await fixture(givenFixture);
	el.schedules = schedules;

	await timeout(10);

	return el;
}

function timeout(duration) {
	return new Promise(resolve => setTimeout(resolve, duration));
}
