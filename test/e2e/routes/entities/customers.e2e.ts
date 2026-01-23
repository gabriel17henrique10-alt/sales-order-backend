import { api } from '@tests/e2e/config/api';

describe('Customers routes', () => {
    describe('AfterRead Customers', () => {
        it('should get all customers with @gmail.com', async () => {
            const { data, status } = await api.get('/sales-order/Customers');
            const { value: customers } = data;
            console.log(status);
            expect(status).toBe(200);
            expect(customers.length).toEqual(10);
            expect(customers).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        email: 'email-449184@gmail.com'
                    })
                ])
            );
        });
    });
});
