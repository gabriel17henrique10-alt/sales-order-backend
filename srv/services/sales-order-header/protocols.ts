import { User } from '@sap/cds';

import { Payload as BulkCreateSalesOrdersPayload } from '@models/db/types/BulkCreateSalesOrder';
import { CustomerModel } from '@/models/customer';
import { ProductModel } from '@/models/products';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

export type CreationPayLoadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    products?: ProductModel[];
    customer?: CustomerModel;
    error?: Error;
    headers?: BulkCreateSalesOrdersPayload[];
};

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>;
    bulkCreate(headers: BulkCreateSalesOrdersPayload[], loggedUser: User): Promise<CreationPayLoadValidationResult>;
    cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayLoadValidationResult>;
}
