import { Custumers } from '@models/sales';

export interface CustumerController {
    afterRead(custumerList: Custumers): Custumers;
}
