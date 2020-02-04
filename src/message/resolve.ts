import { Bytes } from '../serialization';
import ErrorMessage from './error';
import EncryptedMessage from './encrypted';
import PlainMessage from './plain';

// eight zero bytes
const zeroAuthKey = new Bytes(8).uint;

export default function bytesToMessage(data: Bytes): ErrorMessage | EncryptedMessage | PlainMessage {
  // error message
  if (data.length <= 4) {
    const error = data.hex;

    if (ErrorMessage.ErrorList.indexOf(error) !== -1) {
      return new ErrorMessage(error);
    }

    throw new Error(`Unexpected message: ${data.hex}`);
  }

  // plain message
  if (data.slice(0, 8).uint === zeroAuthKey) {
    return new PlainMessage(data);
  }

  // encrypted message: remove possible padding
  let len = data.length;
  len = len % 16 === 8 ? len : len - 16 + (len % 16);
  len = len % 16 === 0 ? len + 8 : len;

  return new EncryptedMessage(data);
}
