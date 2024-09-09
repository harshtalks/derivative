import { JSONSchema7 } from "json-schema";

class JSchema<T extends {}> {
  // our json
  #json: T;
  // our schema
  #schema: JSONSchema7;

  constructor(json: T) {
    this.#json = json;
    this.#schema = {} as JSONSchema7;
  }

  assertValidObject() {
    const stringified = JSON.stringify(this.#json);
    JSON.parse(stringified);
    return this;
  }

  applyConstraints(constraints: { noTopLevelArray?: boolean }) {
    if (constraints.noTopLevelArray) {
      if (Array.isArray(this.#json)) {
        throw new Error("Top level array is not allowed");
      }
    }

    return this;
  }

  generateSchema<O extends {}, Level extends "top" | "nested">(
    json: O,
    level: Level,
    schema: JSONSchema7,
    meta?: Level extends "top"
      ? {
          description?: string;
          title?: string;
        }
      : never,
  ) {
    if (level === "top") {
      schema.$schema = "http://json-schema.org/draft-07/schema#";
    }

    if (level === "top" && !!meta) {
      if (!!meta.description) {
        schema.description = meta.description;
      }

      if (!!meta.title) {
        schema.title = meta.title;
      }
    }

    schema.type = "object";
    schema.properties = {};

    for (const key in json) {
      const valueOfKey = json[key];
      switch (typeof valueOfKey) {
        case "string":
          schema.properties[key] = { type: "string" };
          break;
        case "number":
          schema.properties[key] = { type: "number" };
          break;
        case "boolean":
          schema.properties[key] = { type: "boolean" };
          break;
        case "object": {
          // if object is an array
          if (Array.isArray(valueOfKey)) {
            schema.properties[key] = {
              items: {},
              type: "array",
            };

            this.generateSchema(
              valueOfKey[0],
              "nested",
              (schema.properties[key] as JSONSchema7).items as JSONSchema7,
            );
          }
          // if object is an object
          else {
            if (valueOfKey) {
              schema.properties[key] = { type: "object" };
              this.generateSchema(
                valueOfKey,
                "nested",
                schema.properties[key] as JSONSchema7,
              );
            }
          }
        }
      }
    }

    schema.required = Object.keys(schema.properties);

    return schema;
  }

  createSchema(args?: { description?: string; title?: string }) {
    this.generateSchema(this.#json, "top", this.#schema, {
      description: args?.description,
      title: args?.title,
    });
    return this;
  }

  getSchema() {
    return this.#schema;
  }

  getJson() {
    return this.#json;
  }
}

export default JSchema;
