import { ethers } from "ethers";

import collections from "../../../collections";
import deploy_LilyERC721 from "./LilyERC721";
import Ducky from "../../../utility/logging/ducky";
import getActiveEnv from "../../env";
import utility from "../../../utility";
import { VALID_CONTRACTS } from "../../../config/constants";

/**
 * Deploy the Lily collection of ERC-721 tokens.
 */
const deploy = async () => {
    utility.printFancy(`Lily - ${getActiveEnv().env}`, true);

    // Get the configuration for the Lily collection and validate it.
    const lilyConfig = utility.getCollectionConfigs().Lily
    if (!lilyConfig) throw new Error(`Failed to find Lily configuration in the config file.`)

    try {
        // Deploy a new EscrowERC721 contract.
        const marketplace: ethers.Contract = await collections.Lily.marketplace.escrow.EscrowERC721.deploy(VALID_CONTRACTS.Lily.Marketplace.EscrowERC721)

        // Deploy a new OffersERC721 contract.
        const offers: ethers.Contract = await collections.Lily.marketplace.offers.OffersERC721.deploy(VALID_CONTRACTS.Lily.Marketplace.OffersERC721)

        // Deploy the Lily ERC-721 token.
        const lily = await deploy_LilyERC721(lilyConfig)
        await collections.Lily.ERC.LilyERC721.setPublicMintEnabled(lily, true)
        await collections.Lily.marketplace.setVendorStatus(marketplace, lily, true, VALID_CONTRACTS.Lily.Marketplace.EscrowERC721)
        await collections.Lily.marketplace.setVendorStatus(offers, lily, true, VALID_CONTRACTS.Lily.Marketplace.OffersERC721)

        // Deploy LilyERC20 and LilyERC20Airdroppable
        const lilyERC20Artifact = utility.artifactFinder("LilyERC20")
        const lilyERC20 = await collections.Lily.ERC.ERC20.LilyERC20.deploy(lilyConfig.ERC.ERC20.LilyERC20.cargs.name, lilyConfig.ERC.ERC20.LilyERC20.cargs.symbol, lilyConfig.ERC.ERC20.LilyERC20.cargs.initial_supply, lilyConfig.ERC.ERC20.LilyERC20.cargs.cap, lilyERC20Artifact)
        const LilyERC20AirdropeArtifact = utility.artifactFinder("LilyERC20Airdrop")
        const LilyERC20Airdrope = await collections.Lily.ERC.ERC20.LilyERC20Airdrop.deploy(lilyConfig.ERC.ERC20.Utils.LilyERC20Airdrop.name, LilyERC20AirdropeArtifact)

        // Log a success message indicating that the deployment completed.
        utility.printFancy(`Lily collection successfully deployed to ${getActiveEnv().env}`, true)
    } catch (error: any) {
        // Log an error message if the deployment fails and re-throw the error.
        Ducky.Error(__filename, "deploy", `Failed to deploy Lily collection: ${error.message}`);
        throw new Error(`Failed to deploy Lily collection: ${error.message}`);
    }
}

export default deploy