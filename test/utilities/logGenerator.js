export function newRandomLog() {

	const twentyTwenty = new Date(2020, 1, 1, 12, 0, 0);
	const twentyTwentyOne = new Date(2021, 1, 1, 12, 0, 0);

	const scheduleId = Math.round(Math.random() * Math.max).toString();
	const startDate = randomDate(twentyTwenty, twentyTwentyOne, 0, 23);
	const endDate = randomDate(startDate, twentyTwentyOne, 0, 23);
	const status = Math.round(Math.random()) ? 2 : 3;

	return {
		scheduleId: scheduleId,
		runDate: startDate,
		endDate: endDate,
		statusId: status
	};
}

function randomDate(start, end, startHour, endHour) {
	const date = new Date(+start + Math.random() * (end - start));
	const hour = startHour + Math.random() * (endHour - startHour) | 0;
	date.setHours(hour);
	return date;
}
