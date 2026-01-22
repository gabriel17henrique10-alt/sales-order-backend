export type CustomerProps = {
    id: string;
    fisrtName: string;
    lastName: string;
    email: string;
};

export class CustomerModel {
    constructor(private props: CustomerProps) {}

    public static with(props: CustomerProps): CustomerModel {
        return new CustomerModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get fisrtName() {
        return this.props.fisrtName;
    }

    public get lastName() {
        return this.props.lastName;
    }

    public get email() {
        return this.props.email;
    }

    public setDefaultEmailDomain(): CustomerModel {
        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@gmailcom`;
        }
        return this;
    }

    public toObject(): CustomerProps {
        return {
            id: this.props.id,
            fisrtName: this.props.fisrtName,
            lastName: this.props.lastName,
            email: this.props.email
        };
    }
}
