import Message from './message';

export default class MessageV1 extends Message {
  // eslint-disable-next-line
  getPaddingLen(len: number) {
    return 16 - (len % 16);
  }
}
