import TypeLanguage from '../tl';
import Client from './client';
import { createAuthKey } from './auth';

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
