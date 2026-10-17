export type DropdownOptionType = {
  value: string | boolean;
  label?: string;
  isdisabled?: boolean;
}[];

export const purchaseRequestStatauses = [
  {
    value: "QUOTED",
    label: "QUOTED",
  },
  {
    value: "NEW",
    label: "NEW",
  },
  {
    value: "COMPLETED",
    label: "COMPLETED",
  },
  {
    value: "EXPIRED",
    label: "EXPIRED",
  },
];

export const ratingOptions = [
  {
    name: "1",
    value: "1",
    label: "1",
  },
  {
    name: "2",
    value: "2",
    label: "2",
  },
  {
    name: "3",
    value: "3",
    label: "3",
  },
  {
    name: "4",
    value: "4",
    label: "4",
  },
  {
    name: "5",
    value: "5",
    label: "5",
  },
];
export const slugOptions = [
  {
    name: "Home",
  },
  {
    name: "About",
  },
  {
    name: "Contact",
  },
];
export const supportTicketOptions = (lang: string): { value: string; label: string }[] | undefined => {
  if (lang === "en") {
    return [
      {
        value: "OPEN",
        label: "Open",
      },
      {
        value: "NEW",
        label: "New",
      },
      {
        value: "CLOSED",
        label: "Closed",
      },
    ];
  }
  if (lang === "ar") {
    return [
      {
        value: "OPEN",
        label: "مفتوح",
      },
      {
        value: "NEW",
        label: "جديد",
      },
      {
        value: "CLOSED",
        label: "مغلق",
      },
    ];
  }
  if (lang === "ur") {
    return [
      {
        value: "OPEN",
        label: "کھلا",
      },
      {
        value: "NEW",
        label: "نیا",
      },
      {
        value: "CLOSED",
        label: "بند",
      },
    ];
  }
};


export const statusDropdown = (
  lang: string
): { name: string; value: string; label: string }[] | undefined => {
  if (lang === "en") {
    return [
      {
        name: "active",
        value: "ACTIVE",
        label: "Active",
      },
      {
        name: "inactive",
        value: "INACTIVE",
        label: "Inactive",
      },
    ];
  }
  if (lang === "ar") {
    return [
      {
        name: "active",
        value: "ACTIVE",
        label: "نشط",
      },
      {
        name: "inactive",
        value: "INACTIVE",
        label: "غير نشط",
      },
    ];
  }
  if (lang === "ur") {
    return [
      {
        name: "active",
        value: "ACTIVE",
        label: "فعال",
      },
      {
        name: "inactive",
        value: "INACTIVE",
        label: "غیر فعال",
      },
    ];
  }
};

export const OrderStatus = (
  lang: string
): { label: string; value: string; isdisabled: boolean }[] | undefined => {
  if (lang === "en") {
    return [
      { label: "PENDING", value: "PENDING", isdisabled: false },
      { label: "ACCEPTED", value: "ACCEPTED", isdisabled: false },
      { label: "PACKAGED", value: "PACKAGED", isdisabled: false },
      {
        label: "IN_TRANSIT".replace("_", " "),
        value: "IN_TRANSIT",
        isdisabled: false,
      },
      { label: "DELIVERED", value: "DELIVERED", isdisabled: false },
      { label: "CANCELLED", value: "CANCELLED", isdisabled: false },
      { label: "PAID", value: "PAID", isdisabled: false },
    ];
  }
  if (lang === "ur") {
    return [
      { label: "زیر التواء", value: "PENDING", isdisabled: false },
      { label: "قبول شدہ", value: "ACCEPTED", isdisabled: false },
      { label: "پیک کیا گیا", value: "PACKAGED", isdisabled: false },
      { label: "منتقلی میں", value: "IN_TRANSIT", isdisabled: false },
      { label: "پہنچا دیا گیا", value: "DELIVERED", isdisabled: false },
      { label: "منسوخ", value: "CANCELLED", isdisabled: false },
      { label: "ادا شدہ", value: "PAID", isdisabled: false },
    ];
  }
  if (lang === "ar") {
    return [
      { label: "قيد الانتظار", value: "PENDING", isdisabled: false },
      { label: "تم القبول", value: "ACCEPTED", isdisabled: false },
      { label: "تم التغليف", value: "PACKAGED", isdisabled: false },
      { label: "في النقل", value: "IN_TRANSIT", isdisabled: false },
      { label: "تم التوصيل", value: "DELIVERED", isdisabled: false },
      { label: "ألغيت", value: "CANCELLED", isdisabled: false },
      { label: "مدفوع", value: "PAID", isdisabled: false },
    ];
  }
};

export const EntityStatusDropdown = (lang: string) => {
  if (lang === "en") {
    return [
      {
        value: "true",
        label: "Active",
      },
      {
        value: "false",
        label: "Inactive",
      },
    ];
  }
  if (lang === "ar") {
    return [
      {
        value: "true",
        label: "نشط",
      },
      {
        value: "false",
        label: "غير نشط",
      },
    ];
  }
  if (lang === "ur") {
    return [
      {
        value: "true",
        label: "فعال",
      },
      {
        value: "false",
        label: "غیر فعال",
      },
    ];
  }
};

export const hasOffersDropdown = (lang: string) => {
  if (lang === "en") {
    return [
      {
        value: "YES",
        label: "Yes",
      },
      {
        value: "NO",
        label: "No",
      },
    ];
  }
  if (lang === "ar") {
    return [
      {
        value: "YES",
        label: "نعم",
      },
      {
        value: "NO",
        label: "لا",
      },
    ];
  }
  if (lang === "ur") {
    return [
      {
        value: "YES",
        label: "جی ہاں",
      },
      {
        value: "NO",
        label: "نہیں",
      },
    ];
  }
};
