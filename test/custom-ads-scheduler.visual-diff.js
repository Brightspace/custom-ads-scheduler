const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-manage-schedules', () => {

	const visualDiff = new VisualDiff('custom-ads-scheduler', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({ width: 800, height: 2000, deviceScaleFactor: 2 });
		await page.goto(`${visualDiff.getBaseUrl()}/test/custom-ads-scheduler.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	it('manage schedules empty page passes visual-diff comparison', async function() {
		const rect = await visualDiff.getRect(page, '#manage-schedules-empty');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('manage schedules passes visual-diff comparison', async function() {
		const rect = await visualDiff.getRect(page, '#manage-schedules');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('schedule logs passes visual-diff comparison', async function() {
		const rect = await visualDiff.getRect(page, '#schedule-logs');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('wizard passes visual-diff comparison', async function() {
		const rect = await visualDiff.getRect(page, '#wizard-manager');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('wizard passes visual-diff comparison, step 2', async function() {
		await page.$eval('#wizard-manager', (page) => {
			const wizard = page.children[0].shadowRoot.getElementById('wizard');
			wizard.next();
		});
		const rect = await visualDiff.getRect(page, '#wizard-manager');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('wizard passes visual-diff comparison, step 3', async function() {
		await page.$eval('#wizard-manager', (page) => {
			const wizard = page.children[0].shadowRoot.getElementById('wizard');
			wizard.next();
		});
		const rect = await visualDiff.getRect(page, '#wizard-manager');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
