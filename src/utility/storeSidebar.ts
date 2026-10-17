import { SidebarType } from "../types/generalTypes"

export const storeSidebarDetails: SidebarType[] = [
    {
        name: "Dashboard",
        icon: "icon-dashboard",
        path: "/dashboard",
    },
    {
        name: "Cards",
        icon: "icon-purchase-history",
        path: "/saved-card",
    },
    {
        name: "Manage Profile",
        icon: "icon-manage-profile",
        path: "/manage-profile",
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
        name: "Purchase History",
        icon: "icon-purchase-history",
        path: "/purchase-history",
        subitems: [
            {
                name: "Orders",
                icon: "icon-purchase-history",
                path: "/purchase-history",
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
        name: "Purchase Request",
        icon: "icon-purchase-request",
        path: "/purchase-request",
    },
    {
        name: "Bank_Transfer",
        icon: "icon-measurement",
        path: "/bank-transfer-order",
    },
    {
        name: "Chat",
        icon: "icon-chat",
        path: "/chat",
    },
    {
        name: "Support Ticket",
        icon: "icon-support-ticket",
        path: "/support-ticket",
    },
    {
        name: "Notification",
        icon: "icon-notification",
        path: "/notification",
    },
]
