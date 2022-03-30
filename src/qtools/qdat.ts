import * as qdat from './qdat';
/**
 * Get short date with day of week, in American format. 
 *
 * qdat.getShortAmericanDateWithDayOfWeek('2021-08-20') 
 *
 * "Fri, Aug 20, 2021"
 */
export const getShortAmericanDateWithDay = (isoDate: string) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Get short month-day in American format.
 *
 * qdat.getShortAmericanDateWithDayOfWeek('Aug 20') 
 *
 * "Fri, Aug 20, 2021"
 */
export const getShortAmericanMonthDay = (isoDate: string) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const getCurrentIsoDate = () => {
	return qdat.convertDateObjectToIsoDate(new Date());
}

export const convertDateObjectToIsoDate = (dateObj: any) => {
	let month = '' + (dateObj.getMonth() + 1),
		day = '' + dateObj.getDate(),
		year = dateObj.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('-');
}