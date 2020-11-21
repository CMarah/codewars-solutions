const SIZE = 7;
let soln_board;
const perm_aux = n => n === 1 ? [[0]] : perm_aux(n-1).reduce((acc, p) => acc.concat(
  (new Array(n)).fill(0).map((x, i) => [i, ...p])
), []);
const permutations = perm_aux(SIZE).map(p => p.reduce((acc, i) => acc.concat(
  (new Array(SIZE).fill(0).map((x,i) => i+1)).filter(x => !acc.includes(x))[i])
, []));

const getViewed = line => ([ //left, right
  line.filter((x, i) => !line.slice(0, i).some(y => y > x)).length,
  line.filter((x, i) => !line.slice(i+1).some(y => y > x)).length,
]);
const newArrayF = f => (new Array(SIZE)).fill(0).map((x, i) => f(i));

const printBoard = (board, clues) => {
  console.log('-', clues.slice(0,SIZE).join(' '), '-');
  (new Array(SIZE)).fill(0).forEach((x, i) => {
    console.log(clues[4*SIZE-1-i], board[i].join(' '), clues[i + SIZE]);
  });
  console.log('-', clues.slice(2*SIZE, 3*SIZE).reverse().join(' '), '-');
};

const countN = (board, n) => board.filter(r => r.includes(n)).length;

const rowOptions = (board, clues) => newArrayF(i => i).map(r => {
  const clue_r = clues[SIZE+r];
  const clue_l = clues[4*SIZE-1-r];
  return permutations.filter(p => {
    const v = getViewed(p);
    return [0, v[0]].includes(clue_l) && [0, v[1]].includes(clue_r) &&
      board[r].every((x, c) => x === 0 || p[c] === x);
  });
});
const colOptions = (board, clues) => newArrayF(i => i).map(c => {
  const clue_t = clues[c];
  const clue_b = clues[3*SIZE-1-c];
  return permutations.filter(p => {
    const v = getViewed(p);
    return [0, v[0]].includes(clue_t) && [0, v[1]].includes(clue_b) &&
      board.map(r => r[c]).every((x, r) => x === 0 || p[r] === x);
  });
});
const cellOptions = (board, ro, co) => newArrayF(i => i).map(r =>
  newArrayF(i => i).map(c => {
    if (board[r][c]) return [];
    const r_o = [...new Set(ro[r].map(row => row[c]))];
    const c_o = [...new Set(co[c].map(col => col[r]))];
    return r_o.filter(o => c_o.includes(o));
  })
);
const getOptions = (board, clues) => {
  const row_options = rowOptions(board, clues);
  const col_options = colOptions(board, clues);
  return {
    row: row_options,
    col: col_options,
    cell: cellOptions(board, row_options, col_options),
  };
};

const updateOptions = (board, prev_options) => {
  const { row, col } = prev_options;
  const new_row = row.map((or, r) => or.filter(o =>
    board[r].every((x,c) => x === 0 || o[c] === x) &&
      !o.some((x, c) => board.some((br, brn) => brn !== r && br[c] === x))
  ));
  const new_col = col.map((oc, c) =>
    oc.filter(o => board.map(br => br[c]).every((x,r) => x === 0 || o[r] === x) &&
      !o.some((x, r) => board[r].some((n, bc) => bc !== c && x === n))
  ));
  return {
    row: new_row,
    col: new_col,
    cell: cellOptions(board, new_row, new_col),
  };
};

const obviousMovesCO = (board, options, clues, check) => {
  const next_co = options.cell;
  let changed = false;
  for (i of newArrayF(k => k)) { //[1,2...,SIZE]
    const cor = next_co[i];
    for (j of newArrayF(k => k)) {
      const co = cor[j];
      if (co.length === 1) {
        if (check && !checkValidMove(board, clues, [i, j, co[0]])) return null;
        board[i][j] = co[0];
        changed = true;
      }
    }
  };
  for (n of newArrayF(i => i+1)) { //[1,2...,SIZE]
    if (countN(board, n) === SIZE-1) {
      const row = board.findIndex(r => !r.includes(n));
      const col = newArrayF(i => i).find(c => !board.some(r => r[c] === n));
      if (!next_co[row][col].includes(n)) return null;
      if (check && !checkValidMove(board, clues, [row, col, n])) return null;
      board[row][col] = n;
      changed = true;
    }
  };
  for (r of newArrayF(k => k)) { // Check if only 1 slot in row
    const ncr = next_co[r];
    for (n of newArrayF(k => k+1)) {
      if (ncr.filter(o => o.includes(n)).length === 1) {
        const c = ncr.findIndex(o => o.includes(n));
        if (check && !checkValidMove(board, clues, [r, c, n])) return null;
        board[r][c] = n;
        changed = true;
      }
    }
  }
  for (c of newArrayF(k => k)) { // Check if only 1 slot in row
    const ncc = next_co.map(ncr => ncr[c]);
    for (n of newArrayF(k => k+1)) {
      if (ncc.filter(o => o.includes(n)).length === 1) {
        const r = ncc.findIndex(o => o.includes(n));
        if (check && !checkValidMove(board, clues, [r, c, n])) return null;
        board[r][c] = n;
        changed = true;
      }
    }
  }
  if (changed) {
    const changed_co = updateOptions(board, options);
    return obviousMovesCO(board, changed_co, clues, check);
  }
  else return [board, options];
};

const processBoardCO = (board, options, clues) => {
  if (!board || soln_board) return;
  if (!board.filter(r => r.includes(0)).length) {
    soln_board = board;
    return;
  }
  const cell_options = options.cell;

  const selected_options = cell_options.reduce((acc, cor, i) => {
    return cor.reduce((acc, co, j) => {
      if (!acc && co.length) return [i, j, co];
      if (!acc && !co.length) return null;
      return acc[2].length > co.length && co.length ? [i,j,co] : acc;
    }, acc);
  }, null);
  if (!selected_options) return;

  return selected_options[2].reduce((acc, opt) => {
    if (acc) return acc;
    const row = selected_options[0];
    const col = selected_options[1];
    if (!checkValidMove(board, clues, [row, col, opt])) return acc;
    const new_board = board.map(
      (x,i) => i !== row ? x.slice(0) : x.map((y, j) => j !== col ? y : opt)
    );
    let next_options = {
      row: options.row.map(x => x.slice(0)),
      col: options.col.map(x => x.slice(0)),
      cell: null,
    };
    next_options = updateOptions(new_board, next_options);

    const next_state = obviousMovesCO(new_board, next_options, clues, true);
    if (!next_state) return acc;
    return processBoardCO(...next_state, clues);
  }, null);
};

const checkValidMove = (board, clues, move) => {
  const [ m_i, m_j, m_v ] = move;
  if (board[m_i][m_j] === m_v) return true;
  if (board[m_i][m_j] && board[m_i][m_j] !== m_v) return false;
  if (board[m_i].some(v => v === m_v)) return false; //Already in row
  if (board.some(r => r[m_j] === m_v)) return false; //Already in column
  if (board[m_i].filter(x => x).length === (SIZE-1)) { //Check row clues
    const clue_r = clues[SIZE+m_i];
    const clue_l = clues[4*SIZE-1-m_i];
    const [view_l, view_r] = getViewed(board[m_i].map(x => x ? x : m_v));
    if (clue_l && view_l !== clue_l) return false;
    if (clue_r && view_r !== clue_r) return false;
  }
  if (board.map(r => r[m_j]).filter(x => x).length === (SIZE-1)) { //Check col clues
    const clue_t = clues[m_j];
    const clue_b = clues[3*SIZE-1-m_j];
    const [view_t, view_b] = getViewed(board.map(r => r[m_j] ? r[m_j] : m_v));
    if (clue_t && view_t !== clue_t) return false;
    if (clue_b && view_b !== clue_b) return false;
  }
  return true;
};

const solvePuzzle = clues => {
  soln_board = null;
  const empty_board = (new Array(SIZE)).fill(0).map((x, i) => (new Array(SIZE)).fill(0));
  const options = getOptions(empty_board, clues);
  const initial_state = obviousMovesCO(empty_board, options, clues, false);
  processBoardCO(...initial_state, clues);
  return soln_board;
};
