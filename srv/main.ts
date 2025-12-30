import cds, { db, Request, ResultsHandler, Service, services } from '@sap/cds';
import { Custumers, SalesOrderItems, Products, SalesOrderItem, SalesOrderHeaders, Product } from '@models/sales';


export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        if(!request.user.is('read_only_user')){
            return request.reject(403,'Forbidden');
        };
    });
    service.before(['WRITE','DELETE'], '*', (request: Request) => {
        if(!request.user.is('admin')){
            return request.reject(403,'Forbidden');
        };
    });
    service.after('READ', 'Custumers', (results: Custumers) =>{
        results.forEach(custumer => {
            if(!custumer.email?.includes('@')){
                custumer.email = `${custumer.email}@gmail.com`
            }
        })
    });

    service.before('CREATE','SalesOrderHeaders', (request: Request) =>{
        const params = request.data;
        if (!params.custumer_id){
            return request.reject(400, `Custumer invalido`)
        }
    });
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const params = request.data;
        if (!params.custumer_id) { //verificando de o o customer é valido
            return request.reject(400, 'Custumer inválido');
        }
        if (!params.items || params.items?.length === 0) { //verifica se os itens são válidos
            return request.reject(400, 'items  inválidos');
        }
        const custumerQuery = SELECT.one.from('sales.Custumers').where({id: params.customer_id});
        const custumer = await cds.run(custumerQuery);
        const items: SalesOrderItems = params.items;
        if(!custumer) { //verifica se o custumer existe
            return request.reject(404, 'Custumer não encontrado');
        }
        const productsIds: string[] = params.items.map((item: SalesOrderItem) => item.product_id);
        const productsQuery = SELECT.from('sales.Products').where({id: productsIds});
        const products: Products = await cds.run(productsQuery);
        for (const item of items){
            const dbProducts = products.find(product => product.id === item.product_id);
            if (!dbProducts) { //verifica se o produto existe
            return request.reject(404, `Produto ${item.product_id} não encontrado`);
            }
                if (dbProducts.stock === 0) {
                return request.reject(400, `Produto ${db.name}(${dbProducts.id}) sem estoque disponível`);
            }
        }
    });
    service.after('CREATE', 'SalesOerderHeaders', async (results: SalesOrderHeaders) => {
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
        }
    });
}