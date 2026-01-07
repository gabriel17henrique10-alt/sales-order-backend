import { SalesOrderHeader } from "@models/sales";

export type CreationPayLoadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult>;
}