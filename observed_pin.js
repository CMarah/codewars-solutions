const ADJACENT = {
  '0': ['0','8'],
  '1': ['1','2','4'],
  '2': ['1','2','3','5'],
  '3': ['2','3','6'],
  '4': ['1','4','5','7'],
  '5': ['2','4','5','6','8'],
  '6': ['3','5','6','9'],
  '7': ['4','7','8'],
  '8': ['0','5', '7', '8', '9'],
  '9': ['6','8','9'],
};

function getPINs(observed) {
  console.log('Gettings PINs for', observed);
  return observed.split('').map(c => ADJACENT[c])
    .reduce((acc, options) => {
      if (!acc.length) return options;
      return options.map(o => acc.map(a => a.concat(o)))
        .reduce((f, p) => f.concat(p), []);
    }, []);
};
