import {cartModel} from "./models/cartModel.js";

export default class DbCartManager {
    getProductsFromCartId = async (cid) => {
        try {
            const result = await cartModel.findOne({id: cid});
            return result
        } catch (error) {
            console.log(error);
        }
    }
}