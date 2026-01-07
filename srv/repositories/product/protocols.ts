import { ProductProps, ProductModel } from "srv/models/products";

export interface ProductRepository {
    findByIds(ids: ProductProps["id"][]): Promise<ProductModel[] | null>;
}