# Titanforge
Titanforge is a two part project. One part Solidity development kit, one part nodejs deployment.

## Titan
Located in the titan/ directory, Titan is the nodejs application used for deployment and interaction with the given blockchain and environment.

### ts-node
If you are using ts-node, you can use the following configuration to enable tsconfig-paths:

"ts-node": {
   "require": ["tsconfig-paths/register"]
},

And add to your package.json with
`npm i -D tsconfig-paths`

## Forge
Located in the forge/ directory, Forge is the Solidity development kit used for creating and testing smart contracts.

