import yargs from 'yargs';

import Ducky from 'forge/utility/logging/ducky/ducky';
import nonClient from './nonClient';
import utility from 'forge/utility';
import sunflowerClients from './clients';
import { COLLECTION_CONFIG_FILE_NAME, VALID_CLIENTS, VALID_CONTRACTS, FORGE_ENVIRONMENTS } from 'forge/config/constants';
import { setActiveEnv } from './env';
import { setPrismaClient } from 'forge/prisma/prismaClient';

const argv = yargs.options({
    deploy: {
        alias: 'd',
        description: 'The contracts to be deployed',
        type: 'array',
        demandOption: false,
        choices: utility.getKeys(VALID_CONTRACTS),
        coerce: (arr) => {
            return arr.filter((item: any) => typeof item === 'string');
        },
    },
    coordinate: {
        alias: 'o',
        description: 'The setup to be run',
        type: 'array',
        demandOption: false,
        choices: utility.getKeys(VALID_CONTRACTS),
        coerce: (arr) => {
            return arr.filter((item: any) => typeof item === 'string');
        },
    },
    client: {
        alias: 'c',
        description: 'The clients packages to be built',
        type: 'string',
        demandOption: false,
        requiresArg: true,
        conflicts: ['coordinator'],
        choices: Object.keys(VALID_CLIENTS)
    },
    client_env: {
        alias: 'e',
        description: 'The clients environment to be used',
        type: 'string',
        demandOption: true,
        requiresArg: true,
        conflicts: ['coordinator'],
        choices: Object.keys(FORGE_ENVIRONMENTS),
        when: 'client'
    },
}).config('config', COLLECTION_CONFIG_FILE_NAME)
    .argv;


const main = async () => {
    const input_args = await argv
    if (input_args.client !== undefined) {
        setActiveEnv(input_args.client, input_args.client_env)
        setPrismaClient(input_args.client)
        if (input_args.deploy !== undefined) {
            await nonClient.main(input_args)
        } else {
            await sunflowerClients(input_args.client)
        }
    } else {
        Ducky.Info("No client specified.")
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
