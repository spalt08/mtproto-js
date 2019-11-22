/** Gets a uint32 from string in big-endian order order */
export function strToInt32(str: string, pos: number) {
  return (
    str.charCodeAt(pos) << 24
    ^ str.charCodeAt(pos + 1) << 16
    ^ str.charCodeAt(pos + 2) << 8
    ^ str.charCodeAt(pos + 3)
  );
}

/** Returns a uint32 as a string in big-endian order order */
export function int32ToStr(data: number) {
  return (
    String.fromCharCode((data >> 24) & 0xFF)
    + String.fromCharCode((data >> 16) & 0xFF)
    + String.fromCharCode((data >> 8) & 0xFF)
    + String.fromCharCode(data & 0xFF)
  );
}

/**
 * Performs a per byte XOR between two byte strings and returns the result as a
 * string of bytes.
 */
export function xorStr(left: string, right: string, n: number) {
  let s3 = '';
  let b = 0;
  let t = '';
  let i = 0;
  let c = 0;
  for (let j = n; j > 0; j -= 1, i += 1) {
    b = left.charCodeAt(i) ^ right.charCodeAt(i);
    if (c >= 10) {
      s3 += t;
      t = '';
      c = 0;
    }
    t += String.fromCharCode(b);
    c += 1;
  }
  s3 += t;
  return s3;
}
