export interface Invoice {
    id: number,
    taxedPrice: number,
    checkbox?: boolean,
}


export interface IOrders {
    id: number
    number: string
    status: string
    total: number
    customer: {
        documentType: string
        document: string
        businessName: string
        firstname: string
        lastname: string
        address: string
        phone: string
        email: string
    }
    date_created: string
    date_modified: string
    date_paid: string
    line_items: ILineItem[]
}

export interface ILineItem {
    product_id: number
    name: string
    quantity: number
    price: number
    total: number
    meta_data: IMetaData[]
}

export interface IMetaData {
    key: string
    value: string
}
export default IOrders