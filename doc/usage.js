var ql = require('../index')
  , ast = require('mkast');

ast.src('Paragraph\n\n* 1\n* 2\n* 3\n\n```javascript\nvar foo;\n```')
  .pipe(ql('p, ul, pre[info^=javascript]'))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
