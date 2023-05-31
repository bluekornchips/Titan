import pgsql from "../../pgsql";
import utility from "../../utility";
import { EOAS } from "../../config/constants";
import { ContractContainer, contracts_db } from "../../types";

/**
 * Retrieves contract instances from the database and returns a ContractContainer object
 * @param contracts A ContractContainer object to store the retrieved contract instances
 * @param names     An optional param that specifies which contracts to retrieve.
 * @returns         a ContractContainer object containing the retrieved contract instances
 */
const getContractsFromDb = async (contracts: ContractContainer, names: string[] = []): Promise<ContractContainer> => {
    const contracts_db: contracts_db[] = await pgsql.contracts.get_all();
    if (names.length == 0 || names == undefined) {
        for (const contract_db of contracts_db) {
            if (!contracts[contract_db.name]) {
                const privateKey = EOAS.DEPLOYMENT;
                const wallet = utility.blockchain.createWalletWithPrivateKey(EOAS.DEPLOYMENT.KEY);
                const contract = await utility.blockchain.createEthersContractFromDB(contract_db, wallet);

                contracts[contract_db.name] = contract;
            }
        }
    } else {
        const wanted_contracts: contracts_db[] = contracts_db.filter((contract_db: contracts_db) => names.includes(contract_db.name))
        for (const db_contract of wanted_contracts) {
            if (!contracts[db_contract.name]) {
                const privateKey = EOAS.DEPLOYMENT;
                const wallet = utility.blockchain.createWalletWithPrivateKey(EOAS.DEPLOYMENT.KEY);
                const contract = await utility.blockchain.createEthersContractFromDB(db_contract, wallet);
                contracts[db_contract.name] = contract;
            }
        }
    }
    return contracts;
}

export default getContractsFromDb
