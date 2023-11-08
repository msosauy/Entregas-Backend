export const generateUniqueTicketCode = () => {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 10000);
    return `TICKET-${timestamp}-${randomPart}`;
};

export const generateTicket = () => {
    
};