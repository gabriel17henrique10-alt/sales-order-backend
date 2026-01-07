import { SalesOrderHeader, SalesOrderItem } from "@models/sales";
import { SalesOrderHeaderService, CreationPayLoadValidationResult } from "./protocols";
import { SalesOrderHeaderModel } from '../../models/sales-order-header'; 
import { SalesOrderItemModel } from "../../models/sales-order-item";
import { ProductRepository} from "../../repositories/product/protocols";
import { CustumerRepository } from "srv/repositories/custumer/protocols";
import { ProductModel } from "srv/models/products";
import { CustumerModel } from "srv/models/custumer";

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly custumerRepository: CustumerRepository,
        private readonly productRepository: ProductRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayLoadValidationResult> {
        const products = await this.getProducts(params);
        if(!products){
            return {
                hasError: true,
                error: new Error('nenhum produto da lista de itens foi encontrado.')
            }
        }
        const item = this.getSalesOrderItems(params, products);
        const header = this.getSalesOrderHeader(params, item);
        const custumer = await this.getCustumer(params);
        if (!custumer){
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            }
        }
        const headervalidationResult = header.validateCreationPayload({ custumer_id: custumer.id });
        if (headervalidationResult.hasError) {
            return headervalidationResult

        }

        return {
            hasError: false,
            totalAmount: header.calculateDiscount()
        }
    }

    private async getProducts(params: SalesOrderHeader): Promise <ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((items: SalesOrderItem) => items.product_id) as string[];
        return this.productRepository.findByIds(productsIds);
    }

    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map(item => SalesOrderItemModel.create({
            price: item.price as number,
            productId: item.product_id as string,
            quantity: item.quantity as number,
            products
        })) as SalesOrderItemModel[];
    }

    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            custumerId: params.custumer_id as string,
            items
        });
    }

    private getCustumer(params: SalesOrderHeader): Promise<CustumerModel | null> {
        const custumerId = params.custumer_id as string;
        return this.custumerRepository.findById(custumerId);
    }
}