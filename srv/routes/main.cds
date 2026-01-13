using {sales} from '../../db/schema';
using { db.types.SalesReport } from '../../db/types';

@requires: 'read_only_user'
service MainService{
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity SalesOrderStatuses as  projection on sales.SalesOrderStatuses;
    entity Custumers as projection on sales.Custumers actions{
        function getSalesReportByCustomerId() returns array of SalesReport.ExpectedResult;
    };
    entity Products as projection on sales.Products;
    entity SalesOrderLogs as projection on sales.SalesOrderLogs;
}

extend service MainService with {
    function getSalesReportByDays(days: SalesReport.Params: days) returns array of SalesReport.ExpectedResult;
}