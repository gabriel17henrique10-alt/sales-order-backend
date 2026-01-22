/* eslint-disable max-lines-per-function */
import { describe, expect, it, vi } from 'vitest';

import { SalesReportRepository } from '@/repositories/sales-report/protocols';
import { SalesReportService } from '@/services/sales-report/protocols';
import { SalesReportServiceImpl } from '@/services/sales-report/implementation';

import { SalesReportRepositoryStub } from '@tests/unit/services/sales-report/stubs';
import { NotFoundError, ServerError } from '@/errors';

type SutTypes = {
    sut: SalesReportService;
    salesReportRepository: SalesReportRepository;
};

const makeSut = (): SutTypes => {
    const salesReportRepository = new SalesReportRepositoryStub();
    return {
        sut: new SalesReportServiceImpl(salesReportRepository),
        salesReportRepository
    };
};

describe('SalesReportService test cases', () => {
    it('shoud throw if SalesRepository throws', async () => {
        const { sut, salesReportRepository } = makeSut();
        vi.spyOn(salesReportRepository, 'findByDays').mockRejectedValueOnce(() => {
            throw new ServerError('Fake error');
        });
        const result = await sut.findByDays();
        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.code).toBe(500);
        expect(error.message).toBe('internalServerError');
    });
    it('should return NotFoundError if records were found for the provided parameters', async () => {
        const { sut, salesReportRepository } = makeSut();
        vi.spyOn(salesReportRepository, 'findByDays').mockReturnValueOnce(Promise.resolve(null));
        const result = await sut.findByDays();
        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(NotFoundError);
        const error = result.value as NotFoundError;
        expect(error.code).toBe(404);
        expect(error.message).toBe('Nenhum dado encontrado para os parâmetros informados');
    });
    it('should return SalesReport if everything worked as expected', async () => {
        const { sut, salesReportRepository } = makeSut();
        vi.spyOn(salesReportRepository, 'findByDays').mockRejectedValueOnce(() => {
            throw new ServerError('Fake error');
        });
        const result = await sut.findByDays();
        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.code).toBe(500);
        expect(error.message).toBe('internalServerError');
    });
    it('should return NotFoundError if records were found for the provided parameters', async () => {
        const { sut } = makeSut();
        const result = await sut.findByDays();
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    salesOrderTotalAmount: 100,
                    customerFullName: 'Valid Customer'
                })
            ])
        );
    });
});
