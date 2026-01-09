import { CustumerModel } from 'srv/models/custumer';
import { CustumerService } from './protocols';
import { Custumers } from '@models/sales';

export class CustumerServiceImpl implements CustumerService {
    public afterRead(custumerList: Custumers): Custumers {
        const custumers = custumerList.map((c) => {
            const custumer = CustumerModel.with({
                id: c.id as string,
                fisrtName: c.firstName as string,
                lastName: c.lastName as string,
                email: c.email as string
            });
            return custumer.setDefaultEmailDomain().toObject();
        });
        return custumers;
    }
}
