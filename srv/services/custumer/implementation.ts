import { Custumers } from '@models/sales';

import { CustumerModel } from '@/models/custumer';
import { CustumerService } from '@/services/custumer/protocols';
import { left } from '@sweet-monads/either';
import { ServerError } from '@/errors/server-error';

export class CustumerServiceImpl implements CustumerService {
    public afterRead(custumerList: Custumers): Custumers {
        try {
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
        } catch (error) {
            const errorInstance: Error = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }
}
