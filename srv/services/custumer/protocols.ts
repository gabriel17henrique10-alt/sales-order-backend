import { Custumers } from "@models/sales";

export interface CustumerService {
    afterRead(custumerList: Custumers): Custumers;
} 