import { SalesOrderHeaderController } from 'srv/controllers/sales-order-header/protocols';
import { SalesOrderHeadersControllerImpl } from 'srv/controllers/sales-order-header/implementation';
import { salesOrderHeaderService } from '../services/sales-order-header';

export const makeSalesOrderHeaderController = (): SalesOrderHeaderController => {
    return new SalesOrderHeadersControllerImpl(salesOrderHeaderService);
};

export const salesOrderHeaderController = makeSalesOrderHeaderController();
