import Bytes from './bytes';

export default function hex(str: string): Bytes {
  const normalized = str.length % 2 === 1 ? `0${str}` : str;
  const bytes = new Bytes(normalized.length / 2);

  for (let i = 0; i < normalized.length; i += 2) {
    bytes.buffer[i / 2] = +`0x${normalized.slice(i, i + 2)}`;
  }

  return bytes;
}
