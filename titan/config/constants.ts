require("dotenv").config();

export const PROJECT_NAME = process.env.PROJECT_NAME || ""

// # Forge
export const FORGE_ENVIRONMENTS = process.env.FORGE_ENVIRONMENTS || {
    dev: "dev",
}
export const VALID_CLIENTS = {
    sunflower: process.env.FORGE_CLIENT_SUNFLOWER || ""
}
export const COLLECTION_CONFIG_FILE_NAME = "collection-config.json"

// # Blockchain
export const RPC = {
    GARDEN: process.env.GARDEN_RPC || "",
    MUMBAI: process.env.MUMBAI_RPC || "",
    POLYGON: process.env.POLYGON_RPC || "",
}

// ## Externally Owned Accounts
export const EOAS = {
    DEPLOYMENT: {
        KEY: process.env.DEPLOYMENT_KEY || ""
    }
}

// ## Valid Contracts
export const VALID_CONTRACTS = {
    Lily: {
        ERC: {
            LilyERC721: "LilyERC721",
            LilyERC721Airdroppable: "LilyERC721Airdroppable",
            LilyERC20: "LilyERC20",
            LilyERC20Airdrop: "LilyERC20Airdrop",
        },
        Marketplace: {
            EscrowERC721: "EscrowERC721",
            OffersERC721: "OffersERC721",

        }
    },
}

// # Database
export const DATABASE_READONLY = false;

export const DATABASE_URL = {
    GARDEN: {
        DEV: process.env.DATABASE_URL || "",
        QA: process.env.DATABASE_URL || "",
        UAT: process.env.DATABASE_URL || "",
    },
}
