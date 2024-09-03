// Local DB to preserve template data
import { openDB, DBSchema } from "idb";

interface InvoiceMarkup extends DBSchema {
  "invoice-markup": {
    value: {
      templateId: string;
      markup: string;
      fontFamily: string;
      lastUpdated: number;
    };
    key: string;
    indexes: { "by-id": string };
  };
}

// Open the local store
export const localStore = openDB<InvoiceMarkup>("invoice-markup", 0.1, {
  upgrade(db) {
    const store = db.createObjectStore("invoice-markup", {
      keyPath: "templateId",
    });
    store.createIndex("by-id", "templateId");
  },
});
