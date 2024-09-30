// Local DB to preserve template data
import Branded from "@/types/branded.type";
import { Context, Effect, Layer } from "effect";
import { andThen } from "effect/Cause";
import { openDB, DBSchema, IDBPDatabase } from "idb";

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

type UpdaterArgs = {
  templateId: Branded.TemplateId;
  markup: string;
};

const makeLocalDB = Effect.promise(() =>
  openDB<InvoiceMarkup>("invoice-markup", 1, {
    upgrade(db) {
      const store = db.createObjectStore("invoice-markup", {
        keyPath: "templateId",
      });
      store.createIndex("by-id", "templateId");
    },
  }),
);

class LocalStore extends Context.Tag("LocalStore")<
  LocalStore,
  IDBPDatabase<InvoiceMarkup>
>() {}

const localStoreLive = Layer.effect(LocalStore, makeLocalDB);

const localMarkupGetterEffect = (templateId: Branded.TemplateId) =>
  LocalStore.pipe(
    Effect.andThen((db) =>
      db.getFromIndex("invoice-markup", "by-id", templateId),
    ),
    Effect.andThen((result) =>
      result
        ? Effect.succeed(result)
        : Effect.fail(new Error("No local draft found")),
    ),
    Effect.andThen((v) => v),
  );

const localMarkupUpdaterEffect = (args: UpdaterArgs) =>
  LocalStore.pipe(
    Effect.andThen((db) =>
      db.put("invoice-markup", {
        markup: args.markup,
        templateId: args.templateId,
        lastUpdated: Date.now(),
      }),
    ),
    Effect.andThen((result) =>
      result
        ? Effect.succeed(result)
        : Effect.fail(new Error("No local draft found")),
    ),
    Effect.andThen((v) => v),
  );

export const getLocalMarkup = (templateId: Branded.TemplateId) =>
  localMarkupGetterEffect(templateId).pipe(
    Effect.provide(localStoreLive),
    Effect.runPromise,
  );

export const saveLocalMarkup = (args: UpdaterArgs) =>
  localMarkupUpdaterEffect(args).pipe(
    Effect.provide(localStoreLive),
    Effect.runPromise,
  );
