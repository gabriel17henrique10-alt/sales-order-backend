import { CustumerModel, CustumerProps } from '@/models/custumer';

export interface CustumerRepository {
    findById(id: CustumerProps['id']): Promise<CustumerModel | null>;
}
