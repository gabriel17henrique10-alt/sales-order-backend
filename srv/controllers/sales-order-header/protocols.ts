import { User } from '@sap/cds';

import { Payload as BulkCreateSalesOrdersPayload } from '@models/db/types/BulkCreateSalesOrder';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

export type CreationPayLoadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
};

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>;
    bulkCreate(headers: BulkCreateSalesOrdersPayload[], loggedUser: User): Promise<CreationPayLoadValidationResult>;
}
