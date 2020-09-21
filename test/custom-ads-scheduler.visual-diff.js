const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-manage-schedules', () => {

	const visualDiff = new VisualDiff('custom-ads-scheduler', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 1000, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/custom-ads-scheduler.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	it('manage schedules passes visual-diff comparison', async function() {
		const rect = await visualDiff.getRect(page, '#manage-schedules');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('schedule logs passes visual-diff comparison', async function() {
		const rect = await visualDiff.getRect(page, '#schedule-logs');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
