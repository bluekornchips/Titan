import { ethers } from "ethers";

import collections from "../../../../collections";
import nonClient from "../..";
import utility from "../../../../utility";
import { ContractContainer } from "../../../../types";
import { ICollectionConfigs } from "../../../../interfaces";
import { VALID_CONTRACTS } from "../../../../config/constants";
import coordinator from "../../coordinator";

const OffersERC721 = async (): Promise<ethers.Contract> => {
    const configs: ICollectionConfigs = utility.getCollectionConfigs();

    const contractsContainer: ContractContainer = await nonClient.getContractsFromDb({}, [
        VALID_CONTRACTS.Lily.ERC.LilyERC721,
    ]);

    const offersERC721: ethers.Contract = await collections.Lily.marketplace.offers.OffersERC721.deploy(configs.Lily.Marketplace.Offers.name);

    await coordinator.marketplace.setAllowedContracts(offersERC721, contractsContainer, VALID_CONTRACTS.Lily.Marketplace.OffersERC721);

    return offersERC721;
}

export default OffersERC721;