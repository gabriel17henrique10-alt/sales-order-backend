import { User } from '@sap/cds';

import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

import { Payload as BulkCreateSalesOrdersPayload } from '@models/db/types/BulkCreateSalesOrder';
import { CustomerModel } from '@/models/customer';
import { CustomerRepository } from '@/repositories/customer/protocols';
import { LoggedUserModel } from '@/models/logged-user';
import { ProductModel } from '@/models/products';
import { ProductRepository } from '@/repositories/product/protocols';
import { SalesOrderHeaderModel } from '@/models/sales-order-header';
import { SalesOrderHeaderRepository } from '@/repositories/sales-order-header/protocols';
import { SalesOrderItemModel } from '@/models/sales-order-item';
import { SalesOrderLogModel } from '@/models/sales-order-log';
import { SalesOrderLogRepository } from '@/repositories/sales-order-log/protocols';
import { CreationPayLoadValidationResult, SalesOrderHeaderService } from '@/services/sales-order-header/protocols';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly salesOrderHeaderRepository: SalesOrderHeaderRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult> {
        const productValidation = await this.validateProductsOnCreation(params);
        if (productValidation.hasError) {
            return productValidation;
        }
        const item = this.getSalesOrderItems(params, productValidation.products as ProductModel[]);
        const header = this.getSalesOrderHeader(params, item);
        const customerValidationResult = await this.validateCustomerOnCreation(params);
        if (customerValidationResult.hasError) {
            return customerValidationResult;
        }
        const headervalidationResult = header.validateCreationPayload({
            customer_id: (customerValidationResult.customer as CustomerModel).id
        });
        if (headervalidationResult.hasError) {
            return headervalidationResult;
        }

        return {
            hasError: false,
            totalAmount: header.calculateDiscount()
        };
    }

    public async afterCreate(
        params: SalesOrderHeaders | BulkCreateSalesOrdersPayload[],
        loggedUser: User
    ): Promise<void> {
        const headersAsArray = Array.isArray(params) ? params : ([params] as SalesOrderHeaders);
        const logs: SalesOrderLogModel[] = [];
        for (const header of headersAsArray) {
            const products = (await this.getProducts(header)) as ProductModel[];
            const item = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, item);
            const productsData = salesOrderHeader.getProductData();
            for (const product of products) {
                const foundProducts = productsData.find((productData) => productData.id === product.id);
                product.sell(foundProducts?.quantity as number);
                await this.productRepository.updateStock(product);
            }
            const user = this.getLoggedUser(loggedUser);
            const log = this.getSalesOrderLog(salesOrderHeader, user);
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }

    public async bulkCreate(
        headers: BulkCreateSalesOrdersPayload[],
        loggedUser: User
    ): Promise<CreationPayLoadValidationResult> {
        const bulkCreateHeaders: SalesOrderHeaderModel[] = [];
        for (const headerObject of headers) {
            const productValidation = await this.validateProductsOnCreation(headerObject);
            if (productValidation.hasError) {
                return productValidation;
            }
            const item = this.getSalesOrderItems(headerObject, productValidation.products as ProductModel[]);
            const header = this.getSalesOrderHeader(headerObject, item);
            const customerValidationResult = await this.validateCustomerOnCreation(headerObject);
            if (customerValidationResult.hasError) {
                return customerValidationResult;
            }
            const headerValidationResult = header.validateCreationPayload({
                customer_id: (customerValidationResult.customer as CustomerModel).id
            });
            if (headerValidationResult.hasError) {
                return headerValidationResult;
            }
            bulkCreateHeaders.push(header);
        }
        await this.salesOrderHeaderRepository.bulkCreate(bulkCreateHeaders);
        await this.afterCreate(headers, loggedUser);
        return this.serializeBulkCreateResult(bulkCreateHeaders);
    }

    public async cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayLoadValidationResult> {
        const header = await this.salesOrderHeaderRepository.findCompleteSalesOrderById(id);
        if (!header) {
            return {
                hasError: true,
                error: new Error('Pedido não encontrado')
            };
        }
        const headerValidationResult = header.validateCreationPayload({ customer_id: header.customer_id });
        if (headerValidationResult.hasError) {
            return headerValidationResult;
        }
        await this.salesOrderHeaderRepository.bulkCreate([header]);
        await this.afterCreate([header.toCreationObject()], loggedUser);
        return this.serializeBulkCreateResult([header]);
    }

    private serializeBulkCreateResult(headers: SalesOrderHeaderModel[]): CreationPayLoadValidationResult {
        return {
            hasError: false,
            headers: headers.map((header) => header.toCreationObject())
        };
    }

    private async validateProductsOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrdersPayload
    ): Promise<CreationPayLoadValidationResult> {
        const products = await this.getProducts(header);
        if (!products) {
            return {
                hasError: true,
                error: new Error('nenhum produto da lista de itens foi encontrado.')
            };
        }
        return {
            hasError: false,
            products
        };
    }

    private async validateCustomerOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrdersPayload
    ): Promise<CreationPayLoadValidationResult> {
        const customer = await this.getCustomer(header);
        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            };
        }
        return {
            hasError: false,
            customer
        };
    }

    private async getProducts(params: SalesOrderHeader | BulkCreateSalesOrdersPayload): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item) => item.product_id) as string[];
        return this.productRepository.findByIds(productsIds);
    }

    private getSalesOrderItems(
        params: SalesOrderHeader | BulkCreateSalesOrdersPayload,
        products: ProductModel[]
    ): SalesOrderItemModel[] {
        return params.items?.map((item) =>
            SalesOrderItemModel.create({
                price: item.price as number,
                productId: item.product_id as string,
                quantity: item.quantity as number,
                products
            })
        ) as SalesOrderItemModel[];
    }

    private getSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrdersPayload,
        items: SalesOrderItemModel[]
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrdersPayload,
        items: SalesOrderItemModel[]
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }
    private getCustomer(params: SalesOrderHeader | BulkCreateSalesOrdersPayload): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }
        });
    }
    private getSalesOrderLog(salesOrderHeader: SalesOrderHeaderModel, user: LoggedUserModel): SalesOrderLogModel {
        return SalesOrderLogModel.create({
            headerId: salesOrderHeader.id,
            orderData: salesOrderHeader.toSringfiedObject(),
            userData: user.toSringfiedObject()
        });
    }
}
