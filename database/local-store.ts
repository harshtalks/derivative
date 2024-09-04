// Local DB to preserve template data
import Branded from "@/types/branded.type";
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
export const localStore = async () =>
  await openDB<InvoiceMarkup>("invoice-markup", 1, {
    upgrade(db) {
      const store = db.createObjectStore("invoice-markup", {
        keyPath: "templateId",
      });
      store.createIndex("by-id", "templateId");
    },
  });

export const getDraft = async (templateId: Branded.TemplateId) => {
  try {
    const db = await localStore();
    const output = await db.getFromIndex("invoice-markup", "by-id", templateId);
    if (!output) {
      return null;
    }

    return output;
  } catch (e) {
    return null;
  }
};

export const updateDraft = async (
  templateId: Branded.TemplateId,
  markup: string,
  fontFamily: string,
) => {
  try {
    const result = (await localStore()).put("invoice-markup", {
      fontFamily: fontFamily,
      markup: markup,
      templateId: templateId,
      lastUpdated: Date.now(),
    });

    return result;
  } catch {
    return null;
  }
};
