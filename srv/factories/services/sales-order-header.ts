import { SalesOrderHeader } from "@models/sales";
import { CustumerRepositoryImpl } from "srv/repositories/custumer/implamentation";
import { ProductRepositoryImpl } from "srv/repositories/product/implementation";
import { SalesOrderHeaderServiceImpl } from "srv/services/sales-order-header/implementation";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const custumerRpository = new CustumerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(custumerRpository, productRepository);
}

export const salesOrderHeaderService = makeSalesOrderHeaderService();