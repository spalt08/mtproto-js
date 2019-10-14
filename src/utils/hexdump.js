/* eslint-disable no-bitwise */
// @flow

const stringToBytes = (data: string): ArrayBuffer => {
  const buffer = new ArrayBuffer(data.length);
  const view = new DataView(buffer);

  for (let i = 0; i < data.length; i += 1) {
    view.setUint8(i, data.charCodeAt(i));
  }

  return buffer;
};

const numberToBytes = (data: number): ArrayBuffer => {
  const bytes = [];

  while (data > 0) {
    const byte = data & 0xFF;
    bytes.push(byte);
    data = (data - byte) / 256; // eslint-disable-line no-param-reassign
  }

  const buffer = new ArrayBuffer(bytes.length);
  const view = new DataView(buffer);

  for (let i = 0; i < bytes.length; i += 1) {
    view.setUint8(i, bytes[bytes.length - i - 1]);
  }

  return buffer;
};

export default function HexDump(data: string | number | ArrayBuffer, offset?: number = 0, length?: number): string {
  let buffer: ArrayBuffer;

  if (typeof data === 'string') {
    buffer = stringToBytes(data);
  } else if (typeof data === 'number') {
    buffer = numberToBytes(data);
  } else if (typeof data === 'object' && data instanceof ArrayBuffer) {
    buffer = data;
  } else {
    return '';
  }

  let i: number = offset;
  let rendered: number = 0;
  let output: string = '\n';

  const view = new DataView(buffer);
  const byteNum = length || buffer.byteLength;

  // for each line
  while (i < byteNum) {
    let chars: string = '';
    let bytes: string = ' ';

    const upperBound = Math.min(16, byteNum - i);

    for (; i - rendered < upperBound; i += 1) {
      const byte = view.getUint8(i);
      bytes += `${`0${byte.toString(16).toUpperCase()}`.slice(-2)} `;
      chars += byte >= 32 ? String.fromCharCode(byte) : '.';
    }

    if (upperBound < 16) bytes += '   '.repeat(16 - upperBound);

    const strNum = `${`00${(Math.floor(rendered / 16)).toString(16)}`.slice(-3)}0`;
    output += `${strNum} | ${bytes} | ${chars} \n`;

    rendered += 16;
  }

  return output;
}
