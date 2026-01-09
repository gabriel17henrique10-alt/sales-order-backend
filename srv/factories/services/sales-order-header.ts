import { CustumerRepositoryImpl } from '@/repositories/custumer/implamentation';
import { ProductRepositoryImpl } from '@/repositories/product/implementation';
import { SalesOrderHeaderService } from '@/services/sales-order-header/protocols';
import { SalesOrderHeaderServiceImpl } from '@/services/sales-order-header/implementation';
import { SalesOrderLogRepositoryImpl } from '@/repositories/sales-order-log/implementation';

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const custumerRpository = new CustumerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(custumerRpository, productRepository, salesOrderLogRepository);
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
