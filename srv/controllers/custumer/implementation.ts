import { Custumers } from '@models/sales';

import { CustumerController } from '@/controllers/custumer/protocols';
import { CustumerService } from '@/services/custumer/protocols';

export class CustumerControllerImpl implements CustumerController {
    constructor(private readonly service: CustumerService) {}

    public afterRead(custumerList: Custumers): Custumers {
        return this.service.afterRead(custumerList);
    }
}
