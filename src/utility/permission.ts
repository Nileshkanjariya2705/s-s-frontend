import { USER_NAVIGATION } from "constant/navigation.constant";
import { lazy } from "react";
import { userRoutes } from "routing/routes";
import { RouteInterface, SidebarType } from "types/generalTypes";

export const getMemberRoutes = (
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[],
  entity_type: string
) => {
  const filterViewPermission =
    given_permissions &&
    given_permissions.filter((data) => data?.granted === true);
  let getPermissionRoutes: RouteInterface[] = [];
  filterViewPermission?.length > 0 &&
    filterViewPermission &&
    filterViewPermission.forEach((item) => {
      if (item?.name.includes("staff") && item.granted) {
        getPermissionRoutes.push(
          {
            path: USER_NAVIGATION.Staff,
            element: lazy(() => import("../pages/staff/Staff")),
            isPrivate: true,
            isAdmin: false,
            withoutSideBar: false,
          },
          {
            path: USER_NAVIGATION.StaffRoles,
            element: lazy(() => import("../pages/roles/staffRoles")),
            isPrivate: true,
            isAdmin: false,
            withoutSideBar: false,
          },
          {
            path: USER_NAVIGATION.Branch,
            element: lazy(() => import("../pages/branch/Branch")),
            isPrivate: true,
            isAdmin: false,
            withoutSideBar: false,
          },
          {
            path: USER_NAVIGATION.AddRoles,
            element: lazy(
              () => import("../pages/roles/components/AddRolePermission")
            ),
            isPrivate: true,
            isAdmin: false,
            withoutSideBar: false,
          }
        );
      } else if (item?.name.includes("Branches") && item.granted) {
        getPermissionRoutes.push({
          path: USER_NAVIGATION.Branch,
          element: lazy(() => import("../pages/branch/Branch")),
          isPrivate: true,
          isAdmin: false,
          withoutSideBar: false,
        });
      } else if (item?.name.includes("support tickets") && item.granted) {
        getPermissionRoutes.push(
          {
            path: USER_NAVIGATION.supplierSupportTicket,
            element: lazy(() => import("../pages/supportTicket/SupportTicket")),
            isPrivate: true,
            isAdmin: false,
            withoutSideBar: false,
          },
          {
            path: USER_NAVIGATION.supplierSupportTicketView,
            element: lazy(
              () =>
                import("../pages/supportTicket/components/SupportTicketView")
            ),
            isPrivate: true,
            withoutSideBar: false,
          }
        );
      } else if (item?.name.includes("chat") && item.granted) {
        getPermissionRoutes.push({
          path: USER_NAVIGATION.storeChat,
          element: lazy(() => import("../pages/chat/chat")),
          isPrivate: true,
          isAdmin: false,
          withoutSideBar: false,
        });
      } else if (
        item?.name.includes("Create Purchase Request") &&
        item.granted
      ) {
        getPermissionRoutes.push({
          path: USER_NAVIGATION.storePurchaseRequestAdd,
          element: lazy(
            () => import("../pages/store/purchaseRequest/AddPurchaseRequest")
          ),
          isPrivate: true,
          isAdmin: false,
          withoutSideBar: false,
        });
      } else if (item?.name.includes("Checkout Quote") && item.granted) {
        getPermissionRoutes.push({
          path: USER_NAVIGATION.checkoutProcess,
          element: lazy(() => import("../pages/store/checkOut/CheckOut")),
          isPrivate: true,
          isAdmin: false,
          withoutSideBar: true,
        });
      } else if (
        item?.name.includes("Track Purchase Request") &&
        item.granted
      ) {
        getPermissionRoutes.push(
          {
            path: USER_NAVIGATION.storePurchaseRequestView,
            withoutSideBar: false,
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
            path: USER_NAVIGATION.storePurchaseRequestEdit,
            element: lazy(
              () => import("../pages/store/purchaseRequest/EditPurchaseRequest")
            ),
            isPrivate: true,
            withoutSideBar: false,
            isAdmin: false,
          },
          {
            path: USER_NAVIGATION.storePurchaseRequestDetail,
            withoutSideBar: false,
            element: lazy(
              () => import("../pages/store/purchaseRequest/PurchaseRequest")
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
            path: USER_NAVIGATION.storeProductDetail,
            element: lazy(
              () => import("../pages/store/storeProduct/StoreProductDetails")
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
          }
        );
      } else if (item?.name.includes("View All Products") && item.granted) {
        getPermissionRoutes.push({
          path: USER_NAVIGATION.products,
          element: lazy(
            () => import("../pages/supplier/supplierProduct/SupplierProducts")
          ),
          isPrivate: true,
          isAdmin: false,
          withoutSideBar: false,
        });
      } else if (item?.name.includes("Add Products") && item.granted) {
        getPermissionRoutes.push({
          path: USER_NAVIGATION.supplierAddProduct,
          element: lazy(
            () =>
              import(
                "../pages/supplier/supplierProduct/component/AddSupplierProducts"
              )
          ),
          isPrivate: true,
          isAdmin: false,
          withoutSideBar: false,
        });
      } else if (item?.name.includes("Edit Products") && item.granted) {
        getPermissionRoutes.push({
          path: USER_NAVIGATION.supplierEditProduct,
          element: lazy(
            () =>
              import(
                "../pages/supplier/supplierProduct/component/EditSupplierProducts"
              )
          ),
          isPrivate: true,
          isAdmin: false,
          withoutSideBar: false,
        });
      } else if (
        item?.name.includes("View Orders") &&
        item.granted &&
        entity_type === "SUPPLIER"
      ) {
        getPermissionRoutes.push(
          {
            path: USER_NAVIGATION.supplierOrderDetails,
            element: lazy(() => import("../pages/supplier/order/OrderDetails")),
            withoutSideBar: false,
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
          }
        );
      } else if (
        item?.name.includes("Manage Products Req") &&
        item.granted &&
        entity_type === "SUPPLIER"
      ) {
        getPermissionRoutes.push(
          {
            path: USER_NAVIGATION.supplierPurchaseRequestListing,
            element: lazy(
              () => import("../pages/supplier/purchaseRequest/PurchaseRequest")
            ),
            isPrivate: true,
            isAdmin: false,
            withoutSideBar: false,
          },
          {
            path: USER_NAVIGATION.supplierPurchaseRequestView,
            element: lazy(
              () =>
                import(
                  "../pages/supplier/purchaseRequest/component/ViewPurchaseRequest"
                )
            ),
            withoutSideBar: false,
            isPrivate: true,
            isAdmin: false,
          }
        );
      }
    });
  if (entity_type === "STORE") {
    getPermissionRoutes.push(
      {
        path: USER_NAVIGATION.storPurchaseHistoryList,
        element: lazy(
          () => import("../pages/store/purchaseHistory/PurchaseHistory")
        ),
        isPrivate: true,
        isAdmin: false,
        withoutSideBar: false,
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
        withoutSideBar: false,
      },
      {
        path: USER_NAVIGATION.storeNotification,
        element: lazy(() => import("../pages/notification/Notification")),
        isPrivate: true,
        isAdmin: false,
        withoutSideBar: false,
      },
      {
        path: USER_NAVIGATION.bankTransferOrder,
        element: lazy(
          () => import("../pages/store/bankTransfer/BankTransferOrder")
        ),
        isPrivate: true,
        isAdmin: false,
        withoutSideBar: false,
      },
      {
        path: USER_NAVIGATION.ViewBankTransferOrder,
        element: lazy(
          () => import("../pages/store/bankTransfer/ViewBankTransferOrder")
        ),
        isPrivate: true,
        isAdmin: false,
        withoutSideBar: false,
      }
    );
  } else {
    getPermissionRoutes.push(
      {
        path: USER_NAVIGATION.supplierNotification,
        element: lazy(() => import("../pages/notification/Notification")),
        isPrivate: true,
        isAdmin: false,
        withoutSideBar: false,
      },
      {
        path: USER_NAVIGATION.ReviewRating,
        element: lazy(
          () => import("../pages/supplier/reviewRating/reviewRatingDetails")
        ),
        isPrivate: true,
        isAdmin: false,
        withoutSideBar: false,
      },
      {
        path: USER_NAVIGATION.ViewReviewRating,
        element: lazy(
          () =>
            import("../pages/supplier/reviewRating/component/ViewReviewRating")
        ),
        isPrivate: true,
        isAdmin: false,
        withoutSideBar: false,
      }
    );
  }

  return [...getPermissionRoutes, ...userRoutes.staffMember];
};

export const getMemberSidebar = (
  filterViewPermission: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[],
  entity_type: string
) => {
  let getPermissionSidebarSet: SidebarType[] = [];
  if (entity_type === "STORE") {
    getPermissionSidebarSet.push({
      name: "Purchase_History",
      icon: "icon-purchase-history",
      path: "/purchase-history",
    });
    getPermissionSidebarSet.push({
      name: "Bank Transfer",
      icon: "icon-measurement",
      path: "/bank-transfer-order",
    });
  } else {
    getPermissionSidebarSet.push({
      name: "Review Rating",
      icon: "icon-feedback",
      path: "/ratings",
    });
  }
  filterViewPermission.forEach((item) => {
    if (item?.name.includes("View All staff") && item.granted) {
      getPermissionSidebarSet.push({
        name: "Staff",
        icon: "icon-staff",
        path: "/staff",
        subitems: [
          {
            name: "All staff",
            icon: "icon-staff",
            path: "/staff",
          },
          {
            name: "All roles",
            icon: "icon-staff",
            path: "/roles",
          },
        ],
      });
    } else if (item?.name.includes("View All Branches") && item.granted) {
      getPermissionSidebarSet.push({
        name: "Branches",
        icon: "icon-branches",
        path: "/branches",
      });
    } else if (
      item?.name.includes("View All support tickets") &&
      item.granted
    ) {
      getPermissionSidebarSet.push({
        name: "Support Ticket",
        icon: "icon-support-ticket",
        path: "/support-ticket",
      });
    } else if (item?.name.includes("chat") && item.granted) {
      getPermissionSidebarSet.push({
        name: "Chat",
        icon: "icon-chat",
        path: "/chat",
      });
    } else if (item?.name.includes("Track Purchase Request") && item.granted) {
      getPermissionSidebarSet.push({
        name: "Purchase Request",
        icon: "icon-purchase-request",
        path: "/purchase-request",
      });
    } else if (item?.name.includes("View All Products") && item.granted) {
      getPermissionSidebarSet.push({
        name: "Products",
        icon: "icon-product-detail",
        path: "/products",
      });
    } else if (
      item?.name.includes("View Orders") &&
      item.granted &&
      entity_type === "SUPPLIER"
    ) {
      getPermissionSidebarSet.push({
        name: "Orders",
        icon: "icon-orders",
        path: "/orders",
      });
    } else if (
      item?.name.includes("Manage Products Req") &&
      item.granted &&
      entity_type === "SUPPLIER"
    ) {
      getPermissionSidebarSet.push({
        name: "Purchase Request",
        icon: "icon-purchase-request",
        path: "/purchase-request",
      });
    }
  });
  return getPermissionSidebarSet;
};
