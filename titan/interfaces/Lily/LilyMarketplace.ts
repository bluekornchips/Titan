export interface IOffersERC721Config extends ILilyMarketplaceERC721EscrowConfig { }
export interface IEscrowERC721Config extends ILilyMarketplaceERC721EscrowConfig { }

export interface ILilyMarketplaceERC721EscrowConfig {
    name: string;
}

export interface ILilyMarketplaceConfig {
    Escrow: IEscrowERC721Config;
    Offers: IOffersERC721Config
}