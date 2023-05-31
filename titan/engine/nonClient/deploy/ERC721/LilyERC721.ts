import { ethers } from "ethers";
import { ICollectionConfigs } from "../../../../interfaces";
import utility from "../../../../utility";
import { VALID_CONTRACTS } from "../../../../config/constants";
import collections from "../../../../collections";
import Ducky from "../../../../utility/logging/ducky/ducky";

const lilyERC721 = async (): Promise<ethers.Contract> => {
    const configs: ICollectionConfigs = utility.getCollectionConfigs();
    const args = configs.Lily.ERC.ERC721.LilyERC721.cargs;
    const artifact = utility.artifactFinder(VALID_CONTRACTS.Lily.ERC.LilyERC721Airdroppable);

    Ducky.Debug(__filename, "LilyERC721", `Using ${VALID_CONTRACTS.Lily.ERC.LilyERC721Airdroppable} artifact for LilyERC721 deployment.`);

    try {
        const erc721: ethers.Contract = await collections.Lily.ERC.LilyERC721.deploy(args.name, args.symbol, args.max_supply, args.uri, artifact);
        return erc721;
    } catch (error: any) {
        Ducky.Error(__filename, "LilyERC721", `Failed to deploy LilyERC721: ${error.message}`);
        throw new Error(error.message);
    }
}

export default lilyERC721;