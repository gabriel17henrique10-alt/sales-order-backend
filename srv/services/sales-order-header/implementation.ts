import { User } from '@sap/cds';

import { CustumerModel } from 'srv/models/custumer';
import { CustumerRepository } from 'srv/repositories/custumer/protocols';
import { LoggedUserModel } from 'srv/models/logged-user';
import { ProductModel } from 'srv/models/products';
import { ProductRepository } from '../../repositories/product/protocols';
import { SalesOrderHeaderModel } from '../../models/sales-order-header';
import { SalesOrderItemModel } from '../../models/sales-order-item';
import { SalesOrderLogModel } from 'srv/models/sales-order-log';
import { SalesOrderLogRepository } from 'srv/repositories/sales-order-log/protocols';
import { CreationPayLoadValidationResult, SalesOrderHeaderService } from './protocols';
import { SalesOrderHeader, SalesOrderHeaders, SalesOrderItem } from '@models/sales';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly custumerRepository: CustumerRepository,
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult> {
        const products = await this.getProducts(params);
        if (!products) {
            return {
                hasError: true,
                error: new Error('nenhum produto da lista de itens foi encontrado.')
            };
        }
        const item = this.getSalesOrderItems(params, products);
        const header = this.getSalesOrderHeader(params, item);
        const custumer = await this.getCustumer(params);
        if (!custumer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            };
        }
        const headervalidationResult = header.validateCreationPayload({ custumer_id: custumer.id });
        if (headervalidationResult.hasError) {
            return headervalidationResult;
        }

        return {
            hasError: false,
            totalAmount: header.calculateDiscount()
        };
    }

    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
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

    private async getProducts(params: SalesOrderHeader): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((items: SalesOrderItem) => items.product_id) as string[];
        return this.productRepository.findByIds(productsIds);
    }

    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map((item) =>
            SalesOrderItemModel.create({
                price: item.price as number,
                productId: item.product_id as string,
                quantity: item.quantity as number,
                products
            })
        ) as SalesOrderItemModel[];
    }

    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            custumerId: params.custumer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            custumerId: params.custumer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }
    private getCustumer(params: SalesOrderHeader): Promise<CustumerModel | null> {
        const custumerId = params.custumer_id as string;
        return this.custumerRepository.findById(custumerId);
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
