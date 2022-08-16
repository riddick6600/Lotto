import Ticket from "../../contracts/artifacts/Ticket_metadata.json";

import LotteryMachineMetadata from "../../contracts/artifacts/LotteryMachine_metadata.json";
import LotteryMachine from "../../contracts/artifacts/LotteryMachine.json";

import StorageMetadata from "../../contracts/artifacts/Storage_metadata.json";
import Storage from "../../contracts/artifacts/Storage.json";

export const ticketAbi = Ticket.output.abi;

export const lotteryMachineAbi = LotteryMachineMetadata.output.abi;
export const lotteryMachineBytecode = LotteryMachine.data.bytecode;

export const storageAbi = StorageMetadata.output.abi;
export const storageBytecode = Storage.data.bytecode;
