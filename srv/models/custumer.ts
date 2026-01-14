export type CustumerProps = {
    id: string;
    fisrtName: string;
    lastName: string;
    email: string;
};

export class CustumerModel {
    constructor(private props: CustumerProps) {}

    public static with(props: CustumerProps): CustumerModel {
        return new CustumerModel(props);
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

    public setDefaultEmailDomain(): CustumerModel {
        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@gmailcom`;
        }
        return this;
    }

    public toObject(): CustumerProps {
        return {
            id: this.props.id,
            fisrtName: this.props.fisrtName,
            lastName: this.props.lastName,
            email: this.props.email
        };
    }
}
