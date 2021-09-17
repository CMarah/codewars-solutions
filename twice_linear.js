function dblLinear(n) {
  let sequence = [1];
  let twice_pointer = 0;
  let thrice_pointer = 0;
  while (sequence.length <= n) {
    const twice_next = sequence[twice_pointer]*2 + 1;
    const thrice_next = sequence[thrice_pointer]*3 + 1; 
    if (twice_next <= thrice_next) {
      sequence.push(twice_next);
      ++twice_pointer;
      if (twice_next === thrice_next) ++thrice_pointer;
    } else {
      sequence.push(thrice_next);
      ++thrice_pointer;
    }
  }
  return sequence[n];
}
