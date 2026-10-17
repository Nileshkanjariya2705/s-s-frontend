import { SidebarType } from "../types/generalTypes"
export const adminSidebarDetails: SidebarType[] = [
    {
        name: "Dashboard",
        icon: "icon-dashboard",
        path: "/admin/admin-dashboard",
    },
    {
        name: "Store",
        icon: "icon-store",
        path: "/admin/store",
    },
    {
        name: "Supplier",
        icon: "icon-supplier",
        path: "/admin/supplier",
    },
    {
        name: "CMS Pages",
        icon: "icon-pages-alt",
        path: "/admin/cms-pages",
    },

    {
        name: "Product_Title",
        icon: "icon-product-alt",
        path: "/admin/subproduct",
        subitems: [
            {
                name: "Categories",
                icon: "icon-category",
                path: "/admin/categories",
            },
            {
                name: "Products List",
                icon: "icon-product-alt",
                path: "/admin/products",
            },
            {
                name: "UOM",
                icon: "icon-measurement",
                path: "/admin/measurement",
            },
        ],
    },
    {
        name: "Orders",
        icon: "icon-orders-alt",
        path: "/admin/orders",
        subitems: [
            {
                name: "Regular Orders",
                icon: "icon-orders-alt",
                path: "/admin/orders",
            },
            {
                name: "Refund Orders",
                icon: "icon-orders-alt",
                path: "/admin/refund-orders",
            },
        ],
    },
    {
        name: "Support Ticket",
        icon: "icon-support-ticket",
        path: "/admin/support-ticket",
    },

    {
        name: "Payment",
        icon: "icon-payment",
        path: "/admin/payment",
    },
    {
        name: "Bank Transfer",
        icon: "icon-bank_transfer",
        path: "/admin/bank-transfer",
    },
    {
        name: "Finance",
        icon: "icon-bank_transfer",
        path: "/admin/finance",
    },
    {
        name: "Get In Touch",
        icon: "icon-get-in-touch",
        path: "/admin/get-in-touch",
    },
    {
        name: "Settings",
        icon:"icon-settings",
        path: "/admin/settings",
    }
]
