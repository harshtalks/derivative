// Local DB to preserve template data
import Branded from "@/types/branded.type";
import { Effect } from "effect";
import { openDB, DBSchema } from "idb";

export interface InvoiceMarkup extends DBSchema {
  "invoice-markup": {
    value: {
      templateId: string;
      markup: string;
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

export const getLocalDraft = async (templateId: Branded.TemplateId) => {
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

export const updateLocalDraft = async (
  templateId: Branded.TemplateId,
  markup: string,
) => {
  try {
    const result = (await localStore()).put("invoice-markup", {
      markup: markup,
      templateId: templateId,
      lastUpdated: Date.now(),
    });

    return result;
  } catch {
    return null;
  }
};

export const getLocalMarkup = (templateId: Branded.TemplateId) =>
  Effect.promise(() => getLocalDraft(templateId)).pipe(
    Effect.map((value) =>
      value
        ? Effect.succeed(value)
        : Effect.fail(new Error("No local draft found")),
    ),
    Effect.flatMap((v) => v),
    Effect.runPromise,
  );
