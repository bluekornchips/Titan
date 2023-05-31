import { ethers } from "ethers"

import collections from "../../../collections"
import Ducky from "../../../utility/logging/ducky"
import { ILilyConfig } from "../../../interfaces/Lily"
import artifact_finder from "../../../utility/artifactFinder"
import { VALID_CONTRACTS } from "../../../config/constants"

/**
 * Deploy the Lily  ERC-721 token based on the configuration in the provided ILilyConfig object.
 *
 * @param config The ILilyConfig object containing the configuration for the Lily  ERC-721 token.
 * @returns A contract object representing the deployed Lily  ERC-721 token.
 */
const deploy_LilyERC721 = async (config: ILilyConfig): Promise<ethers.Contract> => {
    // Get the configuration for the Lily  ERC-721 token.
    const LilyConfig = config.ERC.ERC721.LilyERC721

    // Create an object with the arguments needed to deploy the ERC-721 token.
    const { name, symbol, max_supply, uri } = LilyConfig.cargs

    try {
        const artifact = artifact_finder(VALID_CONTRACTS.Lily.ERC.LilyERC721Airdroppable);

        // Deploy the Lily  ERC-721 token and return the contract object.
        const lilyERC721 = await collections.Lily.ERC.LilyERC721.deploy(name, symbol, max_supply, uri, artifact)
        return lilyERC721
    } catch (error: any) {
        // Log an error message if the deployment fails and re-throw the error.
        Ducky.Error(__filename, "", `Failed to deploy ${name}: ${error.message}`);
        throw new Error(`Failed to deploy ${name}: ${error.message}`);
    }
}

export default deploy_LilyERC721