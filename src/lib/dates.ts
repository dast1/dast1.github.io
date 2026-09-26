const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const month = MONTHS[monthIndex];
  if (!month || day < 1 || day > 31) return isoDate;
  return `${month} ${day}, ${year}`;
}

export function formatMonth(isoMonth: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(isoMonth);
  if (!match) return isoMonth;
  const year = Number(match[1]);
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${year}` : isoMonth;
}

export function yearOf(isoDate: string): string {
  return isoDate.slice(0, 4);
}

/** Noon UTC, so a calendar day does not slip across time zones in feeds. */
export function parseDay(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00.000Z`);
}
