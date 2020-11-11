export function newRandomSchedule() {
	const randomASCIIString = () => Math.random().toString(36);
	const randomInt = (max) => Math.floor(Math.random() * (max));

	const newSchedule = {};
	newSchedule.name = randomASCIIString();
	newSchedule.typeId = randomInt(2) + 1;
	newSchedule.frequencyId = randomInt(4) + 1;
	newSchedule.startDate = randomASCIIString();
	newSchedule.endDate = randomASCIIString();
	newSchedule.isEnabled = randomInt(2);

	return newSchedule;
}
