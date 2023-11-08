import { ticketModel } from "../models/ticketModel.js";

export default class DbTicketManager {
  generateTicket = async (ticketData) => {
    const createOrder = await ticketModel.create(ticketData);
    return createOrder;
  };
}
