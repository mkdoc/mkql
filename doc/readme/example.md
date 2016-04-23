## Example

```shell
mkcat README.md | mkql 'p, ul, pre[info^=javascript]' | mkout
```

```shell
echo 'Para 1\n\nPara 2\n\n* List item\n\n' | mkcat | mkql '*'| mkout -y
```
