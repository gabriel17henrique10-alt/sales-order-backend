/* eslint-disable max-lines-per-function */
import '../configs/module-alias';

import { Request, Service } from '@sap/cds';

import { Customers, SalesOrderHeaders } from '@models/sales';

import { FullRequestParams } from '@/routes/protocols';
import { customerController } from '@/factories/controllers/customer';
import { salesOrderHeaderController } from '@/factories/controllers/sales-order-header';
import { salesReportController } from '@/factories/controllers/sales-report';

export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        if (!request.user.is('read_only_user')) {
            return request.reject(403, 'Não identificado');
        }
    });
    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
            return request.reject(403, 'Forbidden');
        }
    });
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const result = await salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasError) {
            return request.reject(400, result.error?.message as string);
        }
        request.data.totalAmount = result.totalAmount;
    });
    service.after('READ', 'customers', (customerList: Customers, request) => {
        const result = customerController.afterRead(customerList);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        (request as unknown as FullRequestParams<Customers>).results = result.data as Customers;
    });
    service.after('CREATE', 'SalesOrderHeaders', async (salesOrderHeaders: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(salesOrderHeaders, request.user);
    });
    service.on('getSalesReportByDays', async (request: Request) => {
        const days = request.data?.days || 7;
        const result = await salesReportController.findByDays(days);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        return result.data;
    });
    service.on('getSalesReportByCutomerId', async (request: Request) => {
        const [{ id: customerId }] = request.params as unknown as { id: string }[];
        const result = await salesReportController.findByCustomerId(customerId);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        return result.data;
    });
    service.on('bulkCreateSalesOrder', async (request: Request) => {
        const { user, data } = request;
        return salesOrderHeaderController.bulkCreate(data.payload, user);
    });
    service.on('cloneSalesOrder', async (request: Request) => {
        const [{ id }] = request.params as unknown as { id: string }[];
        const { user } = request;
        return salesOrderHeaderController.cloneSalesOrder(id, user);
    });
};
