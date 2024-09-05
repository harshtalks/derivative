export const invoiceCategories = {
  "Sales Invoices": {
    name: "Sales Invoices",
    subcategories: [
      "Product Sales",
      "Service Sales",
      "Subscription Sales",
      "Custom Orders",
    ],
  },
  "Expense Invoices": {
    name: "Expense Invoices",
    subcategories: [
      "Vendor Purchases",
      "Utility Bills",
      "Rent/Lease Payments",
      "Equipment Maintenance",
    ],
  },
  "Recurring Invoices": {
    name: "Recurring Invoices",
    subcategories: [
      "Monthly Subscriptions",
      "Quarterly Fees",
      "Annual Contracts",
      "Retainer Agreements",
    ],
  },
  "Project-based Invoices": {
    name: "Project-based Invoices",
    subcategories: [
      "Milestone Payments",
      "Time and Materials",
      "Fixed Price Projects",
      "Change Orders",
    ],
  },
  "Internal Invoices": {
    name: "Internal Invoices",
    subcategories: [
      "Interdepartmental Charges",
      "Subsidiary Billing",
      "Cost Allocations",
      "Transfer Pricing",
    ],
  },
} as const;

export namespace Invoice {
  export type Keys = keyof typeof invoiceCategories;

  export const getSubCategory = (key: Keys) => {
    return invoiceCategories[key].subcategories;
  };

  export const getCategory = (key: Keys) => {
    return invoiceCategories[key].name;
  };

  export const getKeys = () => Object.keys(invoiceCategories) as Keys[];
}
