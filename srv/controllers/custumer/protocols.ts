import { Custumers } from '@models/sales';

import { BaseControllerResponse } from '@/controllers/base';

export interface CustumerController {
    afterRead(custumerList: Custumers): BaseControllerResponse;
}
