import { CustumerController } from "srv/controllers/custumer/protocols";
import { CustumerControllerImpl } from "srv/controllers/custumer/implementation";
import { custumerService } from "../services/custumer";

const makeCustumerController =  (): CustumerController => {
    return new CustumerControllerImpl(custumerService);
}

export const custumerController = makeCustumerController();