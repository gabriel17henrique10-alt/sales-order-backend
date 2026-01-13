import cds from '@sap/cds';

import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';
import { SalesReportModel } from '@/models/seles-report';
import { SalesReportRepository } from './protocols';

export class SalesReportRepositoryImpl implements SalesReportRepository {
    public async findByDays(days: number): Promise<SalesReportModel[] | null> {
        const today = new Date().toISOString();
        const subtractedDays = new Date();
        subtractedDays.setDate(subtractedDays.getDate() - days);
        const subtractedDaysISOString = subtractedDays.toISOString();

        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns(
                'id as salesOrderId',
                'totalAmount as salesOrderTotalAmount',
                'custumer.id as customerId',
                // eslint-disable-next-line quotes
                `custumer.firstName  || ' ' || custumer.lastName as custumerFullName`
            )
            .where({ createdAt: { between: subtractedDaysISOString, and: today } });
        const SalesReports = await cds.run(sql);
        if (SalesReports.length === 0) {
            return null;
        }
        return SalesReports.map((salesReport: SalesReportByDays) =>
            SalesReportModel.with({
                salesOrderId: salesReport.salesOrderId as string,
                salesOrderTotalAmount: salesReport.salesOrderTotalAmount as number,
                custumerId: salesReport.custumerId as string,
                custumerFullName: salesReport.custumerFullName as string
            })
        );
    }
}
