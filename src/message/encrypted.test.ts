/* eslint-disable max-len */
import EncryptedMessage from './encrypted';
import { hex, Bytes } from '../serialization';

test('message | encrypted create', () => {
  const data = new Bytes(32);

  data.randomize();

  const authKey = hex('0102030405060708').raw;
  const msgKey = hex('fffefdfcfbfaf9f8f7f6f5f4f3f2f1f0').raw;

  const msg = new EncryptedMessage(data.length);

  msg.authKey = authKey;
  msg.key = msgKey;
  msg.data = data;

  expect(msg.buf.length).toBe(24 + data.length);

  expect(msg.buf.slice(0, 8).raw).toEqual(authKey);
  expect(msg.buf.slice(8, 24).raw).toEqual(msgKey);
  expect(msg.buf.slice(24).hex).toEqual(data.hex);
});

test('message | decrypt', () => {
  const data = hex('505e0d0a1e4b12fcfe178abbebbbf1f7e501af6e0338c1cc59d44475d70ea76ad28f9a8b87e644620577572003c2bf22cb69e57fb1947956efc04e63c4e2f1a4ea5f500d3282deb339d6617a8192be5a3de91fc2a6c674d020222aff6bbeefaa0940371d48cf10d729d3673103fb05f29df3a0c5f1ffd1837e8ef1a53405adb979a3e17169b9a8e5c751784b74b35475d4e7cd28626344c2776cf070343349477bd3a145206e07eb');
  const msg = new EncryptedMessage(data);
  const key = '56a0f05d8df1b0ff4d3c17515f3f3d133a17717aa053a709bb30db9f62ddac6591950fb5c3e042aa5988f11aa81a874aacf09679c5efa787b08e1ba416cc5f00010cc765393e9379a2ad8abf30db102c0d78551b4a34bf4135788e2448855bea978b48dbd901c143e5b53ce38eee7a31556f5f20f440e55aa08291283b768cf81e49153e45f79b9b9bbae28de7cedae5ce470273d4ee4dca4bce3d42549d2c9a4e6a4e02f12a52fc85e7de2e2dca42838f1e368b3e0121f063ff020edb0846660e802b565c2b4fc587496cf34bee44652e24da7400b191bf23573d54354bc9784a9aefd292476fd597b7dd3af5d390e1132f6f4de9cd411d2ec8927460ccba5b';
  const decrypted = '8df55eb2ff2bfb31dfe57cf2c92a629c015cda873537245e0200000058000000dcf8f173020000000174d9873537245e010000001c0000000809c29e04c5500c3537245efed9f752cceb4c988df55eb2ff2bfb310154da873537245e020000001400000059b4d66215c4b51c0100000004c5500c3537245ed06c04d8c6caac8f3cc6b63f1ba9f484ff48da89f5d4591d';

  expect(msg.decrypt(key).buf.hex).toEqual(decrypted);
});
