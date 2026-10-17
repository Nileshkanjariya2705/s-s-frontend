export type SupplierPurchaseRequestQuoteCreate = {
  product_details: { offered_price?: string | undefined; quantity: string }[];
  charges: string | undefined;
  subtotal: number;
  grandtotal: number | undefined;
};

export type SinglePurchaseRequestProductType = {
  isPaid: boolean;
  product_details: {
    purchase_request_product_uuid: string;
    product_name: string;
    product_name_ar: string;
    product_name_ur: string;
    image: string;
    quantity: number;
    unit_of_measurement: string;
    requested_price: number;
    description: string;
    offered_price: string[];
    category_name: string;
    category_name_ar: string;
    category_name_ur: string;

    category_uuid: string;
    allow_other_brands: boolean;
    otherBrandsProduct: {
      label_en: string;
      label_ar: string;
      label_ur: string;
      featured_image: string;
      value: string;
    };
    supplierProductQuoteUuid: string;
  }[];
  quotes_accepted_upto: string;
  offer_for_entire_request: boolean;
  charges_and_total: number;
  supplierQuoteUuid: string;
  status: string;
  shipping_info: {
    uuid: string;
    user_uuid: null | string;
    branch_uuid: string;
    entity_info_uuid: null |string | string;
    entity_type: string;
    address: string;
    city: string;
    country: string;
    state: string;
    postal_code: number;
    phone: number;
    is_default: true;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
  };
};
interface Product {
  uuid: string;
  name_en: string;
  category_uuid: string;
  measurement_uuid: string;
  requested_price: number;
  requested_quantity: number;
  description: string;
  allow_other_brands: boolean;
  is_purchased: boolean;
  created_at: string;
  products: {
    uuid: string;
    name_en: string;
    category_uuid: string;
    measurement_uuid: string;
    category: {
      name: string;
      uuid: string;
    };
    measurement: {
      unit_name: string;
      uuid: string;
    };
  };
}

export type AllPurchaseRequestDataType = {
  date: string;
  product_name: string;
  quantity: string;
  requested_price: string;
  uom: string;
};
export type selectedTabType = "OPEN" | "QUOTED" | "CLOSED";
export type QuoteTabType = "ACTIVE" | "REJECTED";
export interface MyObjectType {
  [key: string]: number; // This is the index signature
}
interface Product {
  name_en: string;
  name_ar: string;
  name_ur: string;
  description_en: string;
  description_ar: string;
  description_ur: string;
  uuid: string;
  category: {
    name: string;
    uuid: string;
  };
  measurement: {
    unit_name: string;
    unit_name_ar: string;
    unit_name_ur: string;
    uuid: string;
  };
  featured_image: string;
}

interface PurchaseRequestProduct {
  uuid: string;
  purchase_request_uuid: string;
  product_uuid: string;
  category_uuid: string;
  requested_price: number;
  requested_quantity: number;
  allow_other_brands: boolean;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  products: Product;
}

export interface openPurchaseRequest {
  offer_for_entire_request: boolean;
  uuid: string;
  created_at: string;
  quotes_accepted_upto: string;
  PurchaseRequestProducts: PurchaseRequestProduct[];
}
export interface quotedPurchaseRequest {
  created_at: string;
  offer_for_entire_request: boolean;
  uuid: string;
  quotes_accepted_upto: string;
  supplier_quote: SupplierQuote[];
}

export interface SupplierQuote {
  payment_method: string;
  charges_and_total: number;
  uuid: string;
  supplier_product_quotes: SupplierProductQuote[];
}

interface SupplierProductQuote {
  other_brand_product_uuid: string | null;
  offered_price: number;
  offered_quantity: number;
  is_approved: null | any;
  purchase_request_products_uuid: string;
  otherBrandProduct: Product;
  ProductPurchaseRequests: PurchaseRequestProduct;
}

export type viewState = {
  [purchase_request_product_uuid: string]: true | false;
};

export type otherBrandsProductType = {
  // [key: string]: string;
  label?: string;
  value: string;
  featured_image: string;
  label_en: string;
  label_ar: string;
  label_ur: string;
};

export type supplierPurchaseRequestView = {
  purchase_request_product_uuid: string;
  unit_of_measurement_en: string;
  unit_of_measurement_ar: string;
  unit_of_measurement_ur: string;
  product_name: string;
  image: string;
  quantity: number;
  unit_of_measurement: string;
  requested_price: number;
  description: string;
  offered_price: string[];
  category_name: string;
  category_name_ar: string;
  category_name_ur: string;
  product_name_ar: string;
  product_name_ur: string;
  category_uuid: string;
  allow_other_brands: boolean;
  otherBrandsProduct: {
    label_en: string;
    label_ar: string;
    label_ur: string;
    featured_image: string;
    value: string;
  };
  supplierProductQuoteUuid: string;
};

export type searchFilterType = {
  purchaseReqId: string | undefined;
  date: string[] | undefined;
  quantity: string | undefined;
  price: string | undefined;
};
