export function raw2hex(raw: string) {
  let hex = '';

  for (let i = 0; i < raw.length; i += 1) {
    hex += `0${raw.charCodeAt(i).toString(16)}`.slice(-2);
  }

  return hex;
}

export function hex2raw(hex: string) {
  const normalized = hex.length % 2 === 1 ? `0${hex}` : hex;
  let raw = '';

  for (let i = 0; i < normalized.length; i += 2) {
    raw += String.fromCharCode(+`0x${normalized.slice(i, i + 2)}`);
  }

  return raw;
}
