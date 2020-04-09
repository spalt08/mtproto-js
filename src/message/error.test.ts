/* eslint-disable max-len */
import ErrorMessage from './error';

test('message | error message create', () => {
  const err = new ErrorMessage(0x53feffff);
  expect(err.error.code).toBe(404);
});
