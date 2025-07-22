declare global {
  namespace jest {
    interface Matchers<R> {
      toBeCloseInTime(expected: Date): R;
    }
  }
}

export {};
