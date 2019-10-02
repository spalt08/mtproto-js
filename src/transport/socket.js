// @flow

export default class Socket extends WebSocket {
  constructor(addr: string, ssl: boolean = true) {
    super(`ws${ssl ? 's' : ''}://${addr}/apiws1`, 'binary');

    this.addEventListener('open', this.handeConnection);
    this.addEventListener('message', this.handeMessage);
  }

  static handeConnection() {
    console.log('TLS Opened');
  }

  static handeMessage(event: any) {
    console.log('message', event.data);
  }
}
