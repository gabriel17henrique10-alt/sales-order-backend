import { SalesOrderHeader, SalesOrderLog } from "@models/sales";
import { CustumerRepositoryImpl } from "srv/repositories/custumer/implamentation";
import { ProductRepositoryImpl } from "srv/repositories/product/implementation";
import { SalesOrderLogRepositoryImpl } from "srv/repositories/sales-order-log/implementation";
import { SalesOrderHeaderServiceImpl } from "srv/services/sales-order-header/implementation";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const custumerRpository = new CustumerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(custumerRpository, productRepository, salesOrderLogRepository);
}

export const salesOrderHeaderService = makeSalesOrderHeaderService();