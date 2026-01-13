using {sales} from '../../db/schema';
using {db.types.SalesReportByDays} from '../../db/types';

@requires: 'read_only_user'
service MainService{
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity SalesOrderStatuses as  projection on sales.SalesOrderStatuses;
    entity Custumers as projection on sales.Custumers;
    entity Products as projection on sales.Products;
    entity SalesOrderLogs as projection on sales.SalesOrderLogs;
    }

extend service MainService with {
    function getSalesReportByDays(days: SalesReportByDays.Params: days) returns array of SalesReportByDays.ExpectedResult;
}