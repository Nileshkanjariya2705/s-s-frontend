export type SelectedProductProps = {
  disableTab?: DisableTabType;
  setTab: (tab: number) => void;
  setDisableTab: React.Dispatch<React.SetStateAction<DisableTabType>>;
  chargeId?: string;
  setChargeId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  orderDetail:orderDetail
  setOrderDetial?: React.Dispatch<React.SetStateAction<orderDetail>>;
};
// export interface postionType {
//     "tab_1":{ visited:boolean, address:AddressResponse | undefined };
//     "tab_2":{ visited:boolean, address:AddressResponse | undefined};
//     "tab_3":{ visited:boolean, address:AddressResponse | undefined}
//     "tab_4":{ visited:boolean, address:AddressResponse | undefined}
//   }
export type DisableTabType = {
  selectedProductsFlag: number;
  shippingFlag: number;
  paymentFlag: number;
  confirmationFlag: number;
};

export interface PaymentInfo {
  payment_mode: string;
  payment_message: string;
  uuid: string;
  order_id: string;
  payment_status: string;
  payment_method_type: string;
  amount: number;
  charge_id?: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export type orderDetail = {
  mode: string;
  payment_status: string;
  order_uuid: string;
  address_uuid:string | null;
  orderProductDetails:any
  order_status:string
  payment_details?:PaymentInfo
};
export interface PaymentDetails {
  email: string;
  order_date: string;
  name: string;
  amount: number;
  payment_status: string;
  save_card: boolean;
  customer_id: string;
  card_id: string;
  card_name: string;
  address: {
    address: {
      address: string;
      city: string;
      country: string;
      postal_code: string;
      state: string;
    };
    uuid: string;
  };
}
export interface PaymentResultResponse {
  payment_mode: string;
  payment_message: string;
  uuid: string;
  order_id: string;
  payment_status: string;
  payment_method_type: string;
  amount: 9765;
  charge_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

interface ProductPurchaseRequests {
  uuid: string;
  purchase_request_uuid: string;
  product_uuid: string;
  category_uuid: string;
  requested_price: number;
  requested_quantity: number;
  allow_other_brands: boolean;
  is_purchased: boolean;
  products: {
    featured_image: string;
    uuid: string;
    name_en: string;
    name_ar: string;
    name_ur: string;

    category_uuid: string;
    measurement_uuid: string;
    category: {
      name: string;
      uuid: string;
    };
    measurement: {
      unit_name: string;
    };
  };
}

interface SupplierProductQuotes {
  other_brand_product_uuid: string | null;
  offered_price: number;
  offered_quantity: number;
  is_approved: boolean | null;
  purchase_request_products_uuid: string;
  otherBrandProduct: any;
  ProductPurchaseRequests: ProductPurchaseRequests;
  SupplierQuotes: SupplierQuotes;
}

export interface PurchaseReqOrdType {
  uuid: string;
  order_id: string;
  quote_id: string;
  price: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  supplierProductQuotes: SupplierProductQuotes;
}

export interface PayableAmountType {
  subtotal: number;
  charges: number;
  vatPercent: number;
  grandTotal: number;
}

interface SupplierQuotes {
  charges_and_total: number;
}

export interface ReviewsAndRating {
  reviews: string;
}

export interface Reviews {
  reviews: string | undefined;
}

export interface BankTransferType {
  bank_receipt: File[] | undefined;
}

export interface ReviewAndRatingtype {
  rating: number;
  reviews: string;
}

export interface ConfirmationReviews {
  reviews: string | undefined | null;
}
export interface address {
  address: string;
  city: string;
  country: string;
  postal_code: string;
  state: string;
}
export interface replacementProduct {
  replace_product: {
    product: string;
    reason: string;
  }[];
}
export interface refundProduct {
  refund_product: {
    product: string;
    reason: string;
  }[];
}
export interface AddressResponse {
  uuid: string;
  user_uuid: string | null;
  branch_uuid: string;
  entity_info_uuid: string;
  entity_type: string;
  address: string;
  city: string;
  country: string;
  state: string;
  postal_code: number;
  phone: number;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface BranchDropdown {
  value: string;
  label: string;
}
