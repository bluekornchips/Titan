import { ethers } from "ethers"

import pgsql from "forge/pgsql";
import createWalletWithPrivateKey from "forge/utility/blockchain/createWalletWithPrivateKey";
import Ducky from "forge/utility/logging/ducky";
import getActiveEnv from "forge/engine/env";
import { contract_type_db } from "forge/types";
import { EOAS } from "forge/config/constants";

/**
 * Deploys a new instance of a contract with the specified parameters to the blockchain and adds it to a PostgreSQL database.
 * @param name The name of the contract.
 * @param symbol The symbol of the contract.
 * @param max_supply The maximum supply of the contract.
 * @param uri The URI of the contract.
 * @param artifact The artifact associated with the contract.
 * @returns The deployed contract instance.
 * @throws If the contract deployment or addition to PostgreSQL fails.
 */
const deploy = async (name: string, symbol: string, max_supply: number, uri: string, artifact: any): Promise<ethers.Contract> => {
    Ducky.Debug(__filename, "deploy", `Deploying LilyERC721: ${name} to ${getActiveEnv().rpc.name}`);
    const deployedContract = await deployToBlockchain(name, symbol, max_supply, uri, artifact);
    await addToPostgres(name, deployedContract, artifact); // Add the deployed contract and its artifact to PostgreSQL.
    return deployedContract;
};

const deployToBlockchain = async (contractName: string, contractSymbol: string, maxSupply: number, metadataURI: string, artifact: any): Promise<ethers.Contract> => {
    try {
        const contractFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, createWalletWithPrivateKey(EOAS.DEPLOYMENT.KEY))
        const deployedContract = await contractFactory.deploy(contractName, contractSymbol, maxSupply, metadataURI)
        await deployedContract.waitForDeployment(); // Wait for the contract deployment to complete.

        Ducky.Debug(__filename, "deployToBlockchain", `${contractName} deployed to ${await deployedContract.getAddress()}`);

        return deployedContract as ethers.Contract; // Return the deployed contract instance.
    } catch (error: any) {
        Ducky.Error(__filename, "deployToBlockchain", error.message)
        throw error;
    }
}


const addToPostgres = async (name: string, contract: ethers.Contract, artifact: any) => {
    try {
        const upsertResult = await pgsql.contracts.upsert(name, contract, contract_type_db.ERC721, artifact);
        if (!upsertResult) {
            const message = `Could not add ${name} to PostgreSQL.`;
            Ducky.Error(__filename, "addToPostgres", message);
            throw new Error(message);
        }
    } catch (error: any) {
        const message = `Could not add ${name} to PostgreSQL: ${error.message}`;
        Ducky.Error(__filename, "addToPostgres", message);
        throw error;
    }
}


export default deploy;