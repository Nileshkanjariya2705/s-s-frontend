import { SidebarType } from "../types/generalTypes"

export const supplierSidebarDetails: SidebarType[] = [
    {
        name: "Dashboard",
        icon: "icon-dashboard",
        path: "/dashboard",
    },
    {
        name: "Manage Profile",
        icon: "icon-manage-profile",
        path: "/manage-profile",
    },
    {
        name: "Products",
        icon: "icon-product-detail",
        path: "/products",
    },
    {
        name: "Purchase Request",
        icon: "icon-purchase-request",
        path: "/purchase-request",
    },
    {
        name: "Orders",
        icon: "icon-orders",
        path: "/orders",
        subitems: [
            {
                name: "Regular Orders",
                icon: "icon-purchase-history",
                path: "/orders",
            },
            {
                name: "Replacement Orders",
                icon: "icon-purchase-history",
                path: "/replacement-orders",
            },
            {
                name: "Refund Orders",
                icon: "icon-purchase-history",
                path: "/refund-orders",
            },
        ],
    },
    {
        name: "Staff",
        icon: "icon-staff",
        path: "/staff",
        subitems: [
            {
                name: "All roles",
                icon: "icon-rolles-alts",
                path: "/roles",
            },
            {
                name: "All staff",
                icon: "icon-staff",
                path: "/staff",
            },
        ],
    },
    {
        name: "Branches",
        icon: "icon-branches",
        path: "/branches",
    },
    {
        name: "Review Rating",
        icon: "icon-feedback",
        path: "/ratings",
    },
    {
        name: "Chat",
        icon: "icon-chat",
        path: "/chat",
    },
    {
        name: "Finance",
        icon: "icon-chat",
        path: "/finance",
    },
    {
        name: "Notification",
        icon: "icon-notification",
        path: "/notification",
    },
    {
        name: "Support Ticket",
        icon: "icon-support-ticket",
        path: "/support-ticket",
    },
]
