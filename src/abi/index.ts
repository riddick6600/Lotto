import Ticket from "@contracts/artifacts/Ticket_metadata.json";

import LotteryMachineMetadata from "@contracts/artifacts/LotteryMachine_metadata.json";
import LotteryMachine from "@contracts/artifacts/LotteryMachine.json";

import CasinoMetadata from "@contracts/artifacts/Casino_metadata.json";
import Casino from "@contracts/artifacts/Casino.json";

export const ticketAbi = Ticket.output.abi;

export const lotteryMachineAbi = LotteryMachineMetadata.output.abi;
export const lotteryMachineBytecode = LotteryMachine.data.bytecode;

export const casinoAbi = CasinoMetadata.output.abi;
export const casinoBytecode = Casino.data.bytecode;
