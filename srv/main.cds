using {sales} from '../db/schema';

@requires: 'admin'
service MainService{
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity Custumers as projection on sales.Custumers;
    entity Products as projection on sales.Products;
}