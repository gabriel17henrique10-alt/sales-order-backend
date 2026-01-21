import { Custumers } from '@models/sales';

import { CustumerController } from '@/controllers/custumer/protocols';
import { CustumerService } from '@/services/custumer/protocols';
import { BaseControllerImpl, BaseControllerResponse } from '@/controllers/base';

export class CustumerControllerImpl extends BaseControllerImpl implements CustumerController {
    constructor(private readonly service: CustumerService) {
        super();
    }

    public afterRead(custumerList: Custumers): BaseControllerResponse {
        const result = this.service.afterRead(custumerList);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.success(result.value);
    }
}
