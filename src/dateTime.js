
import { formatDate, formatTime, parseTime } from '@brightspace-ui/intl/lib/dateTime';
import moment from 'moment/src/moment';

/*
	Logic for UTC -> Local DateTime conversion goes here
	We are assuming the LMS will give us a UTC DateTime string in the ISO 8601 format (ex: 1994-11-05T13:15:30Z)
	Returns a Javascript Date object
*/
export function getLocalDateTimeFromUTCDateTimeString(utcDateTimeStr) {
	if (utcDateTimeStr === undefined || utcDateTimeStr === null)
		return utcDateTimeStr;

	const localDateObj = new Date(utcDateTimeStr);
	return localDateObj;
}

/*
	Logic for Local DateTime -> UTC conversion goes here
	We are assuming that our frontend code will manipulate Javascript Date objects
	Returns a UTC DateTime string, in the ISO 8601 format (ex: 1994-11-05T13:15:30Z)
*/
export function getUTCDateTimeStringFromLocalDateTime(localDateObj) {
	if (localDateObj === undefined || localDateObj === null)
		return localDateObj;

	const utcDateTimeStr = localDateObj.toISOString();
	return utcDateTimeStr;
}

export function getUTCTimeStringFromLocalTime(localTimeStr) {
	if (localTimeStr === undefined || localTimeStr === null)
		return localTimeStr;

	const today = new Date();
	const splitLocalTime = localTimeStr.split(':');
	const localHours = splitLocalTime[0];
	const localMinutes = splitLocalTime[1];

	const localDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate(), localHours, localMinutes);
	const utcDateTimeStr = localDateObj.toISOString();
	const startIndex = utcDateTimeStr.indexOf('T') + 1;
	const endIndex = utcDateTimeStr.indexOf('Z');
	const utcTimeStr = utcDateTimeStr.substring(startIndex, endIndex);

	return utcTimeStr;
}

export function getLocalTimeStringFromUTCTime(utcTimeStr) {
	if (utcTimeStr === undefined || utcTimeStr === null)
		return utcTimeStr;

	const utcDateTimeObj = parseTime(utcTimeStr);
	const utcDateStr = formatDate(utcDateTimeObj, { format: 'yyyy-MM-dd' }).replaceAll('/', '-');
	const localTimeStr = buildTimeString(new Date(`${utcDateStr}T${buildTimeString(utcDateTimeObj, true)}`));

	return localTimeStr;
}

function buildTimeString(dateTimeObj, utc = false) {
	return `${formatTime(dateTimeObj, { format: 'HH:mm' })}:00${ utc ? 'z' : '' }`;
}
