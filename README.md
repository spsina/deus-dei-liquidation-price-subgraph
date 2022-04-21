# DEI DEUS LENDING SUBGRAPH

tracks lending data in DEUS/DEI LP lending pool

## what it does

- [x] create position for a user after initial collateral deposit

- update user position after
  - [x] swap
  - [x] add more collateral
  - [x] remove collateral
  - [x] borrow
  - [x] repay

## Quick start

install graphe-cli first

```shell
$ yarn global add @graphprotocol/graph-cli
```

It's recommended to use yarn

```shell
$ yarn install
```

```shell
$ yarn codegen
```

```shell
$ yarn build
```

to deploy the subgraph

```shell
$ graph auth --product hosted-service <ACCESS_TOKEN>
$ graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH NAME>
```

## Entities

### UserPosition

```js
```
