/* eslint-disable no-undef */
function getDayOfWeekString(dayOfWeek) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (dayOfWeek >= 0 && dayOfWeek <= 6) {
    return days[dayOfWeek];
  }
  return 'Invalid DOW';
}

output.oldAccount = {
  username: '88420.0',
  password: '123456',
};

output.newAccount = {
  username: new Date().getTime() % 100000,
  name: 'testing',
  password: '123456',
};

output.editProfile = {
  name: 'A New Me',
  bio: 'New Bio',
};

output.newHabit = {
  name: 'yay',
  description: 'yay yay desc',
  freq: getDayOfWeekString(new Date().getDay()),
};

output.editHabit = {
  name: 'edited habit',
  description: 'editedDesc',
};

output.notTodayHabit = {
  name: 'not on ' + getDayOfWeekString((new Date().getDay() + 2) % 6),
  description: 'yay yay desc',
  freq: getDayOfWeekString((new Date().getDay() + 2) % 6),
};
