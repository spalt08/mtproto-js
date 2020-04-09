import ErrorMessage from './error';
import EncryptedMessage from './encrypted';
import PlainMessage from './plain';
import { Reader32 } from '../serialization';

// eight zero bytes
const zeroAuthKey = '0000000000000000';

export default function bytesToMessage(data: Uint32Array): ErrorMessage | EncryptedMessage | PlainMessage {
  const reader = new Reader32(data);

  // error message
  if (data.length <= 1) {
    const error = reader.int32();

    if (ErrorMessage.Errors[error]) {
      return new ErrorMessage(error);
    }

    throw new Error(`Unexpected message: ${error.toString(16)}`);
  }

  // plain message
  if (reader.long() === zeroAuthKey) {
    return new PlainMessage(data);
  }

  return new EncryptedMessage(data);
}
