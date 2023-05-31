import { ethers } from "ethers"
import { RPC } from "../../config/constants"

/**
 * @dev Returns a configured ethers JSON-RPC provider instance
 * @return The configured provider instance
 * @throws If the RPC URL is not set
 */
const getProvider = () => {
    //TODO: Currently only supports Garden RPC
    if (RPC.GARDEN === "" || RPC.GARDEN === undefined)
        throw new Error("RPC URL not set")
    return new ethers.JsonRpcProvider(RPC.GARDEN)
}

export default getProvider