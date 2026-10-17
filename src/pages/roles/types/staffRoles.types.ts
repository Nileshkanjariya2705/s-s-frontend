export type Permission = {
    uuid: string
    name: string
    permission_type: string
}

export type EditPermissions = {
    [key: string]: boolean
}
export type PermissionsData = {
    orders: Permission[]
    manageProfile: Permission[]
    manageBranch: Permission[]
    requestPurchase: Permission[]
    supportTicket: Permission[]
    products: Permission[]
    purchaseRequest: Permission[]
}

export type FormData = {
    rolename: string
    rolename_ar: string
    rolename_ur: string
    status: string
}
export type role = {
    name: string
    status: string
}
