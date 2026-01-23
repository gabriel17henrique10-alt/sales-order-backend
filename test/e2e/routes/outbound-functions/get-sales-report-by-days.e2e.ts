import { api } from '@tests/e2e/config/api';

describe('GetSalesReportByDays route', () => {
    it('should return 404 if no records were found', async () => {
        // const { data, status } = await api.get('/sales-order/getSalesReportByDays()');
        // console.log(data);
        await expect(api.get('/sales-order/getSalesReportByDays()')).rejects.toThrow(
            'Nenhum dado encontrado para os parâmetros informados'
        );
    });
    it('should return report data with status 200 if everything worked as expect', async () => {
        const { data, status } = await api.get('/sales-order/getSalesReportByDays(days=25)');
        const { value: report } = data;
        console.log(report);

        expect(status).toBe(200);
        expect(report).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    salesOrderId: '4782978d-0c0d-408c-9313-66d83d57fcb5',
                    salesOrderTotalAmount: 7717695215683.98,
                    customerFullName: 'firstName1 lastName-449184',
                    customerId: '44918404-709a-49bb-b46f-a21db1c7bc9b'
                })
            ])
        );
    });
});
