import { CustumerService } from '../../services/custumer/protocols';
import { CustumerServiceImpl } from '../../services/custumer/implementation';

const makeCustumerService = (): CustumerService => {
    return new CustumerServiceImpl();
};

export const custumerService = makeCustumerService();
