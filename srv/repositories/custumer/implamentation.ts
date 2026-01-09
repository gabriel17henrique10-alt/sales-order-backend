import cds from '@sap/cds';

import { CustumerRepository } from '@/repositories/custumer/protocols';
import { CustumerModel, CustumerProps } from '@/models/custumer';

export class CustumerRepositoryImpl implements CustumerRepository {
    public async findById(id: CustumerProps['id']): Promise<CustumerModel | null> {
        const custumerQuery = SELECT.one.from('sales.Custumers').where({ id });
        const dbcustumer = await cds.run(custumerQuery);
        if (!dbcustumer) {
            return null;
        }
        return CustumerModel.with({
            id: dbcustumer.id as string,
            fisrtName: dbcustumer.firstName as string,
            lastName: dbcustumer.lastName as string,
            email: dbcustumer.email as string
        });
    }
}
