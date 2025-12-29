import { ResultsHandler, Service } from '@sap/cds';
import { Custumers } from '@models/sales';

export default (service: Service) => {
    service.after('READ', 'Custumers', (results: Custumers) =>{
        results.forEach(custumer => {
            if(!custumer.email?.includes('@')){
                custumer.email = `${custumer.email}@gmail.com`
            }
        })
    })

}