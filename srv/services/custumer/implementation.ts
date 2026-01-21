import { Either, left, right } from '@sweet-monads/either';

import { Custumers } from '@models/sales';

import { CustumerModel } from '@/models/custumer';
import { CustumerService } from '@/services/custumer/protocols';
import { AbstractError, ServerError } from '@/errors';

export class CustumerServiceImpl implements CustumerService {
    public afterRead(custumerList: Custumers): Either<AbstractError, Custumers> {
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
            return right(custumers);
        } catch (error) {
            const errorInstance: Error = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }
}
