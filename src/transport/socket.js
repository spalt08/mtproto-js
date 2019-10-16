// @flow

export default class Socket extends WebSocket {
  constructor(addr: string, ssl: boolean = true) {
    super(`ws${ssl ? 's' : ''}://${addr}/apiws1`, 'binary');
  }
}
