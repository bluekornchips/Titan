import { DATABASE_URL, RPC, VALID_CLIENTS } from "forge/config/constants";

export interface IActiveEnv {
    env: string
    client: string
    database_url: string,
    rpc: {
        name: string
        url: string
    }
}

let activeEnv: IActiveEnv;

const getActiveEnv = (): IActiveEnv => {
    return activeEnv
}

export const setActiveEnv = (client: string, env: string) => {
    switch (client) {
        case VALID_CLIENTS.sunflower: sunflower(env)
            break;
        default: throw new Error("Invalid client")

    }
}

const sunflower = (env: string) => {
    activeEnv = {
        client: "Sunflower",
        env,
        database_url: "",
        rpc: {
            name: "Garden",
            url: ""
        }
    }
    switch (env.toLocaleLowerCase()) {
        case "dev":
            activeEnv.database_url = DATABASE_URL.GARDEN.DEV
            activeEnv.rpc.url = RPC.GARDEN
            break;
        case "qa":
            activeEnv.database_url = DATABASE_URL.GARDEN.QA
            activeEnv.rpc.url = RPC.GARDEN
            break;
        case "uat":
            activeEnv.database_url = DATABASE_URL.GARDEN.UAT
            activeEnv.rpc.url = RPC.GARDEN
            break;
        default:
            throw new Error("Invalid environment")
    }
}

export default getActiveEnv