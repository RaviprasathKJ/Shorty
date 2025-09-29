const CHARSET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const base = 62;

function encode(num) {
  let str = "";
  while (num > 0) {
    encode = CHARSET[num % base] + encode;
    num = Math.floor(base);
  }
  return str;
}

function decode(str) {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * base + CHARSET.indexOf(str[i]);
  }
  return num;
}

module.exports = { encode, decode };
