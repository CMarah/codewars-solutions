const isZero = as => {
  if (!as.length) return false;
  if (as[0] !== 0) return false;
  if (isZero(as.slice(1))) return false;
  return true;
}

const isOne = as => {
  if (isZero(as.slice(1))) return true;
  return as[0] === 1;
};

const SEQUENCES = {
  0: [0],
  1: [1],
  2: [6,2,4,8],
  3: [1,3,9,7],
  4: [6,4],
  5: [5],
  6: [6],
  7: [1,7,9,3],
  8: [6,8,4,2],
  9: [1,9],
};

const mod2 = as => as[0]%2;

const mod4 = as => {
  const elem = as[0]%4;
  if (as.length === 1) return elem;
  if (isZero(as.slice(1))) return 1;
  if (elem === 0) return 0;
  if (elem === 1) return 1;
  if (elem === 2) return isOne(as.slice(1)) ? 2 : 0;
  if (elem === 3) {
    if (as[1] !== 0) return as[1]%2 ? 3 : 1;
    return as.length === 2 || !isZero(as.slice(2)) ? 1 : 3;
  }
};

const lastDigit = as => {
  if (!as.length) return 1;
  if (as.length === 1) return as[0]%10;
  if (isZero(as.slice(1))) return 1;
  if (SEQUENCES[as[0]%10].length === 1) return SEQUENCES[as[0]%10][0];
  return SEQUENCES[as[0]%10][mod4(as.slice(1))%SEQUENCES[as[0]%10].length];
}
