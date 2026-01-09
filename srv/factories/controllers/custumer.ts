import { CustumerController } from '@/controllers/custumer/protocols';
import { CustumerControllerImpl } from '@/controllers/custumer/implementation';
import { custumerService } from '@/factories/services/custumer';

const makeCustumerController = (): CustumerController => {
    return new CustumerControllerImpl(custumerService);
};

export const custumerController = makeCustumerController();
