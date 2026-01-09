import { CustumerRepositoryImpl } from 'srv/repositories/custumer/implamentation';
import { ProductRepositoryImpl } from 'srv/repositories/product/implementation';
import { SalesOrderHeaderService } from 'srv/services/sales-order-header/protocols';
import { SalesOrderHeaderServiceImpl } from 'srv/services/sales-order-header/implementation';
import { SalesOrderLogRepositoryImpl } from 'srv/repositories/sales-order-log/implementation';

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const custumerRpository = new CustumerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(custumerRpository, productRepository, salesOrderLogRepository);
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
