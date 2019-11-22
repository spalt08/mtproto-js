export type RPCHeaders = {
  msgID: string,
  dc: number,
  thread: number,
  transport: string,
};

/** Generic error for mtproto transport */
export type ClientError = {
  type: 'rpc' | 'network';
  code: number,
  message?: string,
};