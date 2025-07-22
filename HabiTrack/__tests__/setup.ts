expect.extend({
  toBeCloseInTime(received, expected) {
    const receivedTimeInMins = received.getHours() * 60 + received.getMinutes();
    const expectedTimeInMins = expected.getHours() * 60 + expected.getMinutes();
    const pass = Math.abs(receivedTimeInMins - expectedTimeInMins) < 1;
    return {
      pass,
      message: () => `expected ${received} to be close in time to ${expected}`,
    };
  },
});
