import Ticket from "../../contracts/artifacts/Ticket_metadata.json";
import LotteryMachine from "../../contracts/artifacts/LotteryMachine_metadata.json";
import Storage from "../../contracts/artifacts/Storage_metadata.json";

export const ticketAbi = Ticket.output.abi;
export const lotteryMachineAbi = LotteryMachine.output.abi;
export const storageAbi = Storage.output.abi;
