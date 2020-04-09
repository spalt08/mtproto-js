import PlainMessage from './plain';
import { Reader32, Writer32 } from '../serialization';

test('message | plain create', () => {
  const payload = new Uint32Array([0x78974660, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]);

  const msg = new PlainMessage(payload, true);
  msg.id = '51e57ac42770964a';

  expect(msg.nonce).toEqual(new Uint32Array([0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]));

  expect(msg.buf).toEqual(
    new Uint32Array([
      0x00000000, 0x00000000, 0x4A967027, 0xC47AE551, 0x14000000,
      0x78974660, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC,
    ]),
  );

  expect(msg.writer instanceof Writer32).toBeTruthy();
});

test('message | plain generate id', () => {
  for (let i = 0; i < 20; i++) PlainMessage.GenerateID();

  expect(PlainMessage.GenerateID().length).toBe(16);
  expect(PlainMessage.GenerateID().length).toBe(16);
  expect(PlainMessage.GenerateID().length).toBe(16);
});

test('message | plain read', () => {
  const message = new Uint32Array([
    0x00000000, 0x00000000, 0x4A967027, 0xC47AE551, 0x14000000,
    0x78974660, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC,
  ]);

  const msg = new PlainMessage(message);

  expect(msg.id).toBe('51e57ac42770964a');
  expect(msg.nonce).toEqual(new Uint32Array([0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]));
  expect(msg.data).toEqual(new Uint32Array([0x78974660, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]));

  expect(msg.reader instanceof Reader32).toBeTruthy();
  expect(msg.reader.int32()).toBe(0x60469778);
});
