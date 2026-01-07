import { SalesOrderHeader } from "@models/sales";
import { SalesOerderHeadersControllerImpl } from "srv/controllers/sales-order-header/implementation";
import { SalesOrderHeaderController } from "srv/controllers/sales-order-header/protocols";
import { salesOrderHeaderService } from "../services/sales-order-header";

export const makeSalesOredrHeaderController = (): SalesOrderHeaderController => {
    return new SalesOerderHeadersControllerImpl(salesOrderHeaderService);
}

export const salesOrderHeaderController = makeSalesOredrHeaderController();