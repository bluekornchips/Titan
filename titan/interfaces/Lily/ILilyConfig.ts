import { ILilyERC721ContractConfig, ILilyERCConfig } from "./LilyERC";
import { ILilyMarketplaceConfig } from "./LilyMarketplace";

export interface ILilyConfig {
    ERC: ILilyERCConfig;
    Marketplace: ILilyMarketplaceConfig;
    [Symbol.iterator](): IterableIterator<[string, ILilyERC721ContractConfig]>; // Returns an iterable iterator for the ERC property.
}
