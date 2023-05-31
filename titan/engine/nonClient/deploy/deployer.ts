import { ethers } from "ethers";

import Ducky from "../../../utility/logging/ducky";
import utility from "../../../utility";
import { ContractContainer } from "../../../types";
import { VALID_CONTRACTS } from "../../../config/constants";
import marketplace from "./marketplace";
import ERC20 from "./ERC20";
import ERC721 from "./ERC721";

/**
 * Deploys the specified contracts and returns a container object with the deployed contracts.
 *
 * @param contract_names An array of contract names to deploy.
 * @returns A container object with the deployed contracts.
 * @throws An error if the deployment of one of the contracts fails.
 */
const deployer = async (contract_names: string[]): Promise<ContractContainer> => {
    utility.printFancy(`Contract Deployment - ${contract_names.length} Contracts`, true, 1)

    const contracts: ContractContainer = {}
    for (const contract_name of contract_names) {
        try {
            console.log()
            Ducky.Debug(__filename, "deploy", `Deploying ${contract_name}...`);
            const contract = await deploy_contract(contract_name);
            contracts[contract_name] = contract;
            Ducky.Debug(__filename, "deploy", `${contract_name} deployed at ${await contract.getAddress()}`);
        } catch (error: any) {
            Ducky.Error(__filename, "deploy", `Failed to deploy ${contract_name}: ${error.message}`);
            throw new Error(error.message);
        }
    }

    return contracts;
}

/**
 * Deploys the specified contract.
 * @param contract_name - The name of the contract to deploy.
 * @returns The deployed contract.
 */
const deploy_contract = async (contract_name: string): Promise<ethers.Contract> => {
    try {
        switch (contract_name) {
            /**
             * Marketplace
             */
            // Escrow
            case VALID_CONTRACTS.Lily.Marketplace.EscrowERC721:
                const escrowERC721: ethers.Contract = await marketplace.EscrowERC721();
                return escrowERC721;
            // Offers
            case VALID_CONTRACTS.Lily.Marketplace.OffersERC721:
                const offersERC721: ethers.Contract = await marketplace.OffersERC721();
                return offersERC721;

            /**
             * ERC20
             */
            case VALID_CONTRACTS.Lily.ERC.LilyERC20:
                const erc20: ethers.Contract = await ERC20.lilyERC20();
                return erc20;

            case VALID_CONTRACTS.Lily.ERC.LilyERC20Airdrop:
                const erc20Airdrop: ethers.Contract = await ERC20.lilyERC20Airdrop();
                return erc20Airdrop;

            /**
             * ERC721
            */
            case VALID_CONTRACTS.Lily.ERC.LilyERC721:
                const erc721: ethers.Contract = await ERC721.lilyERC721();
                return erc721;
            case VALID_CONTRACTS.Lily.ERC.LilyERC721Airdroppable:
                const erc721Airdrop: ethers.Contract = await ERC721.lilyERC721();
                return erc721Airdrop;

            default:
                const message = `Contract ${contract_name} not found`;
                Ducky.Error(__filename, "deploy_contract", message);
                throw new Error(message);
        }
    } catch (error: any) {
        Ducky.Error(__filename, "deploy_contract", `Failed to deploy ${contract_name}: ${error.message}`);
        throw new Error(error.message);
    }
}


export default deployer;