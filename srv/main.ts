import cds, { db, Request, Service } from '@sap/cds';
import { Custumers, SalesOrderItems, Products, SalesOrderItem, SalesOrderHeaders, Product, SalesOrderLog } from '@models/sales';
import { custumerController } from './factories/controllers/custumer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { FullRequestParams } from './protocols';
import { userInfo } from 'node:os';


export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        if(!request.user.is('read_only_user')){
            return request.reject(403,'Não identificado');
        };
    });
    service.before(['WRITE','DELETE'], '*', (request: Request) => {
        if(!request.user.is('admin')){
            return request.reject(403,'Forbidden');
        };
    });
        service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
         const result = await salesOrderHeaderController.beforeCreate(request.data);
         if (result.hasError) {
            return request.reject(400, result.error?.message as string)
         }
        request.data.totalAmount = result.totalAmount;
    });
    service.after('READ', 'Custumers', (custumerList: Custumers, request) =>{
        (request as unknown as FullRequestParams<Custumers>).results = custumerController.afterRead(custumerList);
    });
    service.after('CREATE', 'SalesOrderHeaders', async (salesOrderHeaders: SalesOrderHeaders, request: Request) => {
       await salesOrderHeaderController.afterCreate(salesOrderHeaders, request.user);
    });
}