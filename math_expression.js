const isNumber = expr => !['+','-','*','/','('].some(c => expr.slice(1).includes(c));

// This function takes a-b and turns it into a+-b
const addMissingPluses = expr => expr.replace(
  /-/g,
  (match, offset) => [undefined, '*', '/', '+'].includes(expr[offset-1]) ?
    match : '+-',
);

// Removes unneeded characters
const cleanExpression = expr => expr.replace(/ /g, '').replace(/--/g, '+')
  .replace(/\*\+/g, '*').replace(/\/\+/g, '/').replace(/\+\+/, '+');

const getParenthesisIndexes = expr => {
  const opening_index = expr.indexOf('(');
  let stack = 1;
  let closing_index = opening_index;
  while (stack !== 0) {
    ++closing_index;
    const character = expr[closing_index];
    if (character === ')') --stack;
    if (character === '(') ++stack;
  }
  return [opening_index, closing_index];
};

const calc = raw_expression => {
  const expression = cleanExpression(raw_expression);
  if (isNumber(expression)) return parseFloat(expression);
  if (expression.includes('(')) {
    // Calc parenthesis into values
    const [ opening_index, closing_index ] = getParenthesisIndexes(expression);
    const parenthesis_value = calc(expression.slice(opening_index+1, closing_index));
    return calc(
      expression.slice(0, opening_index) +
      `${parenthesis_value}` +
      expression.slice(closing_index+1)
    );
  }

  // No parenthesis present
  const final_expression = addMissingPluses(expression);
  if (final_expression.includes('+')) {
    const fragments = final_expression.split(/\+/);
    const calced_fragments = fragments.map(calc);
    const pluses = final_expression.match(/\+/g);
    return pluses.reduce((current_value, op, op_index) => {
      return current_value + calced_fragments[op_index+1];
    }, calced_fragments[0]);
  } else {
    const fragments = final_expression.split(/[*\/]/);
    const calced_fragments = fragments.map(calc);
    const operations = final_expression.match(/[*\/]/g);
    return operations.reduce((current_value, op, op_index) => {
      if (op === '*') return current_value * calced_fragments[op_index+1];
      return current_value / calced_fragments[op_index+1];
    }, calced_fragments[0]);
  }
};
