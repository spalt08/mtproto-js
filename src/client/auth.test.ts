import TypeLanguage from '../tl';
import Client from './client';
import { createAuthKey, bindTempAuthKey, initConnection } from './auth';

test('Auth | permanent key', () => {
  const tl = new TypeLanguage();
  const client = new Client(tl, {
    test: true,
    dc: 2,
    autoConnect: false,
  });

  createAuthKey(client, 2, 1, 0, (err, k) => {
    expect(err).toBe(null);

    if (!k) throw new Error('Expected auth key');

    expect(k.id.length).toBe(16);
  });
});

test('Auth | binding and init session', () => {
  const tl = new TypeLanguage();
  const client = new Client(tl, {
    test: true,
    dc: 2,
    autoConnect: false,
  });

  createAuthKey(client, 2, 1, 0, (err, k) => {
    expect(err).toBe(null);

    if (!k) throw new Error('Expected auth key');

    expect(k.id.length).toBe(16);

    const permKey = k;

    createAuthKey(client, 2, 1, 3600 * 1, (errp, kp) => {
      expect(errp).toBe(null);

      if (!kp) throw new Error('Expected auth key');

      expect(kp.id.length).toBe(16);

      const tempKey = kp;

      bindTempAuthKey(client, 2, permKey, tempKey, (res) => {
        expect(res).toBeTruthy();

        initConnection(client, 2, (resi) => {
          expect(resi).toBeTruthy();
        });
      });
    });
  });
});
