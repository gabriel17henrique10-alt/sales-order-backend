type SalesReportProps = {
    salesOrderId: string;
    salesOrderTotalAmount: number;
    custumerId: string;
    custumerFullName: string;
};

export class SalesReportModel {
    constructor(private props: SalesReportProps) {}

    public static with(props: SalesReportProps): SalesReportModel {
        return new SalesReportModel(props);
    }
    public get salesOrderId() {
        return this.props.salesOrderId;
    }
    public get salesOrderTotalAmount() {
        return this.props.salesOrderTotalAmount;
    }
    public get custumerId() {
        return this.props.custumerId;
    }
    public get custumerFullName() {
        return this.props.custumerFullName;
    }

    public toObject(): SalesReportProps {
        return {
            salesOrderId: this.props.salesOrderId,
            salesOrderTotalAmount: this.props.salesOrderTotalAmount,
            custumerFullName: this.props.custumerId,
            custumerId: this.props.custumerFullName
        };
    }
}
