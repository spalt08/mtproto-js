// @flow

export interface Transport {
  authorize(): void;

  setAuthKeys(string, string): void;
  setSession(string, string): void;

  addRSAKey(string): void;

  call(): void;
  callPlain(): void;
}
