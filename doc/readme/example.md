## Example

To highlight code blocks in a document with ANSI escape sequences:

```shell
mkcat README.md | mkhigh -o esc | mkout
```

To highlight code blocks for a standalone HTML page:

```shell
mkcat README.md | mkhigh | mkpage | mkhtml > README.html
```

Number lines in the code blocks:

```shell
mkcat README.md | mkhigh --lines | mkpage | mkhtml > README.html
```

