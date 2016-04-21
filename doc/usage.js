var ql = require('../index')
  , ast = require('mkast');

ast.src('Paragraph with some *emph*, **strong** and `code`')
  .pipe(ql('p text'))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
