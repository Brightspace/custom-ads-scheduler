import '../src/components/d2l-schedule-logs.js';
import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { newRandomLog } from './utilities/logGenerator';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { ScheduleLogsServiceFactory } from '../src/services/scheduleLogsServiceFactory';
import { ScheduleLogsTestService } from './utilities/scheduleLogsTestService';
import sinon from '../node_modules/sinon/pkg/sinon-esm.js';

const scheduleLogsFixture = html`
<d2l-schedule-logs schedule-id="123"></d2l-schedule-logs>
`;
let getScheduleLogsServiceStub;

describe('d2l-schedules-log', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(scheduleLogsFixture);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-schedule-logs');
		});
	});

	describe('serialize schedule logs', () => {
		beforeEach(() => {
			getScheduleLogsServiceStub = sinon.stub(ScheduleLogsServiceFactory, 'getScheduleLogsService');
			getScheduleLogsServiceStub.returns(new ScheduleLogsTestService());
		});

		afterEach(() => {
			getScheduleLogsServiceStub.restore();
			fixtureCleanup();
		});

		it('should have all logs in table', async() => {
			setupLogsTestData([
				newRandomLog(),
				newRandomLog(),
				newRandomLog(),
				newRandomLog()
			]);

			const el = await fixture(scheduleLogsFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(4);
		});

		it('binds correct values in logs table', async() => {
			const testLog = {
				scheduleId: 1,
				runDate: new Date(2020, 9, 11, 1, 2, 3),
				endDate: new Date(2020, 9, 15, 1, 4, 17),
				statusId: 3
			};

			setupLogsTestData([testLog]);

			const el = await fixture(scheduleLogsFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(1);
			const rowData = rows[0].querySelectorAll('td');
			expect(rowData[0].innerText).to.contain('10/11/2020 1:02 AM'); // intl converted DateTime
			expect(rowData[1].innerText).to.contain('10/15/2020 1:04 AM'); // intl converted DateTime
			expect(rowData[2].innerText).to.contain(testLog.StatusName);
		});

		it('should only display the page size number of logs', async() => {
			const logs = [];
			for (let i = 0; i < 15; i++) {
				logs.push(newRandomLog());
			}
			setupLogsTestData(logs);

			const el = await fixture(scheduleLogsFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(10);
		});

		it('should calculate the correct number of pages', async() => {
			const logs = [];
			for (let i = 0; i < 25; i++) {
				logs.push(newRandomLog());
			}
			setupLogsTestData(logs);

			const el = await fixture(scheduleLogsFixture);
			const rows = el.shadowRoot.querySelectorAll('tbody > tr');
			expect(rows.length).to.equal(10);
			expect(el.maxPage).to.equal(3);
		});

		it('should display the loading spinner when loading', async() => {
			setupLongScheduleLogsLoad();
			const el = await fixture(scheduleLogsFixture);

			const loadingSpinner = el.shadowRoot.querySelector('d2l-loading-spinner');
			expect(loadingSpinner).to.not.be.null;
		});
	});
});

function setupLogsTestData(logs) {
	const patches = {
		getLogs: async() => {
			return logs;
		},
		getNumLogs: async() => {
			return logs.length;
		}
	};
	getScheduleLogsServiceStub.returns(new ScheduleLogsTestService(patches));
}

function setupLongScheduleLogsLoad() {
	const patches = {
		getLogs: async() => {
			return new Promise(resolve => setTimeout(resolve, 5000));
		}
	};
	getScheduleLogsServiceStub.returns(new ScheduleLogsTestService(patches));
}
