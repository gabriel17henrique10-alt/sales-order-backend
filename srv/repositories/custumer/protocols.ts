import { CustumerModel, CustumerProps } from 'srv/models/custumer';

export interface CustumerRepository {
    findById(id: CustumerProps['id']): Promise<CustumerModel | null>;
}
