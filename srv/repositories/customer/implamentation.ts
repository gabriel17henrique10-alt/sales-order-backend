import cds from '@sap/cds';

import { CustomerRepository } from '@/repositories/customer/protocols';
import { CustomerModel, CustomerProps } from '@/models/customer';

export class CustomerRepositoryImpl implements CustomerRepository {
    public async findById(id: CustomerProps['id']): Promise<CustomerModel | null> {
        const customerQuery = SELECT.one.from('sales.Customers').where({ id });
        const dbcustomer = await cds.run(customerQuery);
        if (!dbcustomer) {
            return null;
        }
        return CustomerModel.with({
            id: dbcustomer.id as string,
            fisrtName: dbcustomer.firstName as string,
            lastName: dbcustomer.lastName as string,
            email: dbcustomer.email as string
        });
    }
}
