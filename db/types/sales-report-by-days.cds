using { sales } from '../schema';

namespace db.types.SalesReportByDays;

type Params:
{
    days: Integer;
}

type ExpectedResult {
        salesOrderId: sales.SalesOrderHeaders:id;
        salesOrderTotalAmount: sales.SalesOrderHeaders:totalAmount;
        custumerId: sales.Custumers: id;
        custumerFullName: String(120);
    };

