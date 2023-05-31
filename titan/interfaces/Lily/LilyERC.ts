
//#region ERC20
export interface ILilyERC20ConstructorArgConfig {
    name: string
    symbol: string
    initial_supply: number
    cap: number
}

export interface ILilyERC20Config {
    LilyERC20: {
        cargs: ILilyERC20ConstructorArgConfig
    }
    Utils: {
        LilyERC20Airdrop: ILilyERC20UtilsConfig
    }
}

export interface ILilyERC20UtilsConfig {
    name: string
}

// #endregion ERC20

//#region ERC721
export interface ILilyERC721ConstructorArgConfig {
    name: string;
    symbol: string;
    max_supply: number;
    uri: string;
}

export interface ILilyERC721ContractConfig {
    name: string; // The name of the LilyERC721 contract.
    cargs: ILilyERC721ConstructorArgConfig;
    validForSale: boolean;
    publicMintEnabled: boolean;
    burnEnabled: boolean;
}


export interface ILilyERC721Config {
    LilyERC721: ILilyERC721ContractConfig;
}


export interface ILilyERCConfig {
    ERC721: ILilyERC721Config;
    ERC20: ILilyERC20Config;
}

// #endregion ERC721