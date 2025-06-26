// calculate no. of days b/w 2 dates in 'YYYY-MM-DD' format
export function calculateDaysBetweenDates(earlierDate: string, laterDate: string) {
  const firstDate = new Date(earlierDate);
  firstDate.setHours(1, 0, 0, 0);

  const secondDate = new Date(laterDate);
  secondDate.setHours(1, 0, 0, 0);

  const diffInMs = secondDate.getTime() - firstDate.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}

// calculate days b/w 2 days of week
export function calculateDaysBetweenDOW(earlierDateDOW: number, laterDateDOW: number) {
  if (earlierDateDOW === laterDateDOW) {
    return 7;
  }
  if (earlierDateDOW < laterDateDOW) {
    return laterDateDOW - earlierDateDOW;
  }
  // case where earlierDateDow > laterDateDOW
  return 7 - earlierDateDOW + laterDateDOW;
}

export function getDayOfWeekString(dayOfWeek: number) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (dayOfWeek >= 0 && dayOfWeek <= 6) {
    return days[dayOfWeek];
  }
  return 'Invalid DOW';
}

// get "[day] [month], [DOW]" format out of "YYYY-MM-DD" string
export function getNiceDateString(date: string) {
  let month = date.substring(5, 7);
  let day = date.substring(8, 10);

  if (day.charAt(0) === '0') {
    day = day.charAt(1);
  }

  if (month === '01') month = 'Jan';
  if (month === '02') month = 'Feb';
  if (month === '03') month = 'Mar';
  if (month === '04') month = 'Apr';
  if (month === '05') month = 'May';
  if (month === '06') month = 'Jun';
  if (month === '07') month = 'Jul';
  if (month === '08') month = 'Aug';
  if (month === '09') month = 'Sep';
  if (month === '10') month = 'Oct';
  if (month === '11') month = 'Nov';
  if (month === '12') month = 'Dec';

  const DOW = getDayOfWeekString(new Date(date).getDay());
  return `${day} ${month}, ${DOW}`;
}

export function reorderDateString(date: string) {
  let year = date.substring(0, 4);
  let month = date.substring(5, 7);
  let day = date.substring(8, 10);

  return `${day}-${month}-${year}`;
}

// gets an array of expected dates for a habit in 'YYYY-MM-DD' format (input freq array must be sorted)
export function getExpectedDates(startDate: string, endDate: string, freq: number[]): string[] {
  if (freq.length === 0) {
    return [];
  }

  if (startDate > endDate) {
    return [];
  }
  const noOfDOWS = freq.length;

  // const start = new Date(startDate);
  const end = new Date(endDate);

  const result: string[] = [];

  const current = new Date(startDate);
  let currentDOW = current.getDay();
  let currIndex = -1;

  // set current to next expected date (if current is not already an expected date)
  if (!freq.includes(currentDOW)) {
    let larger = true;
    for (let i = 0; i < noOfDOWS; i++) {
      if (freq[i] > currentDOW) {
        // means we are on the ith DOW of freq
        larger = false;
        const diff = freq[i] - currentDOW;
        current.setDate(current.getDate() + diff);
        currIndex = i;
        break;
      }
    }
    if (larger === true) {
      // means we are on the 0th DOW of freq
      const diff = 7 - currentDOW + freq[0];
      current.setDate(current.getDate() + diff);
      currIndex = 0;
    }
  } else {
    // current day is in freq, set its index
    currIndex = freq.indexOf(currentDOW);
  }

  while (current <= end) {
    result.push(current.toJSON().split('T')[0]);

    let daysToAdd = -1;

    if (currIndex + 1 >= noOfDOWS) {
      // reached end of freq array
      daysToAdd = 7 - freq[currIndex] + freq[0];
      currIndex = 0;
    } else {
      // haven't reach end yet
      daysToAdd = freq[currIndex + 1] - freq[currIndex];
      currIndex = currIndex + 1;
    }

    // add the required no. of days and continue while loop
    current.setDate(current.getDate() + daysToAdd);
  }

  return result;
}
