import { contract_types, contracts, planters } from "@prisma/client";

/**
 * Prisma Wrappers
 * @description Prisma Wrappers for the database tables - intended to support multiple
 * environments (e.g. test, dev, prod) and to allow for easy mocking of the database
 */
export type contracts_db = contracts;
export type planters_db = planters;
export type contract_types_db = contract_types;

export enum contract_type_db {
    Utility = 0,
    ERC20 = 20,
    Marketplace = 101,
    ERC721 = 721,
}