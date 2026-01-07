using {sales} from '../db/schema';

@requires: 'authenticate-user'
service MainService{
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity Custumers as projection on sales.Custumers;
    entity Products as projection on sales.Products;
    entity SalesOrderLogs as projection on sales.SalesOrderLogs;
}