// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";

contract Forks is Test {
    // Main Nets
    uint256 public mainnetFork;
    uint256 public polygonFork;

    // Test Nets
    uint256 public gardenFork;
    uint256 public sepoliaFork;
    uint256 public mumbaiFork;

    constructor() {
        // Main Nets
        mainnetFork = vm.createFork(vm.envString("MAINNET_RPC"));
        polygonFork = vm.createFork(vm.envString("POLYGON_RPC"));

        // Test Nets
        gardenFork = vm.createFork(vm.envString("GARDEN_RPC"));
        sepoliaFork = vm.createFork(vm.envString("SEPOLIA_RPC"));
        mumbaiFork = vm.createFork(vm.envString("MUMBAI_RPC"));
    }
}
