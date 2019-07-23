export function getMonthShortName(date) {
  return date.toLocaleString('en-us', { month: 'short' });
}

export function getWeekdayName(date) {
  return date.toLocaleString('en-us', { weekday: 'long' });
}

export function format(date) {
  if (!date) {
    return null;
  }
  return date.toISOString().slice(0, 10);
}

export function lastMonday(today = new Date()) {
  const result = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const day = result.getDay();
  if (day !== 1) {
    result.setDate(result.getDate() - day + 1);
  }
  return result;
}

export function parseDate(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}
