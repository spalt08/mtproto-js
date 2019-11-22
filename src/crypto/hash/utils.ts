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
