import { SalesOrderHeader } from "@models/sales";
import { CreationPayLoadValidationResult, SalesOrderHeaderController } from "./protocols";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";

export  class SalesOerderHeadersControllerImpl implements SalesOrderHeaderController{
    constructor(private readonly service: SalesOrderHeaderService){}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult> {
        return this.service.beforeCreate(params);
    }
}