export type PurchaseRequestListingType = {
    request_expiry: string
    status: string
    sub_total: string
}

export type PurchaseRequestTableType = {
    sr_no?: string
    request_expiry: string
    sub_total: string
    status: string
}

export type PurchaseRequestViewTableType = {
    supplier_id: string
    all_product_name: string[] | undefined
    all_offered_price: string[] | undefined
    all_category_name: string[] | undefined
    category: string | undefined
    offered_price: string | undefined | number
    product: string | undefined
}

export type productImage = {
    product_images: File[] | undefined | []
}

export type PrSearchFilterType ={
    expiry_date: string[] | undefined,
    status:string | undefined,
    purchaseRequest_uuid: string | undefined,
    hasOffers: string | undefined,
}
export interface ProductDetail {
    category: string
    product: string
    images?: (File | undefined | object)[]
    unit_of_measurement: string
    quantity: string
    requested_price: string
    other_brands_allowed?: boolean
    description: string
    subtotal?: string
}

export interface PurchaseReqType {
    expiry_date: string
    offer_for_entire_request: boolean
    address_uuid:string ,
    product_details: ProductDetail[] | undefined | any[]
    [key: string]: any
}

// export interface purchaseRequestViewType {
//   productReq: string;
//   requested_date: string;
//   requested_expiry: string;
//   requested_status: string;
//   subTotal: string;
//   totalQuotes: string;
//   requestTableData: requestTableData[] | undefined;
// }

export type requestTableData = {
    supplier_id: string
    all_product_name: string[] | undefined
    all_offered_price: string[] | undefined
    all_category_name: string[] | undefined
    category: string | undefined
    offered_price: string | undefined | number
    product: string | undefined
    requestTableData: []
    offered_quantity: string | undefined
    all_offered_quantity: string[] | undefined
}

export type requestData = {
  created_at: string;
  quotes_accepted_upto: string;
  status: string;
  total_price: string;
  supplier_quote: { uuid: string, charges:number }[];
  PurchaseRequestProducts: { uuid: string }[];
  is_closed: boolean;
};

export type checkOutDataType = {
  supplier_info_uuid: string;
};

export type purchaseRequestType = {
    uuid: string
    charges:number,
    charges_and_total: number
    supplier_info_uuid: string
    supplier_product_quotes: supplierProductQuotesType[]
    tab: string
    totalPrd: number
    is_purchased: number
}

// export type supplierProductQuotesType = {
//   offered_price: number;
//   offered_quantity: number;
//   otherBrandProduct: { name: string; category: { name: string } } | null;
//   ProductPurchaseRequests: {
//     uuid: string;
//     requested_quantity: string;
//     products: { name_en: string; category: { name: string } };
//   };
// };
// export type ProductImageState = {
//   [index: number]: any;
// };
export type supplierProductInfo = {
    purchase_request_uuid: string
    supplier_product_quotes: supplierProductQuotesType[]
}
export type supplierProductQuotesType = {
    offered_price: number
    offered_quantity: number
    otherBrandProduct: { name: string; category: { name: string } } | null
    ProductPurchaseRequests: {
        uuid: string
        requested_quantity: string
        products: { name_en: string; category: { name: string }; measurement:{unit_name:string} }
    }
}
export type ProductImageState = {
    [index: number]: any
}
export type productData = {
    [key: string]: [{ name: string; value: string }]
}
