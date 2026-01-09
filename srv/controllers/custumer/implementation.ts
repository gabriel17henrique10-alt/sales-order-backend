import { CustumerController } from './protocols';
import { CustumerService } from '../../services/custumer/protocols';
import { Custumers } from '@models/sales';

export class CustumerControllerImpl implements CustumerController {
    constructor(private readonly service: CustumerService) {}

    public afterRead(custumerList: Custumers): Custumers {
        return this.service.afterRead(custumerList);
    }
}
    
