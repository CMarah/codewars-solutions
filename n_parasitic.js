const DIG = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];

const getDigits = (last_digit, base) => {
  let digits = [last_digit];
  let remainder = 0;
  while (true) {
    const full_value = remainder + last_digit*digits.slice(-1)[0];
    if (last_digit === full_value) return digits;
    const new_digit = full_value%base;
    digits.push(new_digit);
    remainder = Math.floor(full_value/base);
  }
};

const calculateSpecial = (last_digit, base) => {
  const digits = getDigits(last_digit, base);
  return digits.reduce((num, digit) => DIG[digit] + num, '');
};
