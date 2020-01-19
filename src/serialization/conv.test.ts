import { raw2hex, hex2raw } from './conv';

test('conv | raw2hex', () => {
  expect(raw2hex('test')).toBe('74657374');
  expect(raw2hex('hello')).toBe('68656c6c6f');
});

test('conv | hex2raw', () => {
  expect(hex2raw('74657374')).toBe('test');
  expect(hex2raw('68656c6c6f')).toBe('hello');
});
