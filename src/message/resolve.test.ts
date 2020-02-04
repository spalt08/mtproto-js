import PlainMessage from './plain';
import ErrorMessage from './error';
import EncryptedMessage from './encrypted';
import bytesToMessage from './resolve';
import { hex } from '../serialization';
import plainMock from '../mock/message_plain';
import errorMock from '../mock/message_error';
import encryptedMock from '../mock/message_encrypted';

test('message | resolve', () => {
  expect(bytesToMessage(errorMock) instanceof ErrorMessage).toBeTruthy();
  expect(bytesToMessage(plainMock.buf) instanceof PlainMessage).toBeTruthy();
  expect(bytesToMessage(encryptedMock.buf) instanceof EncryptedMessage).toBeTruthy();

  try {
    bytesToMessage(hex('ff'));
  } catch (e) {
    expect(e.message).toBe('Unexpected message: ff');
  }
});
