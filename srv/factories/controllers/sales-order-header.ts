import { SalesOrderHeaderController } from '@/controllers/sales-order-header/protocols';
import { SalesOrderHeadersControllerImpl } from '@/controllers/sales-order-header/implementation';
import { salesOrderHeaderService } from '@/factories/services/sales-order-header';

export const makeSalesOrderHeaderController = (): SalesOrderHeaderController => {
    return new SalesOrderHeadersControllerImpl(salesOrderHeaderService);
};

export const salesOrderHeaderController = makeSalesOrderHeaderController();
