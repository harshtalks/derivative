export const invoiceCategories = {
  salesInvoices: {
    name: "Sales Invoices",
    subcategories: [
      "Product Sales",
      "Service Sales",
      "Subscription Sales",
      "Custom Orders",
    ],
  },
  expenseInvoices: {
    name: "Expense Invoices",
    subcategories: [
      "Vendor Purchases",
      "Utility Bills",
      "Rent/Lease Payments",
      "Equipment Maintenance",
    ],
  },
  recurringInvoices: {
    name: "Recurring Invoices",
    subcategories: [
      "Monthly Subscriptions",
      "Quarterly Fees",
      "Annual Contracts",
      "Retainer Agreements",
    ],
  },
  projectBasedInvoices: {
    name: "Project-based Invoices",
    subcategories: [
      "Milestone Payments",
      "Time and Materials",
      "Fixed Price Projects",
      "Change Orders",
    ],
  },
  internalInvoices: {
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
