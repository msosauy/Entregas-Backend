import { messageModel } from "./models/messageModel.js";

export default class DbMessageManager {

    getMessages = async () => {
        try {
        const messages = await messageModel.find();
         return messages;   
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    addMessage = async (message) => {
        try {
            const result = await messageModel.insertMany(message);
            return result
        } catch (error) {
            console.log(error);
        }
    }
}