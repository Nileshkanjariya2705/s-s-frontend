export type financesupplierType = {
    uuid: string | undefined
    username: string
    email: string
    company_name: string
    cr_number: string
}
export type Dataprops = {
    month:string[]
}

export type pdfDataType = {
    file: string
    sheets:string
    uuid: string
    status:string
}