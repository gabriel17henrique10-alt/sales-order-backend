/* eslint-disable max-lines-per-function */
import { describe, expect, it } from 'vitest';

import { Customers } from '@models/sales';

import { CustomerService } from '@/services/customer/protocols';
import { CustomerServiceImpl } from '@/services/customer/implementation';

type SutTypes = {
    sut: CustomerService;
};

const makeSut = (): SutTypes => {
    return {
        sut: new CustomerServiceImpl()
    };
};

const id = crypto.randomUUID();

const getCustomerWithoutEmail = (): Customers => [
    {
        id,
        firstName: 'Gabs',
        lastName: 'Pereira',
        email: ''
    }
];

const getCustomerWithFullEmail = (): Customers => [
    {
        id,
        firstName: 'Gabriel',
        lastName: 'BTP',
        email: 'gabsbtp@lmail.com'
    }
];

const getCustomerWithoutAtSing = (): Customers => [
    {
        id,
        firstName: 'Joaozinho',
        lastName: 'BTP',
        email: 'joaozinhobtp'
    }
];

describe('CustomerServiceImpl test cases', () => {
    it('shoud test if afterRead works even if the customers array is empty', () => {
        const { sut } = makeSut();
        const customers = [];
        const result = sut.afterRead(customers);
        const expectedResult = [];
        expect(result.value).toEqual(expectedResult);
    });
    it('shoud test if afterRead works even if the e-mail is undefined or blank', () => {
        const { sut } = makeSut();
        const customers = getCustomerWithoutEmail();
        const expectedResult: Customers = [{ id, firstName: 'Gabs', lastName: 'Pereira', email: '' }];
        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });
    it('shoud test if afterRead does not changes the e-mail a full e-mail is provided', () => {
        const { sut } = makeSut();
        const customers = getCustomerWithFullEmail();
        const expectedResult: Customers = [{ id, firstName: 'Gabriel', lastName: 'BTP', email: 'gabsbtp@lmail.com' }];
        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });
    it('shoud test if afterRead changes the e-mail if it is missing @', () => {
        const { sut } = makeSut();
        const customers = getCustomerWithoutAtSing();
        const expectedResult: Customers = [
            { id, firstName: 'Joaozinho', lastName: 'BTP', email: 'joaozinhobtp@gmail.com' }
        ];
        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });
});
