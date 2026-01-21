import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/errors';
import { Custumers } from '@models/sales';

export interface CustumerService {
    afterRead(custumerList: Custumers): Either<AbstractError, Custumers>;
}
