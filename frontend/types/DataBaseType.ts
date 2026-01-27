// we can to see all type database

export type Projects_DB = {
    id: number,
    name_project: string,
    description_project: string,
    user_id: number,
    created_at?: Date,
    updated_at?: Date,
    active: boolean,
}

export type Resource_DB = {
    id: number,
    origine_resource: string,
    price_resource: number,
    project_id: number,
    created_at?: Date,
    updated_at?: Date,
}

export type Spend_DB = {
    id: number,
    project_id: number,
    name_spend: string,
    created_at?: Date,
    updated_at?: Date
}

export type Details_DB = {
    id: number,
    name_detail: string,
    spend_id: number,
    created_at?: Date,
    updated_at?: Date
}

export type Makes_DB = {
    id: number,
    detail_id: number,
    resource_id: number,
    price_spend: string,
    created_at?: Date,
    updated_at?: Date
}

export type DetailSpend_DB = {
    id: number,
    name_detail: string,
    price_spend: number,
    date: Date,
}

export type StayResource_DB = {
    id: number,
    name_resource: string,
    price_resource: number,
    total_spend: number,
    stay: number,
}

export type Years_DB = {
    id: number,
    year: Date,
}

export type Data_DB = {
    id: number,
    price_spend: number,
    price_resource: number,
    date: Date,
}



