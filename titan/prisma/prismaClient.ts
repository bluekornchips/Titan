import Ducky from '../utility/logging/ducky/ducky';
import getActiveEnv from '../engine/env';
import { VALID_CLIENTS } from '../config/constants';
import { PrismaClient } from '@prisma/client';

let activeClient: PrismaClient;

/**
 * Defines a Prisma client for a given database and environment and exports it.
 * @param db The name of the database to connect to.
 * @returns The Prisma client object for the specified database and environment.
 */
const setPrismaClient = (db: string) => {
    const envVarName = `DATABASE_URL`; //TODO: This is a hacky way to do this. Find a better way.
    if (!process.env[envVarName]) {
        Ducky.Critical(__filename, `setPrismaClient`, `No database URL found for ${db}`);
        throw new Error(`No database URL found for ${db}`);
    } else if (db === VALID_CLIENTS.sunflower) {
        activeClient = new PrismaClient({
            datasources: {
                db: {
                    url: getActiveEnv().database_url,
                },
            },
        });
        Ducky.Debug(__filename, `setPrismaClient`, `Set active Prisma client to ${db}`);
    }
    else {
        Ducky.Error(__filename, `setPrismaClient`, `Invalid database name: ${db}`);
    }

};

export { activeClient, setPrismaClient };