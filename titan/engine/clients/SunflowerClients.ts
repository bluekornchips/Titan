import { VALID_CLIENTS } from "forge/config/constants";
import utility from "forge/utility";
import Sunflower from "./Sunflower";

const main = async (input_args: string) => {
    utility.printFancy("Client Functions", true, 1)
    //Allow user to read the console
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    switch (input_args) {
        case VALID_CLIENTS.sunflower:
            await Sunflower.deploy();
            break;

        default:
            break;
    }
}

export default main;