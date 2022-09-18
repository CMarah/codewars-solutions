const solution = A => {
  const leftmost = A.reduce(
    (leftmost, radius, center) => leftmost > (center-radius) ? (center-radius) : leftmost
  , 0);
  console.log('L', leftmost);

  let starts = [];
  let ends = [];
  A.forEach((radius, center) => {
    const start = center - radius - leftmost;
    starts[start] = (starts[start] || 0) + 1;
    const end = center + radius - leftmost;
    ends[end] = (ends[end] || 0) + 1;
  });
  console.log('S', starts, ends);

  let running_count = 0;
  let intersections = 0;
  for (let n = 0; n < starts.length; ++n) {
    const start_here = starts[n];
    if (start_here) {
      for (let i = 0; i < start_here; ++i) {
        intersections += running_count;
        running_count += 1;
      }
    }
    const end_here = ends[n];
    if (end_here) {
      running_count -= end_here;
    }
  }
  return intersections;
};

console.log(solution([0,1,2,3,1]))
