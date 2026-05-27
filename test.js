/**
 * Test Runner for C-Code Optimizer and Analyzer
 * Verifies each C optimization pass in isolation.
 */

const { tokenize } = require('./compiler/lexer');
const { Parser } = require('./compiler/parser');
const { generateCode } = require('./compiler/optimizer');
const { 
  constantFolding,
  propagateValues,
  deadCodeElimination,
  commonSubexpressionElimination,
  loopOptimization,
  strengthReduction,
  removeUnusedVariables
} = require('./compiler/optimizer');

function runTest(name, code, passFn, expectedSubstring) {
  try {
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    const parseResult = parser.parse();

    if (parseResult.errors.length > 0) {
      console.error(`FAIL: ${name} (Syntax Errors)`);
      parseResult.errors.forEach(e => console.error(`  - ${e}`));
      return false;
    }

    // Run the specified optimization pass in isolation
    const optimizedAst = passFn(parseResult.ast);
    const optimizedCode = generateCode(optimizedAst).replace(/\s+/g, ' ').trim();
    const cleanExpected = expectedSubstring.replace(/\s+/g, ' ').trim();

    if (optimizedCode.includes(cleanExpected)) {
      console.log(`PASS: ${name}`);
      return true;
    } else {
      console.error(`FAIL: ${name}`);
      console.error(`  Expected to contain: "${cleanExpected}"`);
      console.error(`  Actual result:       "${optimizedCode}"`);
      return false;
    }
  } catch (e) {
    console.error(`FAIL: ${name} (Exception thrown)`);
    console.error(e);
    return false;
  }
}

console.log('Running C-Code Optimizer compiler unit tests...\n');

let passCount = 0;
let totalTests = 0;

// Test 1: Constant Folding
totalTests++;
if (runTest(
  'Constant Folding',
  'int main() { int x = 5 + 3 * 2; return x; }',
  constantFolding,
  'int x = 11;'
)) passCount++;

// Test 2: Dead Code Elimination
totalTests++;
if (runTest(
  'Dead Code Elimination',
  'int main() { if (0) { int y = 1; } else { int y = 2; } return y; }',
  deadCodeElimination,
  'int y = 2;'
)) passCount++;

// Test 3: Common Subexpression Elimination
totalTests++;
if (runTest(
  'Common Subexpression Elimination',
  'int main() { int a = x + y; int b = x + y; return a + b; }',
  commonSubexpressionElimination,
  'int a = (x + y); int b = a;'
)) passCount++;

// Test 4: Copy Propagation
totalTests++;
if (runTest(
  'Copy & Constant Propagation',
  'int main() { int a = b; int c = a + 1; return c; }',
  propagateValues,
  'int c = (b + 1);'
)) passCount++;

// Test 5: Strength Reduction
totalTests++;
if (runTest(
  'Strength Reduction',
  'int main() { int a = x * 2; int b = y * 8; return a + b; }',
  strengthReduction,
  'int a = (x << 1); int b = (y << 3);'
)) passCount++;

// Test 6: Unused Variable Removal
totalTests++;
if (runTest(
  'Unused Variable Removal',
  'int main() { int u = 100; int v = 200; return v; }',
  removeUnusedVariables,
  'int v = 200; return v;' // 'u' should be completely removed
)) passCount++;

// Test 7: Loop Invariant Code Motion (Loop Optimization)
totalTests++;
if (runTest(
  'Loop Invariant Code Motion',
  'int main() { int i = 0; int sum = 0; while(i < 10) { int invariant = 5 + 10; sum = sum + i; i = i + 1; } return sum; }',
  loopOptimization,
  'int invariant = (5 + 10); while ((i < 10)) { sum = (sum + i); i = (i + 1); }'
)) passCount++;

console.log(`\nTests finished: ${passCount}/${totalTests} tests passed.`);
if (passCount !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
