import { SalesOrderItemModel } from '@/models/sales-order-item';

type SalesOrderHeaderProps = {
    id: string;
    custumerId: string;
    totalAmount: number;
    items: SalesOrderItemModel[];
};

type SalesOrderHeaderPropsWithoutIdAndTotalAmount = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type CreationPayLoad = {
    custumer_id: SalesOrderHeaderProps['custumerId'];
};

type CreationPayLoadValidationResult = {
    hasError: boolean;
    error?: Error;
};

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public static create(props: SalesOrderHeaderPropsWithoutIdAndTotalAmount): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }

    public static with(props: SalesOrderHeaderProps): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get custumer_id() {
        return this.props.custumerId;
    }

    public get totalAmount() {
        return this.props.totalAmount;
    }

    public get items() {
        return this.props.items;
    }

    public set totalAmount(amount: number) {
        this.totalAmount = amount;
    }

    public validateCreationPayload(params: CreationPayLoad): CreationPayLoadValidationResult {
        const custumerValidationResult = this.validateCustumerOnCreation(params.custumer_id);
        if (custumerValidationResult.hasError) {
            return custumerValidationResult;
        }
        const itemsValidationResult = this.validateItemsOnCreation(this.items);
        if (itemsValidationResult.hasError) {
            return itemsValidationResult;
        }
        return {
            hasError: false
        };
    }
    private validateCustumerOnCreation(
        custumerId: SalesOrderHeaderProps['custumerId']
    ): CreationPayLoadValidationResult {
        if (!custumerId) {
            return {
                hasError: true,
                error: new Error('Custumer invalido')
            };
        }
        return {
            hasError: false
        };
    }
    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationPayLoadValidationResult {
        if (!items || items?.length === 0) {
            return {
                hasError: true,
                error: new Error('itens inválidos')
            };
        }
        const itemsErrors: string[] = [];
        this.items.forEach((item) => {
            const validationResult = item.validateCreationPayload({ product_id: item.productId });
            if (validationResult.hasError) {
                itemsErrors.push(validationResult.error?.message as string);
            }
        });
        if (itemsErrors.length > 0) {
            const messages = itemsErrors.join('\n -');
            return {
                hasError: true,
                error: new Error(messages)
            };
        }
        return {
            hasError: false
        };
    }

    public calculateTotalAmount(): number {
        let totalAmount = 0;
        this.items.forEach((item) => {
            totalAmount += (item.price as number) * (item.quantity as number);
        });
        return totalAmount;
    }

    public calculateDiscount(): number {
        let totalAmount = this.calculateTotalAmount();
        if (totalAmount > 30000) {
            const discount = totalAmount * (30 / 100);
            totalAmount = totalAmount - discount;
        }
        return totalAmount;
    }

    public getProductData(): { id: string; quantity: number }[] {
        return this.items.map((item) => ({
            id: item.productId,
            quantity: item.quantity
        }));
    }

    public toSringfiedObject(): string {
        return JSON.stringify(this.props);
    }
}
