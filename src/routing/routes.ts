import {
  ADMIN_NAVIGATION,
  PUBLIC_NAVIGATION,
  USER_NAVIGATION,
} from "constant/navigation.constant";
import { lazy } from "react";

export const publicRoutes = [
  {
    path: PUBLIC_NAVIGATION.login,
    element: lazy(() => import("../pages/authentication/Login")),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.signup,
    element: lazy(() => import("../pages/authentication/SignUp")),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.forgotPassword,
    element: lazy(
      () => import("../pages/authentication/components/ForgotPassword")
    ),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.checkEmail,
    element: lazy(
      () => import("../pages/authentication/components/CheckYourEmail")
    ),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.passwordSuccess,
    element: lazy(
      () => import("../pages/authentication/components/PasswordSuccess")
    ),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.resetPassword,
    element: lazy(
      () => import("../pages/authentication/components/ResetPassword")
    ),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.home,
    element: lazy(() => import("../pages/publicPages/Home")),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.about,
    element: lazy(() => import("../pages/publicPages/About")),
    isPublic: true,
  },
  {
    path: PUBLIC_NAVIGATION.contactUs,
    element: lazy(() => import("../pages/publicPages/Contact")),
    isPublic: true,
  },

  {
    path: PUBLIC_NAVIGATION.blog,
    element: lazy(() => import("../pages/publicPages/Blog")),
    isPublic: true,
  },

  {
    path: PUBLIC_NAVIGATION.blogDetail,
    element: lazy(() => import("../pages/publicPages/BlogDetails")),
    isPublic: true,
  },

  {
    path: PUBLIC_NAVIGATION.adminLogin,
    element: lazy(() => import("../pages/admin/authentication/AdminLogin")),
    isPublic: true,
    isAdmin: true,
  },

  {
    path: PUBLIC_NAVIGATION.adminForgotPassword,
    element: lazy(
      () => import("../pages/admin/authentication/AdminForgotPassword")
    ),
    isPublic: true,
    isAdmin: true,
  },
  {
    path: PUBLIC_NAVIGATION.adminResetPassword,
    element: lazy(
      () => import("../pages/admin/authentication/AdminResetPassword")
    ),
    isPublic: true,
    isAdmin: true,
  },

  {
    path: PUBLIC_NAVIGATION.notFound,
    element: lazy(() => import("../components/pageNotFound/PageNotFound")),
    isPublic: true,
    isPageNotFound: true,
  },

  {
    path: PUBLIC_NAVIGATION.adminCheckYourMail,
    element: lazy(() => import("../pages/admin/authentication/AdminCheckmail")),
    isPublic: true,
    isAdmin: true,
  },
];

export const adminRoutes = [
  {
    path: ADMIN_NAVIGATION.adminDashboard,
    element: lazy(() => import("../pages/admin/dashboard/AdminDashboard")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminStore,
    element: lazy(() => import("../pages/admin/store/Store")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminSupplier,
    element: lazy(() => import("../pages/admin/supplier/Supplier")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminCMS,
    element: lazy(() => import("../pages/admin/cmsPages/cmsPagesList/CmsPage")),
    isAdmin: true,
    isPrivate: true,
  },

  {
    path: USER_NAVIGATION.StaffRoles,
    element: lazy(() => import("../pages/roles/staffRoles")),
    isPrivate: true,
    isAdmin: false,
  },
  {
    path: ADMIN_NAVIGATION.adminCMSBlogEdit,
    element: lazy(
      () =>
        import("../pages/admin/cmsPages/cmsPagesView/component/BlogCreateEdit")
    ),
    isAdmin: true,
  },
  {
    path: ADMIN_NAVIGATION.adminCMSView,
    element: lazy(
      () => import("../../src/pages/admin/cmsPages/cmsPagesView/CmsPageView")
    ),
    isAdmin: true,
  },
  {
    path: ADMIN_NAVIGATION.adminManageProfile,
    element: lazy(
      () => import("../pages/admin/adminManageProfile/AdminManageProfile")
    ),
    isAdmin: true,
    isPrivate: true,
  },

  {
    path: ADMIN_NAVIGATION.adminCMSBlogListing,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/BlogsListing"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },

  {
    path: ADMIN_NAVIGATION.adminCMSBlogCreate,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/BlogCreateEdit"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },

  {
    path: ADMIN_NAVIGATION.adminCMSBlogEdit,
    element: lazy(
      () =>
        import("../pages/admin/cmsPages/cmsPagesView/component/BlogCreateEdit")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminCMSFaqListing,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/FaqListing"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminCMSReviewCardList,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/ReviewList"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminStoreEdit,
    element: lazy(() => import("../pages/admin/store/EditStoreInfo")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminStoreView,
    element: lazy(() => import("../pages/admin/store/EditStoreInfo")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminCMSFaqCreate,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/FaqCreateOrEdit"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminCMSFaqEdit,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/FaqCreateOrEdit"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminAddCMSReviewCard,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/ReviewCreateEdit"
        )
    ),
  },

  {
    path: ADMIN_NAVIGATION.adminEditCMSReviewCard,
    element: lazy(
      () =>
        import(
          "../../src/pages/admin/cmsPages/cmsPagesView/component/ReviewCreateEdit"
        )
    ),
  },
  {
    path: ADMIN_NAVIGATION.adminSupplierEdit,
    element: lazy(() => import("../../src/pages/admin/supplier/SupplierEdit")),
  },
  {
    path: ADMIN_NAVIGATION.adminCategories,
    element: lazy(() => import("../../src/pages/admin/categories/Categories")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: USER_NAVIGATION.Branch,
    element: lazy(() => import("../pages/branch/Branch")),
    isPrivate: true,
    isAdmin: false,
  },
  {
    path: USER_NAVIGATION.StaffRoles,
    element: lazy(() => import("../pages/roles/staffRoles")),
    isPrivate: true,
    isAdmin: false,
  },
  {
    path: ADMIN_NAVIGATION.adminEditCategory,
    element: lazy(
      () => import("../../src/pages/admin/categories/EditCategory")
    ),
    isAdmin: true,
    isPrivate: true,
  },

  {
    path: ADMIN_NAVIGATION.adminViewCategory,
    element: lazy(
      () => import("../../src/pages/admin/categories/ViewCategory")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminAddCategory,
    element: lazy(
      () => import("../../src/pages/admin/categories/AddNewCategory")
    ),
    isAdmin: true,
    isPrivate: true,
  },

  {
    path: ADMIN_NAVIGATION.adminUnitOfMeasurement,
    element: lazy(
      () => import("../pages/admin/unitsOfMeasurement/UnitsOfMeasurement")
    ),
  },
  {
    path: ADMIN_NAVIGATION.adminAddUnitOfMeasurement,
    element: lazy(
      () =>
        import(
          "../pages/admin/unitsOfMeasurement/components/AddOrEditMeasurement"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminEditUnitOfMeasurement,
    element: lazy(
      () =>
        import(
          "../pages/admin/unitsOfMeasurement/components/AddOrEditMeasurement"
        )
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminSupplierEdit,
    element: lazy(() => import("../../src/pages/admin/supplier/SupplierEdit")),
  },
  {
    path: "/unauthorize",
    element: lazy(() => import("../components/unauthorize/Unauthorize")),
    isPrivate: true,
  },

  {
    path: ADMIN_NAVIGATION.adminProducts,
    element: lazy(() => import("../../src/pages/admin/products/Products")),
    isAdmin: true,
    isPrivate: true,
  },

  {
    path: ADMIN_NAVIGATION.adminAddProducts,
    element: lazy(
      () => import("../pages/admin/products/components/AddProducts")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminEditProducts,
    element: lazy(
      () => import("../../src/pages/admin/products/components/EditProduct")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminViewProducts,
    element: lazy(
      () => import("../../src/pages/admin/products/components/ViewProduct")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminSupportTicket,
    element: lazy(() => import("../pages/admin/supportTicket/SupportTicket")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminSupportTicketView,
    element: lazy(
      () => import("../pages/admin/supportTicket/components/SupportTicketView")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminOrders,
    element: lazy(() => import("../pages/admin/orders/Order")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminRefundOrders,
    element: lazy(() => import("../pages/admin/orders/RefundOrder")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminOrderView,
    element: lazy(() => import("../pages/admin/orders/ViewOrder")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminRefundOrderView,
    element: lazy(() => import("../pages/admin/orders/ViewRefundOrder")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminNotification,
    element: lazy(() => import("../pages/notification/Notification")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminPayment,
    element: lazy(() => import("../pages/admin/payment/PaymentList")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminBankTransfer,
    element: lazy(() => import("../pages/admin/bankTransfer/BankTransfer")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminBankTransferDetails,
    element: lazy(
      () =>
        import("../pages/admin/bankTransfer/components/BankTransferApproval")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminFinance,
    element: lazy(() => import("../pages/admin/finance/Finance")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminFinancePdfview,
    element: lazy(() => import("../pages/admin/finance/component/FinancePdf")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminFinanceExcelview,
    element: lazy(
      () => import("../pages/admin/finance/component/FinanceExcel")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminFinanceView,
    element: lazy(
      () => import("../pages/admin/finance/component/financeSupplierView")
    ),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminGetInTouch,
    element: lazy(() => import("../pages/admin/getInTouch/GetInTouch")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.managePassword,
    element: lazy(() => import("../pages/admin/managePassword/ManagePassword")),
    isAdmin: true,
    isPrivate: true,
  },
  {
    path: ADMIN_NAVIGATION.adminSettings,
    element: lazy(() => import("../pages/admin/settings/index")),
    isAdmin: true,
    isPrivate: true,
  },

];

export const userRoutes = {
  storeOwner: [
    {
      path: USER_NAVIGATION.dashboard,
      element: lazy(() => import("../pages/store/dashboard/StoreDashboard")),
      isPrivate: true,
      isAdmin: false,
    },

    {
      path: USER_NAVIGATION.manageProfile,
      element: lazy(() => import("../pages/manageProfile/ManageProfile")),
      isPrivate: true,
    },
    {
      path: USER_NAVIGATION.Staff,
      element: lazy(() => import("../pages/staff/Staff")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.StaffRoles,
      element: lazy(() => import("../pages/roles/staffRoles")),
      isPrivate: true,
      isAdmin: false,
    },

    {
      path: USER_NAVIGATION.AddRoles,
      element: lazy(
        () => import("../pages/roles/components/AddRolePermission")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.EditRoles,
      element: lazy(
        () => import("../pages/roles/components/AddRolePermission")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeProductListing,
      element: lazy(
        () => import("../pages/store/storeProduct/StoreProductListing")
      ),
      isPrivate: true,
      isAdmin: false,
      withoutSideBar: true,
    },
    {
      path: USER_NAVIGATION.categoryProductListing,
      element: lazy(
        () => import("../pages/store/storeProduct/ProductsListing")
      ),
      isPrivate: true,
      isAdmin: false,
      withoutSideBar: true,
    },
    {
      path: USER_NAVIGATION.storeProductDetail,
      element: lazy(
        () => import("../pages/store/storeProduct/StoreProductDetails")
      ),
      isPrivate: true,
      isAdmin: false,
      withoutSideBar: true,
    },
    {
      path: USER_NAVIGATION.checkoutProcess,
      element: lazy(() => import("../pages/store/checkOut/CheckOut")),
      isPrivate: true,
      isAdmin: false,
      withoutSideBar: true,
    },
    {
      path: USER_NAVIGATION.storePurchaseRequestDetail,
      element: lazy(
        () => import("../pages/store/purchaseRequest/PurchaseRequest")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storePurchaseRequestView,
      element: lazy(
        () =>
          import(
            "../pages/store/purchaseRequest/components/StorePurchaseReqView"
          )
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storePurchaseRequestAdd,
      element: lazy(
        () => import("../pages/store/purchaseRequest/AddPurchaseRequest")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storePurchaseRequestEdit,
      element: lazy(
        () => import("../pages/store/purchaseRequest/EditPurchaseRequest")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeSupportTicket,
      element: lazy(() => import("../pages/supportTicket/SupportTicket")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeSupportTicketView,
      element: lazy(
        () => import("../pages/supportTicket/components/SupportTicketView")
      ),
    },
    {
      path: USER_NAVIGATION.Branch,
      element: lazy(() => import("../pages/branch/Branch")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeChat,
      element: lazy(() => import("../pages/chat/chat")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storPurchaseHistoryList,
      element: lazy(
        () => import("../pages/store/purchaseHistory/PurchaseHistory")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storPurchaseHistoryOrderDetail,
      element: lazy(
        () =>
          import(
            "../pages/store/purchaseHistory/components/PurchaseHistoryOderDetail"
          )
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeNotification,
      element: lazy(() => import("../pages/notification/Notification")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.viewParticularChat,
      element: lazy(() => import("../pages/chat/chat")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.bankTransferOrder,
      element: lazy(
        () => import("../pages/store/bankTransfer/BankTransferOrder")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.ViewBankTransferOrder,
      element: lazy(
        () => import("../pages/store/bankTransfer/ViewBankTransferOrder")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.savedCard,
      element: lazy(() => import("../pages/store/savedCard/SavedCard")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeOrderReplacement,
      element: lazy(
        () => import("../pages/store/purchaseHistory/ReplacementsOrders")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeOrederReplacement,
      element: lazy(
        () =>
          import(
            "../pages/store/purchaseHistory/components/ReplacementOrderDetail"
          )
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeOrderRefund,
      element: lazy(
        () => import("../pages/store/purchaseHistory/RefundOrders")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.storeViewOrderRefund,
      element: lazy(
        () =>
          import("../pages/store/purchaseHistory/components/RefundOrderDetail")
      ),
      isPrivate: true,
      isAdmin: false,
    },
  ],
  supplierOwner: [
    {
      path: USER_NAVIGATION.dashboard,
      element: lazy(
        () => import("../pages/supplier/dashboard/SupplierDashboard")
      ),
      isPrivate: true,
      isAdmin: false,
    },

    {
      path: USER_NAVIGATION.manageProfile,
      element: lazy(() => import("../pages/manageProfile/ManageProfile")),
      isPrivate: true,
    },
    {
      path: USER_NAVIGATION.Staff,
      element: lazy(() => import("../pages/staff/Staff")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.StaffRoles,
      element: lazy(() => import("../pages/roles/staffRoles")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.AddRoles,
      element: lazy(
        () => import("../pages/roles/components/AddRolePermission")
      ),
      isPrivate: true,
      isAdmin: false,
    },

    {
      path: USER_NAVIGATION.EditRoles,
      element: lazy(
        () => import("../pages/roles/components/AddRolePermission")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.products,
      element: lazy(
        () => import("../pages/supplier/supplierProduct/SupplierProducts")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierAddProduct,
      element: lazy(
        () =>
          import(
            "../pages/supplier/supplierProduct/component/AddSupplierProducts"
          )
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierEditProduct,
      element: lazy(
        () =>
          import(
            "../pages/supplier/supplierProduct/component/EditSupplierProducts"
          )
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierOrderDetails,
      element: lazy(() => import("../pages/supplier/order/OrderDetails")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierViewOrderDetails,
      element: lazy(
        () => import("../pages/supplier/order/component/ViewOrderDetails")
      ),
      isPrivate: true,
      isAdmin: false,
      withoutSideBar: true,
    },
    {
      path: USER_NAVIGATION.supplierReplaceOrderDetail,
      element: lazy(
        () => import("../pages/supplier/order/ReplaceOrderDetails")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierReplaceViewOrderDetails,
      element: lazy(
        () =>
          import("../pages/supplier/order/component/ViewReplaceOrderDetails")
      ),
      isPrivate: true,
      isAdmin: false,
      withoutSideBar: true,
    },
    {
      path: USER_NAVIGATION.supplierPurchaseRequestListing,
      element: lazy(
        () => import("../pages/supplier/purchaseRequest/PurchaseRequest")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierPurchaseRequestView,
      element: lazy(
        () =>
          import(
            "../pages/supplier/purchaseRequest/component/ViewPurchaseRequest"
          )
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierSupportTicket,
      element: lazy(() => import("../pages/supportTicket/SupportTicket")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierSupportTicketView,
      element: lazy(
        () => import("../pages/supportTicket/components/SupportTicketView")
      ),
    },
    {
      path: USER_NAVIGATION.Branch,
      element: lazy(() => import("../pages/branch/Branch")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.ReviewRating,
      element: lazy(
        () => import("../pages/supplier/reviewRating/reviewRatingDetails")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.ViewReviewRating,
      element: lazy(
        () =>
          import("../pages/supplier/reviewRating/component/ViewReviewRating")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierChat,
      element: lazy(() => import("../pages/chat/chat")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierNotification,
      element: lazy(() => import("../pages/notification/Notification")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.viewParticularChat,
      element: lazy(() => import("../pages/chat/chat")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierOrderRefund,
      element: lazy(() => import("../pages/supplier/order/RefundOrderDetails")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierViewOrderRefund,
      element: lazy(
        () => import("../pages/supplier/order/component/ViewRefundOrderDetails")
      ),
      isPrivate: true,
      isAdmin: false,
      withoutSideBar: true,
    },
    {
      path: USER_NAVIGATION.supplierFinance,
      element: lazy(() => import("../pages/supplier/finance/Finance")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierFinancePdfview,
      element: lazy(
        () => import("../pages/supplier/finance/components/FinancePdf")
      ),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.supplierFinanceExcelview,
      element: lazy(
        () => import("../pages/supplier/finance/components/FinanceExcel")
      ),
      isPrivate: true,
      isAdmin: false,
    },
  ],
  staffMember: [
    {
      path: USER_NAVIGATION.dashboard,
      element: lazy(() => import("../pages/member/dashboard/Dashboard")),
      isPrivate: true,
      isAdmin: false,
    },
    {
      path: USER_NAVIGATION.manageProfile,
      element: lazy(() => import("../pages/manageProfile/ManageProfile")),
      isPrivate: true,
    },
    {
      path: USER_NAVIGATION.memberNotification,
      element: lazy(() => import("../pages/notification/Notification")),
      isPrivate: true,
    },
    {
      path: USER_NAVIGATION.viewParticularChat,
      element: lazy(() => import("../pages/chat/chat")),
      isPrivate: true,
    },
  ],
};
