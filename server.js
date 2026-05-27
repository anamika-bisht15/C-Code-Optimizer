/**
 * Node.js Express Server for C-Code Optimizer and Analyzer
 * Serves the API endpoints for code analysis and PDF generation.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const analyzeRouter = require('./routes/analyze');
const { generatePDFReport } = require('./utils/pdfGenerator');

// Import compiling functions to run analysis for PDF generation
const { tokenize } = require('./compiler/lexer');
const { Parser } = require('./compiler/parser');
const { optimizeAST, generateCode } = require('./compiler/optimizer');
const { generateTAC } = require('./compiler/tac');
const { analyzeComplexity } = require('./compiler/complexity');
const { generateAlgorithm } = require('./compiler/algorithm');
const { generateFlowchart } = require('./compiler/flowchart');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', analyzeRouter);

// PDF Generation Route
app.post('/api/report', (req, res) => {
  const { code } = req.body;

  if (typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'C code is required to generate report' });
  }

  try {
    // Run compilation pipeline
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    const parseResult = parser.parse();

    if (parseResult.errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Syntax errors in C code. Cannot generate optimization report.',
        errors: parseResult.errors
      });
    }

    const ast = parseResult.ast;
    const complexity = analyzeComplexity(ast);
    const originalTac = generateTAC(ast);
    const optimizedAst = optimizeAST(ast);
    const optimizedCode = generateCode(optimizedAst);
    const optimizedTac = generateTAC(optimizedAst);
    const algorithm = generateAlgorithm(ast);
    const flowchart = generateFlowchart(ast);

    const originalLines = code.split('\n').filter(l => l.trim().length > 0).length;
    const optimizedLines = optimizedCode.split('\n').filter(l => l.trim().length > 0).length;
    
    let reductionPercentage = 0;
    if (originalLines > 0) {
      reductionPercentage = Math.max(0, Math.round(((originalLines - optimizedLines) / originalLines) * 100));
    }

    const data = {
      originalCode: code,
      optimizedCode,
      reductionPercentage,
      tokens: tokens.map(t => ({ type: t.type, value: t.value, line: t.line, column: t.column })),
      parseTree: parseResult.parseTree,
      originalTac,
      optimizedTac,
      complexity,
      algorithm,
      flowchart
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=optimization-report.pdf');

    generatePDFReport(data, res);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate PDF report: ' + error.message });
  }
});

// Serve frontend in production (if built)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
