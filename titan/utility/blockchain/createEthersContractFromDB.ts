import { ethers } from "ethers";

import getProvider from "./getProvider";
import Ducky from "../logging/ducky";
import { contracts_db } from "../../types";

const createEthersContractFromDB = async (contract: contracts_db, wallet: any = undefined): Promise<ethers.Contract> => {
    let artifact: any = JSON.parse(contract.artifact)

    try {
        if (wallet === undefined) return new ethers.Contract(contract.address, artifact.abi, getProvider())
        else return new ethers.Contract(contract.address, artifact.abi, wallet)
    }
    catch {
        Ducky.Error(__filename, `createEthersContractFromDB`, `Error creating ${contract.name} contract instance.`)
        throw new Error(`Error creating ${contract.name} contract instance.`)
    }
}

export default createEthersContractFromDB;