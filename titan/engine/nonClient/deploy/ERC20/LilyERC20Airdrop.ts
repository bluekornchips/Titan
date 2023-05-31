import { ethers } from "ethers";
import { ICollectionConfigs } from "../../../../interfaces";
import utility from "../../../../utility";
import { VALID_CONTRACTS } from "../../../../config/constants";
import collections from "../../../../collections";
import Ducky from "../../../../utility/logging/ducky/ducky";

const lilyERC20Airdrop = async (): Promise<ethers.Contract> => {
    const configs: ICollectionConfigs = utility.getCollectionConfigs();

    try {
        const args = configs.Lily.ERC.ERC20.Utils.LilyERC20Airdrop;
        const artifact = utility.artifactFinder(VALID_CONTRACTS.Lily.ERC.LilyERC20Airdrop);
        const airdrop: ethers.Contract = await collections.Lily.ERC.ERC20.LilyERC20Airdrop.deploy(args.name, artifact);
        return airdrop;
    } catch (error: any) {
        Ducky.Error(__filename, "LilyERC20Airdrop", `Failed to deploy: ${error.message}`);
        throw new Error(error.message);
    }
}

export default lilyERC20Airdrop;