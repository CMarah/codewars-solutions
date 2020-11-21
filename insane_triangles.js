//Binomail coefficient with n,k < 3
const basicBn = (n, k) => 1 + (n===2 && k === 1 ? 1 : 0);

//Use Lucas' Theorem to decompose binomial coefficient mod 3
const lucasMod3 = (n, k) => {
  if (k === 0) return 1;
  if (k === 1) return n;
  if (k === 2) return n*(n-1)/2;
  if (k > (n-k)) return lucasMod3(n, n-k);
  
  let res = 1;
  let n_div = n;
  let k_div = k;
  while (n_div !== 0) {
    if (k_div%3 > n_div%3) return 0;
    res = (res*basicBn(n_div%3, k_div%3))%3;
    n_div = parseInt(n_div/3);
    k_div = parseInt(k_div/3);
  }
  return res;
};

const triangle = row => {
  const result_num = row.split("").reduce((acc, e, i) => {
    if (e === 'R') return acc;
    const multiplier = row.length%2 ?
      (e === 'G' ? 1 : 2) : (e === 'G' ? 2 : 1);
    return (acc + (e === 'R' ? 0 : multiplier*lucasMod3(row.length - 1, i)))%3;
  }, 0);
  return ['R','G','B'][result_num];
};
