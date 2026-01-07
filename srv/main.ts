import cds, { db, Request, ResultsHandler, Service, services } from '@sap/cds';
import { Custumers, SalesOrderItems, Products, SalesOrderItem, SalesOrderHeaders, Product, SalesOrderLog } from '@models/sales';
import { custumerController } from './factories/controllers/custumer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { CustumerServiceImpl } from './services/custumer/implementation';
import { FullRequestParams } from './protocols';


export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        // if(!request.user.is('read_only_user')){
        //     return request.reject(403,'Não identificado');
        // };
        console.log(request.user.is("read_only_user"));
        console.log(request.user.roles);
    });
    service.before(['WRITE','DELETE'], '*', (request: Request) => {
        // if(!request.user.is('admin')){
        //     return request.reject(403,'Forbidden');
        // };
    });
    service.after('READ', 'Custumers', (custumerList: Custumers, request) =>{
        (request as unknown as FullRequestParams<Custumers>).results = custumerController.afterRead(custumerList);
    });

    // service.before('CREATE','SalesOrderHeaders', (request: Request) =>{
    //     const result = salesOrderHeaderController.beforeCreate(request.data);
    //     if (!params.custumer_id){
    //         return request.reject(400, `Custumer invalido`)
    //     }
    // });
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
         const result = await salesOrderHeaderController.beforeCreate(request.data);
         if (result.hasError) {
            return request.reject(400, result.error?.message as string)
         }
        request.data.totalAmount = result.totalAmount;
    });
    service.after('CREATE', 'SalesOerderHeaders', async (results: SalesOrderHeaders, request: Request) => {
        const headersAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders;
        for (const header of  headersAsArray){
            const items = header.items as SalesOrderItems;
            const productsData = items.map(item => ({
                id: item.product_id as string,
                quantity: item.quantity as number
            }));
            const productsIds: string[] = productsData.map((productData) => productData.id);
            const productsQuery = SELECT.from('sales.Products').where({id: productsIds});
            const products: Products = await cds.run(productsQuery);
            for (const productData of productsData){
                const foundProduct = products.find(product =>  product.id === productData.id) as Product;
                foundProduct.stock = (foundProduct.stock as number) - productData.quantity;
                await cds.update('sales.Products').where({id: foundProduct.id}).with({stock: foundProduct.stock})
            }
            const headersAsString = JSON.stringify(header);
            const userAsString = JSON.stringify(request.user);
            const log = [{
            header_id: header.id,
            userData: userAsString,
            orderData: headersAsString,
            }];
            await cds.create('sales.SalesOrderLogs').entries(log)
        }
    });
}