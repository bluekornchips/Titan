import { ethers } from "ethers";

import Ducky from "../../utility/logging/ducky";
import { activeClient } from "../../prisma/prismaClient";
import { contracts_db } from "../../types";

/**
 * Upserts a contract to the PostgreSQL database.
 * @param contract_name The name of the contract.
 * @param contract      The ethers.js contract instance.
 * @param artifact      The contract artifact.
 * @returns             A Promise that resolves to the upserted contract.
*/
const upsert = async (contract_name: string, contract: ethers.Contract, contract_type: number, artifact: any): Promise<contracts_db> => {
    const contract_address = await contract.getAddress();
    try {
        const contract_response: contracts_db = await activeClient.contracts.upsert({
            create: {
                name: contract_name,
                address: contract_address,
                artifact: JSON.stringify(artifact),
                created_at: new Date(),
                contract_type: contract_type
            },
            where: {
                name: contract_name
            },
            update: {
                name: contract_name,
                address: contract_address,
                artifact: JSON.stringify(artifact),
            },
        });
        Ducky.Debug(__filename, "upsert", `Upserted ${contract_name} to PostgreSQL`);
        return contract_response;
    } catch (error: any) {
        Ducky.Error(__filename, "upsert", error.message);
        throw new Error(error.message);
    }
}

export default upsert;