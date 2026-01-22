import { Either } from '@sweet-monads/either';

import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReport';

import { AbstractError } from '@/errors';

export interface SalesReportService {
    findByDays(days: number): Promise<Either<AbstractError, SalesReportByDays[]>>;
    findByCustomerId(customerId: string): Promise<Either<AbstractError, SalesReportByDays[]>>;
}
