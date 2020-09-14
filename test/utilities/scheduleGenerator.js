export function newRandomSchedule() {
	const randomASCIIString = () => Math.random().toString(36);
	const randomInt = (max) => Math.floor(Math.random() * (max));

	const newSchedule = {};
	newSchedule.name = randomASCIIString();
	newSchedule.type = randomASCIIString();
	newSchedule.frequency = randomASCIIString();
	newSchedule.startDate = randomASCIIString();
	newSchedule.endDate = randomASCIIString();
	newSchedule.enabled = randomInt(2) === 0;

	return newSchedule;
}
