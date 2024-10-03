import { Editor, type JSONContent } from "@tiptap/react";
import { deepKeys } from "deeks";
import { get } from "lodash";

type NestedObject = {
  [k: string]: any;
};

class Schema {
  #editor: Editor;
  #json: NestedObject;
  #keys: string[];
  #indexedKeysRecord: Record<string, string[]> = {};

  constructor(
    editor: Editor,
    { json, keys }: { json: NestedObject; keys: string[] },
  ) {
    this.#editor = editor;
    this.#json = json;
    this.#keys = keys;
  }

  get content() {
    return this.filterContent();
  }

  private filterContent() {
    // find all the bullet points in the editor
    const content = this.#editor.getJSON();

    // dealing with the orderedList first

    return {
      ...content,
      content: content.content?.map((node) => {
        if (node.type === "orderedList") {
          // check if node has a text node
          return;
        } else {
          return node;
        }
      }),
    };
  }

  private updateArrayKeys() {
    const keysWithIndexes = deepKeys(this.#json, {
      expandArrayObjects: true,
      arrayIndexesAsKeys: true,
    });

    // remove all the numbers with the following . from a string
    const numRemover = (str: string) => str.replace(/\.\d+/g, "");
    // filter keys that have numbers in them
    const filteredKeys = keysWithIndexes.filter((k) => k.match(/\d+/));

    for (const key of this.#keys) {
      const foundSomeKeys = filteredKeys
        .map((k) => (numRemover(k) === key ? k : null))
        .filter((v): v is string => v !== null);

      if (foundSomeKeys.length) {
        this.#indexedKeysRecord[key] = foundSomeKeys;
      }
    }

    return this;
  }
}

export default Schema;
