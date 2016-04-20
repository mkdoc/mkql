var highlight = require('../index')
  , ast = require('mkast')
  , tfm = require('mktransform');

ast.src('```javascript\nvar foo = "bar"\n```')
  .pipe(tfm(highlight))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
