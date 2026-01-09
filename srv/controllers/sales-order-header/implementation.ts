import { User } from '@sap/cds';

import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

import { SalesOrderHeaderService } from '@/services/sales-order-header/protocols';
import {
    CreationPayLoadValidationResult,
    SalesOrderHeaderController
} from '@/controllers/sales-order-header/protocols';

export class SalesOrderHeadersControllerImpl implements SalesOrderHeaderController {
    constructor(private readonly service: SalesOrderHeaderService) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult> {
        return this.service.beforeCreate(params);
    }

    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        return this.service.afterCreate(params, loggedUser);
    }
}
