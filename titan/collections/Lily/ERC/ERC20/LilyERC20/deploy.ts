import { ethers } from "ethers"

import pgsql from "forge/pgsql";
import createWalletWithPrivateKey from "forge/utility/blockchain/createWalletWithPrivateKey";
import Ducky from "forge/utility/logging/ducky";
import getActiveEnv from "forge/engine/env";
import { contract_type_db } from "forge/types";
import { EOAS } from "forge/config/constants";

const deploy = async (name: string, symbol: string, initial_supply: number, cap: number, artifact: any): Promise<ethers.Contract> => {
    Ducky.Debug(__filename, "deploy", `Deploying LilyERC20: ${name} to ${getActiveEnv().rpc.name}`);
    const deployedContract = await deployToBlockchain(name, symbol, initial_supply, cap, artifact);
    await addToPostgres(name, deployedContract, artifact); // Add the deployed contract and its artifact to PostgreSQL.
    return deployedContract;
};

const deployToBlockchain = async (contractName: string, contractSymbol: string, initial_supply: number, cap: number, artifact: any): Promise<ethers.Contract> => {
    try {
        const contractFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, createWalletWithPrivateKey(EOAS.DEPLOYMENT.KEY))
        const deployedContract = await contractFactory.deploy(contractName, contractSymbol, initial_supply, cap)
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
        const upsertResult = await pgsql.contracts.upsert(name, contract, contract_type_db.ERC20, artifact);
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