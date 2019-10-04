// @flow

const startTime = Date.now();

let lastTime;
let lastRepeated;

type UniqueTime = {
  second: number,
  nanosecond: number,
  offset: number,
  repeated: number,
};

export default function getTime(): UniqueTime {
  const time = Date.now();

  if (time === lastTime) {
    lastRepeated += 1;
  } else {
    lastTime = time;
    lastRepeated = 1;
  }

  return {
    second: Math.floor(time / 1000),
    nanosecond: Math.floor(time % 1000),
    offset: ((time - startTime) / 1000).toFixed(2),
    repeated: lastRepeated,
  };
}
