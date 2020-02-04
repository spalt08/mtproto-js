/* eslint-disable max-len */
import ErrorMessage from './message';

test('message | error message create', () => {
  try {
    // @ts-ignore
    new ErrorMessage(); // eslint-disable-line
  } catch (e) {
    expect(e.message).toBe('Unable to create message with undefined');
  }
});
