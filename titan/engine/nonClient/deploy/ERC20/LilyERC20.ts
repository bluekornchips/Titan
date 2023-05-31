import { ethers } from "ethers";
import { ICollectionConfigs } from "../../../../interfaces";
import utility from "../../../../utility";
import { VALID_CONTRACTS } from "../../../../config/constants";
import collections from "../../../../collections";
import Ducky from "../../../../utility/logging/ducky/ducky";

const lilyERC20 = async (): Promise<ethers.Contract> => {
    const configs: ICollectionConfigs = utility.getCollectionConfigs();
    try {
        const args = configs.Lily.ERC.ERC20.LilyERC20.cargs;
        const artifact = utility.artifactFinder(VALID_CONTRACTS.Lily.ERC.LilyERC20);
        const erc20: ethers.Contract = await collections.Lily.ERC.ERC20.LilyERC20.deploy(args.name, args.symbol, args.initial_supply, args.cap, artifact);
        return erc20;
    } catch (error: any) {
        Ducky.Error(__filename, "LilyERC20", `Failed to deploy LilyERC20: ${error.message}`);
        throw new Error(error.message);
    }
}

export default lilyERC20;