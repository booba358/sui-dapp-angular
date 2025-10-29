import {
  DataLoader,
  MOVE_STDLIB_ADDRESS,
  SUI_FRAMEWORK_ADDRESS,
  SUI_TYPE_ARG,
  TypeTagSerializer,
  blake2b,
  chunk,
  fromBase64,
  isSerializedBcs,
  isValidNamedPackage,
  isValidNamedType,
  isValidSuiAddress,
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
  parseStructTag,
  pureBcsSchemaFromTypeName,
  suiBcs,
  toBase58,
  toBase64
} from "./chunk-CIEEBTQY.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@mysten/sui/dist/esm/transactions/serializer.js
var OBJECT_MODULE_NAME = "object";
var ID_STRUCT_NAME = "ID";
var STD_ASCII_MODULE_NAME = "ascii";
var STD_ASCII_STRUCT_NAME = "String";
var STD_UTF8_MODULE_NAME = "string";
var STD_UTF8_STRUCT_NAME = "String";
var STD_OPTION_MODULE_NAME = "option";
var STD_OPTION_STRUCT_NAME = "Option";
function isTxContext(param) {
  const struct = typeof param.body === "object" && "datatype" in param.body ? param.body.datatype : null;
  return !!struct && normalizeSuiAddress(struct.package) === normalizeSuiAddress("0x2") && struct.module === "tx_context" && struct.type === "TxContext";
}
function getPureBcsSchema(typeSignature) {
  if (typeof typeSignature === "string") {
    switch (typeSignature) {
      case "address":
        return suiBcs.Address;
      case "bool":
        return suiBcs.Bool;
      case "u8":
        return suiBcs.U8;
      case "u16":
        return suiBcs.U16;
      case "u32":
        return suiBcs.U32;
      case "u64":
        return suiBcs.U64;
      case "u128":
        return suiBcs.U128;
      case "u256":
        return suiBcs.U256;
      default:
        throw new Error(`Unknown type signature ${typeSignature}`);
    }
  }
  if ("vector" in typeSignature) {
    if (typeSignature.vector === "u8") {
      return suiBcs.byteVector().transform({
        input: (val) => typeof val === "string" ? new TextEncoder().encode(val) : val,
        output: (val) => val
      });
    }
    const type = getPureBcsSchema(typeSignature.vector);
    return type ? suiBcs.vector(type) : null;
  }
  if ("datatype" in typeSignature) {
    const pkg = normalizeSuiAddress(typeSignature.datatype.package);
    if (pkg === normalizeSuiAddress(MOVE_STDLIB_ADDRESS)) {
      if (typeSignature.datatype.module === STD_ASCII_MODULE_NAME && typeSignature.datatype.type === STD_ASCII_STRUCT_NAME) {
        return suiBcs.String;
      }
      if (typeSignature.datatype.module === STD_UTF8_MODULE_NAME && typeSignature.datatype.type === STD_UTF8_STRUCT_NAME) {
        return suiBcs.String;
      }
      if (typeSignature.datatype.module === STD_OPTION_MODULE_NAME && typeSignature.datatype.type === STD_OPTION_STRUCT_NAME) {
        const type = getPureBcsSchema(typeSignature.datatype.typeParameters[0]);
        return type ? suiBcs.vector(type) : null;
      }
    }
    if (pkg === normalizeSuiAddress(SUI_FRAMEWORK_ADDRESS) && typeSignature.datatype.module === OBJECT_MODULE_NAME && typeSignature.datatype.type === ID_STRUCT_NAME) {
      return suiBcs.Address;
    }
  }
  return null;
}
function normalizedTypeToMoveTypeSignature(type) {
  if (typeof type === "object" && "Reference" in type) {
    return {
      ref: "&",
      body: normalizedTypeToMoveTypeSignatureBody(type.Reference)
    };
  }
  if (typeof type === "object" && "MutableReference" in type) {
    return {
      ref: "&mut",
      body: normalizedTypeToMoveTypeSignatureBody(type.MutableReference)
    };
  }
  return {
    ref: null,
    body: normalizedTypeToMoveTypeSignatureBody(type)
  };
}
function normalizedTypeToMoveTypeSignatureBody(type) {
  if (typeof type === "string") {
    switch (type) {
      case "Address":
        return "address";
      case "Bool":
        return "bool";
      case "U8":
        return "u8";
      case "U16":
        return "u16";
      case "U32":
        return "u32";
      case "U64":
        return "u64";
      case "U128":
        return "u128";
      case "U256":
        return "u256";
      default:
        throw new Error(`Unexpected type ${type}`);
    }
  }
  if ("Vector" in type) {
    return { vector: normalizedTypeToMoveTypeSignatureBody(type.Vector) };
  }
  if ("Struct" in type) {
    return {
      datatype: {
        package: type.Struct.address,
        module: type.Struct.module,
        type: type.Struct.name,
        typeParameters: type.Struct.typeArguments.map(normalizedTypeToMoveTypeSignatureBody)
      }
    };
  }
  if ("TypeParameter" in type) {
    return { typeParameter: type.TypeParameter };
  }
  throw new Error(`Unexpected type ${JSON.stringify(type)}`);
}

// node_modules/@mysten/sui/dist/esm/transactions/Inputs.js
function Pure(data) {
  return {
    $kind: "Pure",
    Pure: {
      bytes: data instanceof Uint8Array ? toBase64(data) : data.toBase64()
    }
  };
}
var Inputs = {
  Pure,
  ObjectRef({ objectId, digest, version }) {
    return {
      $kind: "Object",
      Object: {
        $kind: "ImmOrOwnedObject",
        ImmOrOwnedObject: {
          digest,
          version,
          objectId: normalizeSuiAddress(objectId)
        }
      }
    };
  },
  SharedObjectRef({
    objectId,
    mutable,
    initialSharedVersion
  }) {
    return {
      $kind: "Object",
      Object: {
        $kind: "SharedObject",
        SharedObject: {
          mutable,
          initialSharedVersion,
          objectId: normalizeSuiAddress(objectId)
        }
      }
    };
  },
  ReceivingRef({ objectId, digest, version }) {
    return {
      $kind: "Object",
      Object: {
        $kind: "Receiving",
        Receiving: {
          digest,
          version,
          objectId: normalizeSuiAddress(objectId)
        }
      }
    };
  }
};

// node_modules/valibot/dist/index.js
var store;
function getGlobalConfig(config2) {
  return {
    lang: config2?.lang ?? store?.lang,
    message: config2?.message,
    abortEarly: config2?.abortEarly ?? store?.abortEarly,
    abortPipeEarly: config2?.abortPipeEarly ?? store?.abortPipeEarly
  };
}
var store2;
function getGlobalMessage(lang) {
  return store2?.get(lang);
}
var store3;
function getSchemaMessage(lang) {
  return store3?.get(lang);
}
var store4;
function getSpecificMessage(reference, lang) {
  return store4?.get(reference)?.get(lang);
}
function _stringify(input) {
  const type = typeof input;
  if (type === "string") {
    return `"${input}"`;
  }
  if (type === "number" || type === "bigint" || type === "boolean") {
    return `${input}`;
  }
  if (type === "object" || type === "function") {
    return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
  }
  return type;
}
function _addIssue(context, label, dataset, config2, other) {
  const input = other && "input" in other ? other.input : dataset.value;
  const expected = other?.expected ?? context.expects ?? null;
  const received = other?.received ?? _stringify(input);
  const issue = {
    kind: context.kind,
    type: context.type,
    input,
    expected,
    received,
    message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
    // @ts-expect-error
    requirement: context.requirement,
    path: other?.path,
    issues: other?.issues,
    lang: config2.lang,
    abortEarly: config2.abortEarly,
    abortPipeEarly: config2.abortPipeEarly
  };
  const isSchema = context.kind === "schema";
  const message = other?.message ?? // @ts-expect-error
  context.message ?? getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? getSchemaMessage(issue.lang) : null) ?? config2.message ?? getGlobalMessage(issue.lang);
  if (message) {
    issue.message = typeof message === "function" ? message(issue) : message;
  }
  if (isSchema) {
    dataset.typed = false;
  }
  if (dataset.issues) {
    dataset.issues.push(issue);
  } else {
    dataset.issues = [issue];
  }
}
function _isValidObjectKey(object2, key) {
  return Object.hasOwn(object2, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
var ValiError = class extends Error {
  /**
   * The error issues.
   */
  issues;
  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues) {
    super(issues[0].message);
    this.name = "ValiError";
    this.issues = issues;
  }
};
function check(requirement, message) {
  return {
    kind: "validation",
    type: "check",
    reference: check,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config2) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, "input", dataset, config2);
      }
      return dataset;
    }
  };
}
function integer(message) {
  return {
    kind: "validation",
    type: "integer",
    reference: integer,
    async: false,
    expects: null,
    requirement: Number.isInteger,
    message,
    _run(dataset, config2) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, "integer", dataset, config2);
      }
      return dataset;
    }
  };
}
function transform(operation) {
  return {
    kind: "transformation",
    type: "transform",
    reference: transform,
    async: false,
    operation,
    _run(dataset) {
      dataset.value = this.operation(dataset.value);
      return dataset;
    }
  };
}
function getDefault(schema, dataset, config2) {
  return typeof schema.default === "function" ? (
    // @ts-expect-error
    schema.default(dataset, config2)
  ) : (
    // @ts-expect-error
    schema.default
  );
}
function is(schema, input) {
  return !schema._run({ typed: false, value: input }, { abortEarly: true }).issues;
}
function array(item, message) {
  return {
    kind: "schema",
    type: "array",
    reference: array,
    expects: "Array",
    async: false,
    item,
    message,
    _run(dataset, config2) {
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < input.length; key++) {
          const value2 = input[key];
          const itemDataset = this.item._run({ typed: false, value: value2 }, config2);
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = itemDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) {
            dataset.typed = false;
          }
          dataset.value.push(itemDataset.value);
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function bigint(message) {
  return {
    kind: "schema",
    type: "bigint",
    reference: bigint,
    expects: "bigint",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "bigint") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function boolean(message) {
  return {
    kind: "schema",
    type: "boolean",
    reference: boolean,
    expects: "boolean",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "boolean") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function lazy(getter) {
  return {
    kind: "schema",
    type: "lazy",
    reference: lazy,
    expects: "unknown",
    async: false,
    getter,
    _run(dataset, config2) {
      return this.getter(dataset.value)._run(dataset, config2);
    }
  };
}
function literal(literal_, message) {
  return {
    kind: "schema",
    type: "literal",
    reference: literal,
    expects: _stringify(literal_),
    async: false,
    literal: literal_,
    message,
    _run(dataset, config2) {
      if (dataset.value === this.literal) {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function nullable(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "nullable",
    reference: nullable,
    expects: `${wrapped.expects} | null`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === null) {
        if ("default" in this) {
          dataset.value = getDefault(
            this,
            dataset,
            config2
          );
        }
        if (dataset.value === null) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
}
function nullish(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "nullish",
    reference: nullish,
    expects: `${wrapped.expects} | null | undefined`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === null || dataset.value === void 0) {
        if ("default" in this) {
          dataset.value = getDefault(
            this,
            dataset,
            config2
          );
        }
        if (dataset.value === null || dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
}
function number(message) {
  return {
    kind: "schema",
    type: "number",
    reference: number,
    expects: "number",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "number" && !isNaN(dataset.value)) {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function object(entries, message) {
  return {
    kind: "schema",
    type: "object",
    reference: object,
    expects: "Object",
    async: false,
    entries,
    message,
    _run(dataset, config2) {
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const key in this.entries) {
          const value2 = input[key];
          const valueDataset = this.entries[key]._run(
            { typed: false, value: value2 },
            config2
          );
          if (valueDataset.issues) {
            const pathItem = {
              type: "object",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of valueDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = valueDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!valueDataset.typed) {
            dataset.typed = false;
          }
          if (valueDataset.value !== void 0 || key in input) {
            dataset.value[key] = valueDataset.value;
          }
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function optional(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "optional",
    reference: optional,
    expects: `${wrapped.expects} | undefined`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === void 0) {
        if ("default" in this) {
          dataset.value = getDefault(
            this,
            dataset,
            config2
          );
        }
        if (dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
}
function record(key, value2, message) {
  return {
    kind: "schema",
    type: "record",
    reference: record,
    expects: "Object",
    async: false,
    key,
    value: value2,
    message,
    _run(dataset, config2) {
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const entryKey in input) {
          if (_isValidObjectKey(input, entryKey)) {
            const entryValue = input[entryKey];
            const keyDataset = this.key._run(
              { typed: false, value: entryKey },
              config2
            );
            if (keyDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "key",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of keyDataset.issues) {
                issue.path = [pathItem];
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) {
                dataset.issues = keyDataset.issues;
              }
              if (config2.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            const valueDataset = this.value._run(
              { typed: false, value: entryValue },
              config2
            );
            if (valueDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "value",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of valueDataset.issues) {
                if (issue.path) {
                  issue.path.unshift(pathItem);
                } else {
                  issue.path = [pathItem];
                }
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) {
                dataset.issues = valueDataset.issues;
              }
              if (config2.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!keyDataset.typed || !valueDataset.typed) {
              dataset.typed = false;
            }
            if (keyDataset.typed) {
              dataset.value[keyDataset.value] = valueDataset.value;
            }
          }
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function string(message) {
  return {
    kind: "schema",
    type: "string",
    reference: string,
    expects: "string",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "string") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function tuple(items, message) {
  return {
    kind: "schema",
    type: "tuple",
    reference: tuple,
    expects: "Array",
    async: false,
    items,
    message,
    _run(dataset, config2) {
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < this.items.length; key++) {
          const value2 = input[key];
          const itemDataset = this.items[key]._run(
            { typed: false, value: value2 },
            config2
          );
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = itemDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) {
            dataset.typed = false;
          }
          dataset.value.push(itemDataset.value);
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
}
function _subIssues(datasets) {
  let issues;
  if (datasets) {
    for (const dataset of datasets) {
      if (issues) {
        issues.push(...dataset.issues);
      } else {
        issues = dataset.issues;
      }
    }
  }
  return issues;
}
function union(options, message) {
  return {
    kind: "schema",
    type: "union",
    reference: union,
    expects: [...new Set(options.map((option) => option.expects))].join(" | ") || "never",
    async: false,
    options,
    message,
    _run(dataset, config2) {
      let validDataset;
      let typedDatasets;
      let untypedDatasets;
      for (const schema of this.options) {
        const optionDataset = schema._run(
          { typed: false, value: dataset.value },
          config2
        );
        if (optionDataset.typed) {
          if (optionDataset.issues) {
            if (typedDatasets) {
              typedDatasets.push(optionDataset);
            } else {
              typedDatasets = [optionDataset];
            }
          } else {
            validDataset = optionDataset;
            break;
          }
        } else {
          if (untypedDatasets) {
            untypedDatasets.push(optionDataset);
          } else {
            untypedDatasets = [optionDataset];
          }
        }
      }
      if (validDataset) {
        return validDataset;
      }
      if (typedDatasets) {
        if (typedDatasets.length === 1) {
          return typedDatasets[0];
        }
        _addIssue(this, "type", dataset, config2, {
          issues: _subIssues(typedDatasets)
        });
        dataset.typed = true;
      } else if (untypedDatasets?.length === 1) {
        return untypedDatasets[0];
      } else {
        _addIssue(this, "type", dataset, config2, {
          issues: _subIssues(untypedDatasets)
        });
      }
      return dataset;
    }
  };
}
function unknown() {
  return {
    kind: "schema",
    type: "unknown",
    reference: unknown,
    expects: "unknown",
    async: false,
    _run(dataset) {
      dataset.typed = true;
      return dataset;
    }
  };
}
function parse(schema, input, config2) {
  const dataset = schema._run(
    { typed: false, value: input },
    getGlobalConfig(config2)
  );
  if (dataset.issues) {
    throw new ValiError(dataset.issues);
  }
  return dataset.value;
}
function pipe(...pipe2) {
  return __spreadProps(__spreadValues({}, pipe2[0]), {
    pipe: pipe2,
    _run(dataset, config2) {
      for (let index = 0; index < pipe2.length; index++) {
        if (dataset.issues && (pipe2[index].kind === "schema" || pipe2[index].kind === "transformation")) {
          dataset.typed = false;
          break;
        }
        if (!dataset.issues || !config2.abortEarly && !config2.abortPipeEarly) {
          dataset = pipe2[index]._run(dataset, config2);
        }
      }
      return dataset;
    }
  });
}

// node_modules/@mysten/sui/dist/esm/transactions/data/internal.js
function safeEnum(options) {
  const unionOptions = Object.entries(options).map(([key, value]) => object({ [key]: value }));
  return pipe(
    union(unionOptions),
    transform((value) => __spreadProps(__spreadValues({}, value), {
      $kind: Object.keys(value)[0]
    }))
  );
}
var SuiAddress = pipe(
  string(),
  transform((value) => normalizeSuiAddress(value)),
  check(isValidSuiAddress)
);
var ObjectID = SuiAddress;
var BCSBytes = string();
var JsonU64 = pipe(
  union([string(), pipe(number(), integer())]),
  check((val) => {
    try {
      BigInt(val);
      return BigInt(val) >= 0 && BigInt(val) <= 18446744073709551615n;
    } catch {
      return false;
    }
  }, "Invalid u64")
);
var ObjectRefSchema = object({
  objectId: SuiAddress,
  version: JsonU64,
  digest: string()
});
var ArgumentSchema = pipe(
  union([
    object({ GasCoin: literal(true) }),
    object({ Input: pipe(number(), integer()), type: optional(literal("pure")) }),
    object({ Input: pipe(number(), integer()), type: optional(literal("object")) }),
    object({ Result: pipe(number(), integer()) }),
    object({ NestedResult: tuple([pipe(number(), integer()), pipe(number(), integer())]) })
  ]),
  transform((value) => __spreadProps(__spreadValues({}, value), {
    $kind: Object.keys(value)[0]
  }))
  // Defined manually to add `type?: 'pure' | 'object'` to Input
);
var GasDataSchema = object({
  budget: nullable(JsonU64),
  price: nullable(JsonU64),
  owner: nullable(SuiAddress),
  payment: nullable(array(ObjectRefSchema))
});
var StructTagSchema = object({
  address: string(),
  module: string(),
  name: string(),
  // type_params in rust, should be updated to use camelCase
  typeParams: array(string())
});
var OpenMoveTypeSignatureBodySchema = union([
  literal("address"),
  literal("bool"),
  literal("u8"),
  literal("u16"),
  literal("u32"),
  literal("u64"),
  literal("u128"),
  literal("u256"),
  object({ vector: lazy(() => OpenMoveTypeSignatureBodySchema) }),
  object({
    datatype: object({
      package: string(),
      module: string(),
      type: string(),
      typeParameters: array(lazy(() => OpenMoveTypeSignatureBodySchema))
    })
  }),
  object({ typeParameter: pipe(number(), integer()) })
]);
var OpenMoveTypeSignatureSchema = object({
  ref: nullable(union([literal("&"), literal("&mut")])),
  body: OpenMoveTypeSignatureBodySchema
});
var ProgrammableMoveCallSchema = object({
  package: ObjectID,
  module: string(),
  function: string(),
  // snake case in rust
  typeArguments: array(string()),
  arguments: array(ArgumentSchema),
  _argumentTypes: optional(nullable(array(OpenMoveTypeSignatureSchema)))
});
var $Intent = object({
  name: string(),
  inputs: record(string(), union([ArgumentSchema, array(ArgumentSchema)])),
  data: record(string(), unknown())
});
var CommandSchema = safeEnum({
  MoveCall: ProgrammableMoveCallSchema,
  TransferObjects: object({
    objects: array(ArgumentSchema),
    address: ArgumentSchema
  }),
  SplitCoins: object({
    coin: ArgumentSchema,
    amounts: array(ArgumentSchema)
  }),
  MergeCoins: object({
    destination: ArgumentSchema,
    sources: array(ArgumentSchema)
  }),
  Publish: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID)
  }),
  MakeMoveVec: object({
    type: nullable(string()),
    elements: array(ArgumentSchema)
  }),
  Upgrade: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID),
    package: ObjectID,
    ticket: ArgumentSchema
  }),
  $Intent
});
var ObjectArgSchema = safeEnum({
  ImmOrOwnedObject: ObjectRefSchema,
  SharedObject: object({
    objectId: ObjectID,
    // snake case in rust
    initialSharedVersion: JsonU64,
    mutable: boolean()
  }),
  Receiving: ObjectRefSchema
});
var CallArgSchema = safeEnum({
  Object: ObjectArgSchema,
  Pure: object({
    bytes: BCSBytes
  }),
  UnresolvedPure: object({
    value: unknown()
  }),
  UnresolvedObject: object({
    objectId: ObjectID,
    version: optional(nullable(JsonU64)),
    digest: optional(nullable(string())),
    initialSharedVersion: optional(nullable(JsonU64)),
    mutable: optional(nullable(boolean()))
  })
});
var NormalizedCallArg = safeEnum({
  Object: ObjectArgSchema,
  Pure: object({
    bytes: BCSBytes
  })
});
var TransactionExpiration = safeEnum({
  None: literal(true),
  Epoch: JsonU64
});
var TransactionDataSchema = object({
  version: literal(2),
  sender: nullish(SuiAddress),
  expiration: nullish(TransactionExpiration),
  gasData: GasDataSchema,
  inputs: array(CallArgSchema),
  commands: array(CommandSchema)
});

// node_modules/@mysten/sui/dist/esm/transactions/Commands.js
var UpgradePolicy = ((UpgradePolicy2) => {
  UpgradePolicy2[UpgradePolicy2["COMPATIBLE"] = 0] = "COMPATIBLE";
  UpgradePolicy2[UpgradePolicy2["ADDITIVE"] = 128] = "ADDITIVE";
  UpgradePolicy2[UpgradePolicy2["DEP_ONLY"] = 192] = "DEP_ONLY";
  return UpgradePolicy2;
})(UpgradePolicy || {});
var Commands = {
  MoveCall(input) {
    const [pkg, mod = "", fn = ""] = "target" in input ? input.target.split("::") : [input.package, input.module, input.function];
    return {
      $kind: "MoveCall",
      MoveCall: {
        package: pkg,
        module: mod,
        function: fn,
        typeArguments: input.typeArguments ?? [],
        arguments: input.arguments ?? []
      }
    };
  },
  TransferObjects(objects, address) {
    return {
      $kind: "TransferObjects",
      TransferObjects: {
        objects: objects.map((o) => parse(ArgumentSchema, o)),
        address: parse(ArgumentSchema, address)
      }
    };
  },
  SplitCoins(coin, amounts) {
    return {
      $kind: "SplitCoins",
      SplitCoins: {
        coin: parse(ArgumentSchema, coin),
        amounts: amounts.map((o) => parse(ArgumentSchema, o))
      }
    };
  },
  MergeCoins(destination, sources) {
    return {
      $kind: "MergeCoins",
      MergeCoins: {
        destination: parse(ArgumentSchema, destination),
        sources: sources.map((o) => parse(ArgumentSchema, o))
      }
    };
  },
  Publish({
    modules,
    dependencies
  }) {
    return {
      $kind: "Publish",
      Publish: {
        modules: modules.map(
          (module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))
        ),
        dependencies: dependencies.map((dep) => normalizeSuiObjectId(dep))
      }
    };
  },
  Upgrade({
    modules,
    dependencies,
    package: packageId,
    ticket
  }) {
    return {
      $kind: "Upgrade",
      Upgrade: {
        modules: modules.map(
          (module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))
        ),
        dependencies: dependencies.map((dep) => normalizeSuiObjectId(dep)),
        package: packageId,
        ticket: parse(ArgumentSchema, ticket)
      }
    };
  },
  MakeMoveVec({
    type,
    elements
  }) {
    return {
      $kind: "MakeMoveVec",
      MakeMoveVec: {
        type: type ?? null,
        elements: elements.map((o) => parse(ArgumentSchema, o))
      }
    };
  },
  Intent({
    name,
    inputs = {},
    data = {}
  }) {
    return {
      $kind: "$Intent",
      $Intent: {
        name,
        inputs: Object.fromEntries(
          Object.entries(inputs).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.map((o) => parse(ArgumentSchema, o)) : parse(ArgumentSchema, value)
          ])
        ),
        data
      }
    };
  }
};

// node_modules/@mysten/sui/dist/esm/transactions/data/v1.js
var ObjectRef = object({
  digest: string(),
  objectId: string(),
  version: union([pipe(number(), integer()), string(), bigint()])
});
var ObjectArg = safeEnum({
  ImmOrOwned: ObjectRef,
  Shared: object({
    objectId: ObjectID,
    initialSharedVersion: JsonU64,
    mutable: boolean()
  }),
  Receiving: ObjectRef
});
var NormalizedCallArg2 = safeEnum({
  Object: ObjectArg,
  Pure: array(pipe(number(), integer()))
});
var TransactionInput = union([
  object({
    kind: literal("Input"),
    index: pipe(number(), integer()),
    value: unknown(),
    type: optional(literal("object"))
  }),
  object({
    kind: literal("Input"),
    index: pipe(number(), integer()),
    value: unknown(),
    type: literal("pure")
  })
]);
var TransactionExpiration2 = union([
  object({ Epoch: pipe(number(), integer()) }),
  object({ None: nullable(literal(true)) })
]);
var StringEncodedBigint = pipe(
  union([number(), string(), bigint()]),
  check((val) => {
    if (!["string", "number", "bigint"].includes(typeof val)) return false;
    try {
      BigInt(val);
      return true;
    } catch {
      return false;
    }
  })
);
var TypeTag = union([
  object({ bool: nullable(literal(true)) }),
  object({ u8: nullable(literal(true)) }),
  object({ u64: nullable(literal(true)) }),
  object({ u128: nullable(literal(true)) }),
  object({ address: nullable(literal(true)) }),
  object({ signer: nullable(literal(true)) }),
  object({ vector: lazy(() => TypeTag) }),
  object({ struct: lazy(() => StructTag) }),
  object({ u16: nullable(literal(true)) }),
  object({ u32: nullable(literal(true)) }),
  object({ u256: nullable(literal(true)) })
]);
var StructTag = object({
  address: string(),
  module: string(),
  name: string(),
  typeParams: array(TypeTag)
});
var GasConfig = object({
  budget: optional(StringEncodedBigint),
  price: optional(StringEncodedBigint),
  payment: optional(array(ObjectRef)),
  owner: optional(string())
});
var TransactionArgumentTypes = [
  TransactionInput,
  object({ kind: literal("GasCoin") }),
  object({ kind: literal("Result"), index: pipe(number(), integer()) }),
  object({
    kind: literal("NestedResult"),
    index: pipe(number(), integer()),
    resultIndex: pipe(number(), integer())
  })
];
var TransactionArgument = union([...TransactionArgumentTypes]);
var MoveCallTransaction = object({
  kind: literal("MoveCall"),
  target: pipe(
    string(),
    check((target) => target.split("::").length === 3)
  ),
  typeArguments: array(string()),
  arguments: array(TransactionArgument)
});
var TransferObjectsTransaction = object({
  kind: literal("TransferObjects"),
  objects: array(TransactionArgument),
  address: TransactionArgument
});
var SplitCoinsTransaction = object({
  kind: literal("SplitCoins"),
  coin: TransactionArgument,
  amounts: array(TransactionArgument)
});
var MergeCoinsTransaction = object({
  kind: literal("MergeCoins"),
  destination: TransactionArgument,
  sources: array(TransactionArgument)
});
var MakeMoveVecTransaction = object({
  kind: literal("MakeMoveVec"),
  type: union([object({ Some: TypeTag }), object({ None: nullable(literal(true)) })]),
  objects: array(TransactionArgument)
});
var PublishTransaction = object({
  kind: literal("Publish"),
  modules: array(array(pipe(number(), integer()))),
  dependencies: array(string())
});
var UpgradeTransaction = object({
  kind: literal("Upgrade"),
  modules: array(array(pipe(number(), integer()))),
  dependencies: array(string()),
  packageId: string(),
  ticket: TransactionArgument
});
var TransactionTypes = [
  MoveCallTransaction,
  TransferObjectsTransaction,
  SplitCoinsTransaction,
  MergeCoinsTransaction,
  PublishTransaction,
  UpgradeTransaction,
  MakeMoveVecTransaction
];
var TransactionType = union([...TransactionTypes]);
var SerializedTransactionDataV1 = object({
  version: literal(1),
  sender: optional(string()),
  expiration: nullish(TransactionExpiration2),
  gasConfig: GasConfig,
  inputs: array(TransactionInput),
  transactions: array(TransactionType)
});
function serializeV1TransactionData(transactionData) {
  const inputs = transactionData.inputs.map(
    (input, index) => {
      if (input.Object) {
        return {
          kind: "Input",
          index,
          value: {
            Object: input.Object.ImmOrOwnedObject ? {
              ImmOrOwned: input.Object.ImmOrOwnedObject
            } : input.Object.Receiving ? {
              Receiving: {
                digest: input.Object.Receiving.digest,
                version: input.Object.Receiving.version,
                objectId: input.Object.Receiving.objectId
              }
            } : {
              Shared: {
                mutable: input.Object.SharedObject.mutable,
                initialSharedVersion: input.Object.SharedObject.initialSharedVersion,
                objectId: input.Object.SharedObject.objectId
              }
            }
          },
          type: "object"
        };
      }
      if (input.Pure) {
        return {
          kind: "Input",
          index,
          value: {
            Pure: Array.from(fromBase64(input.Pure.bytes))
          },
          type: "pure"
        };
      }
      if (input.UnresolvedPure) {
        return {
          kind: "Input",
          type: "pure",
          index,
          value: input.UnresolvedPure.value
        };
      }
      if (input.UnresolvedObject) {
        return {
          kind: "Input",
          type: "object",
          index,
          value: input.UnresolvedObject.objectId
        };
      }
      throw new Error("Invalid input");
    }
  );
  return {
    version: 1,
    sender: transactionData.sender ?? void 0,
    expiration: transactionData.expiration?.$kind === "Epoch" ? { Epoch: Number(transactionData.expiration.Epoch) } : transactionData.expiration ? { None: true } : null,
    gasConfig: {
      owner: transactionData.gasData.owner ?? void 0,
      budget: transactionData.gasData.budget ?? void 0,
      price: transactionData.gasData.price ?? void 0,
      payment: transactionData.gasData.payment ?? void 0
    },
    inputs,
    transactions: transactionData.commands.map((command) => {
      if (command.MakeMoveVec) {
        return {
          kind: "MakeMoveVec",
          type: command.MakeMoveVec.type === null ? { None: true } : { Some: TypeTagSerializer.parseFromStr(command.MakeMoveVec.type) },
          objects: command.MakeMoveVec.elements.map(
            (arg) => convertTransactionArgument(arg, inputs)
          )
        };
      }
      if (command.MergeCoins) {
        return {
          kind: "MergeCoins",
          destination: convertTransactionArgument(command.MergeCoins.destination, inputs),
          sources: command.MergeCoins.sources.map((arg) => convertTransactionArgument(arg, inputs))
        };
      }
      if (command.MoveCall) {
        return {
          kind: "MoveCall",
          target: `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`,
          typeArguments: command.MoveCall.typeArguments,
          arguments: command.MoveCall.arguments.map(
            (arg) => convertTransactionArgument(arg, inputs)
          )
        };
      }
      if (command.Publish) {
        return {
          kind: "Publish",
          modules: command.Publish.modules.map((mod) => Array.from(fromBase64(mod))),
          dependencies: command.Publish.dependencies
        };
      }
      if (command.SplitCoins) {
        return {
          kind: "SplitCoins",
          coin: convertTransactionArgument(command.SplitCoins.coin, inputs),
          amounts: command.SplitCoins.amounts.map((arg) => convertTransactionArgument(arg, inputs))
        };
      }
      if (command.TransferObjects) {
        return {
          kind: "TransferObjects",
          objects: command.TransferObjects.objects.map(
            (arg) => convertTransactionArgument(arg, inputs)
          ),
          address: convertTransactionArgument(command.TransferObjects.address, inputs)
        };
      }
      if (command.Upgrade) {
        return {
          kind: "Upgrade",
          modules: command.Upgrade.modules.map((mod) => Array.from(fromBase64(mod))),
          dependencies: command.Upgrade.dependencies,
          packageId: command.Upgrade.package,
          ticket: convertTransactionArgument(command.Upgrade.ticket, inputs)
        };
      }
      throw new Error(`Unknown transaction ${Object.keys(command)}`);
    })
  };
}
function convertTransactionArgument(arg, inputs) {
  if (arg.$kind === "GasCoin") {
    return { kind: "GasCoin" };
  }
  if (arg.$kind === "Result") {
    return { kind: "Result", index: arg.Result };
  }
  if (arg.$kind === "NestedResult") {
    return { kind: "NestedResult", index: arg.NestedResult[0], resultIndex: arg.NestedResult[1] };
  }
  if (arg.$kind === "Input") {
    return inputs[arg.Input];
  }
  throw new Error(`Invalid argument ${Object.keys(arg)}`);
}
function transactionDataFromV1(data) {
  return parse(TransactionDataSchema, {
    version: 2,
    sender: data.sender ?? null,
    expiration: data.expiration ? "Epoch" in data.expiration ? { Epoch: data.expiration.Epoch } : { None: true } : null,
    gasData: {
      owner: data.gasConfig.owner ?? null,
      budget: data.gasConfig.budget?.toString() ?? null,
      price: data.gasConfig.price?.toString() ?? null,
      payment: data.gasConfig.payment?.map((ref) => ({
        digest: ref.digest,
        objectId: ref.objectId,
        version: ref.version.toString()
      })) ?? null
    },
    inputs: data.inputs.map((input) => {
      if (input.kind === "Input") {
        if (is(NormalizedCallArg2, input.value)) {
          const value = parse(NormalizedCallArg2, input.value);
          if (value.Object) {
            if (value.Object.ImmOrOwned) {
              return {
                Object: {
                  ImmOrOwnedObject: {
                    objectId: value.Object.ImmOrOwned.objectId,
                    version: String(value.Object.ImmOrOwned.version),
                    digest: value.Object.ImmOrOwned.digest
                  }
                }
              };
            }
            if (value.Object.Shared) {
              return {
                Object: {
                  SharedObject: {
                    mutable: value.Object.Shared.mutable ?? null,
                    initialSharedVersion: value.Object.Shared.initialSharedVersion,
                    objectId: value.Object.Shared.objectId
                  }
                }
              };
            }
            if (value.Object.Receiving) {
              return {
                Object: {
                  Receiving: {
                    digest: value.Object.Receiving.digest,
                    version: String(value.Object.Receiving.version),
                    objectId: value.Object.Receiving.objectId
                  }
                }
              };
            }
            throw new Error("Invalid object input");
          }
          return {
            Pure: {
              bytes: toBase64(new Uint8Array(value.Pure))
            }
          };
        }
        if (input.type === "object") {
          return {
            UnresolvedObject: {
              objectId: input.value
            }
          };
        }
        return {
          UnresolvedPure: {
            value: input.value
          }
        };
      }
      throw new Error("Invalid input");
    }),
    commands: data.transactions.map((transaction) => {
      switch (transaction.kind) {
        case "MakeMoveVec":
          return {
            MakeMoveVec: {
              type: "Some" in transaction.type ? TypeTagSerializer.tagToString(transaction.type.Some) : null,
              elements: transaction.objects.map((arg) => parseV1TransactionArgument(arg))
            }
          };
        case "MergeCoins": {
          return {
            MergeCoins: {
              destination: parseV1TransactionArgument(transaction.destination),
              sources: transaction.sources.map((arg) => parseV1TransactionArgument(arg))
            }
          };
        }
        case "MoveCall": {
          const [pkg, mod, fn] = transaction.target.split("::");
          return {
            MoveCall: {
              package: pkg,
              module: mod,
              function: fn,
              typeArguments: transaction.typeArguments,
              arguments: transaction.arguments.map((arg) => parseV1TransactionArgument(arg))
            }
          };
        }
        case "Publish": {
          return {
            Publish: {
              modules: transaction.modules.map((mod) => toBase64(Uint8Array.from(mod))),
              dependencies: transaction.dependencies
            }
          };
        }
        case "SplitCoins": {
          return {
            SplitCoins: {
              coin: parseV1TransactionArgument(transaction.coin),
              amounts: transaction.amounts.map((arg) => parseV1TransactionArgument(arg))
            }
          };
        }
        case "TransferObjects": {
          return {
            TransferObjects: {
              objects: transaction.objects.map((arg) => parseV1TransactionArgument(arg)),
              address: parseV1TransactionArgument(transaction.address)
            }
          };
        }
        case "Upgrade": {
          return {
            Upgrade: {
              modules: transaction.modules.map((mod) => toBase64(Uint8Array.from(mod))),
              dependencies: transaction.dependencies,
              package: transaction.packageId,
              ticket: parseV1TransactionArgument(transaction.ticket)
            }
          };
        }
      }
      throw new Error(`Unknown transaction ${Object.keys(transaction)}`);
    })
  });
}
function parseV1TransactionArgument(arg) {
  switch (arg.kind) {
    case "GasCoin": {
      return { GasCoin: true };
    }
    case "Result":
      return { Result: arg.index };
    case "NestedResult": {
      return { NestedResult: [arg.index, arg.resultIndex] };
    }
    case "Input": {
      return { Input: arg.index };
    }
  }
}

// node_modules/@mysten/sui/dist/esm/transactions/hash.js
function hashTypedData(typeTag, data) {
  const typeTagBytes = Array.from(`${typeTag}::`).map((e) => e.charCodeAt(0));
  const dataWithTag = new Uint8Array(typeTagBytes.length + data.length);
  dataWithTag.set(typeTagBytes);
  dataWithTag.set(data, typeTagBytes.length);
  return blake2b(dataWithTag, { dkLen: 32 });
}

// node_modules/@mysten/sui/dist/esm/transactions/TransactionData.js
function prepareSuiAddress(address) {
  return normalizeSuiAddress(address).replace("0x", "");
}
var TransactionDataBuilder = class _TransactionDataBuilder {
  constructor(clone) {
    this.version = 2;
    this.sender = clone?.sender ?? null;
    this.expiration = clone?.expiration ?? null;
    this.inputs = clone?.inputs ?? [];
    this.commands = clone?.commands ?? [];
    this.gasData = clone?.gasData ?? {
      budget: null,
      price: null,
      owner: null,
      payment: null
    };
  }
  static fromKindBytes(bytes) {
    const kind = suiBcs.TransactionKind.parse(bytes);
    const programmableTx = kind.ProgrammableTransaction;
    if (!programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    return _TransactionDataBuilder.restore({
      version: 2,
      sender: null,
      expiration: null,
      gasData: {
        budget: null,
        owner: null,
        payment: null,
        price: null
      },
      inputs: programmableTx.inputs,
      commands: programmableTx.commands
    });
  }
  static fromBytes(bytes) {
    const rawData = suiBcs.TransactionData.parse(bytes);
    const data = rawData?.V1;
    const programmableTx = data.kind.ProgrammableTransaction;
    if (!data || !programmableTx) {
      throw new Error("Unable to deserialize from bytes.");
    }
    return _TransactionDataBuilder.restore({
      version: 2,
      sender: data.sender,
      expiration: data.expiration,
      gasData: data.gasData,
      inputs: programmableTx.inputs,
      commands: programmableTx.commands
    });
  }
  static restore(data) {
    if (data.version === 2) {
      return new _TransactionDataBuilder(parse(TransactionDataSchema, data));
    } else {
      return new _TransactionDataBuilder(parse(TransactionDataSchema, transactionDataFromV1(data)));
    }
  }
  /**
   * Generate transaction digest.
   *
   * @param bytes BCS serialized transaction data
   * @returns transaction digest.
   */
  static getDigestFromBytes(bytes) {
    const hash = hashTypedData("TransactionData", bytes);
    return toBase58(hash);
  }
  // @deprecated use gasData instead
  get gasConfig() {
    return this.gasData;
  }
  // @deprecated use gasData instead
  set gasConfig(value) {
    this.gasData = value;
  }
  build({
    maxSizeBytes = Infinity,
    overrides,
    onlyTransactionKind
  } = {}) {
    const inputs = this.inputs;
    const commands = this.commands;
    const kind = {
      ProgrammableTransaction: {
        inputs,
        commands
      }
    };
    if (onlyTransactionKind) {
      return suiBcs.TransactionKind.serialize(kind, { maxSize: maxSizeBytes }).toBytes();
    }
    const expiration = overrides?.expiration ?? this.expiration;
    const sender = overrides?.sender ?? this.sender;
    const gasData = __spreadValues(__spreadValues(__spreadValues({}, this.gasData), overrides?.gasConfig), overrides?.gasData);
    if (!sender) {
      throw new Error("Missing transaction sender");
    }
    if (!gasData.budget) {
      throw new Error("Missing gas budget");
    }
    if (!gasData.payment) {
      throw new Error("Missing gas payment");
    }
    if (!gasData.price) {
      throw new Error("Missing gas price");
    }
    const transactionData = {
      sender: prepareSuiAddress(sender),
      expiration: expiration ? expiration : { None: true },
      gasData: {
        payment: gasData.payment,
        owner: prepareSuiAddress(this.gasData.owner ?? sender),
        price: BigInt(gasData.price),
        budget: BigInt(gasData.budget)
      },
      kind: {
        ProgrammableTransaction: {
          inputs,
          commands
        }
      }
    };
    return suiBcs.TransactionData.serialize(
      { V1: transactionData },
      { maxSize: maxSizeBytes }
    ).toBytes();
  }
  addInput(type, arg) {
    const index = this.inputs.length;
    this.inputs.push(arg);
    return { Input: index, type, $kind: "Input" };
  }
  getInputUses(index, fn) {
    this.mapArguments((arg, command) => {
      if (arg.$kind === "Input" && arg.Input === index) {
        fn(arg, command);
      }
      return arg;
    });
  }
  mapCommandArguments(index, fn) {
    const command = this.commands[index];
    switch (command.$kind) {
      case "MoveCall":
        command.MoveCall.arguments = command.MoveCall.arguments.map(
          (arg) => fn(arg, command, index)
        );
        break;
      case "TransferObjects":
        command.TransferObjects.objects = command.TransferObjects.objects.map(
          (arg) => fn(arg, command, index)
        );
        command.TransferObjects.address = fn(command.TransferObjects.address, command, index);
        break;
      case "SplitCoins":
        command.SplitCoins.coin = fn(command.SplitCoins.coin, command, index);
        command.SplitCoins.amounts = command.SplitCoins.amounts.map(
          (arg) => fn(arg, command, index)
        );
        break;
      case "MergeCoins":
        command.MergeCoins.destination = fn(command.MergeCoins.destination, command, index);
        command.MergeCoins.sources = command.MergeCoins.sources.map(
          (arg) => fn(arg, command, index)
        );
        break;
      case "MakeMoveVec":
        command.MakeMoveVec.elements = command.MakeMoveVec.elements.map(
          (arg) => fn(arg, command, index)
        );
        break;
      case "Upgrade":
        command.Upgrade.ticket = fn(command.Upgrade.ticket, command, index);
        break;
      case "$Intent":
        const inputs = command.$Intent.inputs;
        command.$Intent.inputs = {};
        for (const [key, value] of Object.entries(inputs)) {
          command.$Intent.inputs[key] = Array.isArray(value) ? value.map((arg) => fn(arg, command, index)) : fn(value, command, index);
        }
        break;
      case "Publish":
        break;
      default:
        throw new Error(`Unexpected transaction kind: ${command.$kind}`);
    }
  }
  mapArguments(fn) {
    for (const commandIndex of this.commands.keys()) {
      this.mapCommandArguments(commandIndex, fn);
    }
  }
  replaceCommand(index, replacement, resultIndex = index) {
    if (!Array.isArray(replacement)) {
      this.commands[index] = replacement;
      return;
    }
    const sizeDiff = replacement.length - 1;
    this.commands.splice(index, 1, ...replacement);
    if (sizeDiff !== 0) {
      this.mapArguments((arg, _command, commandIndex) => {
        if (commandIndex < index + replacement.length) {
          return arg;
        }
        switch (arg.$kind) {
          case "Result":
            if (arg.Result === index) {
              arg.Result = resultIndex;
            }
            if (arg.Result > index) {
              arg.Result += sizeDiff;
            }
            break;
          case "NestedResult":
            if (arg.NestedResult[0] === index) {
              arg.NestedResult[0] = resultIndex;
            }
            if (arg.NestedResult[0] > index) {
              arg.NestedResult[0] += sizeDiff;
            }
            break;
        }
        return arg;
      });
    }
  }
  getDigest() {
    const bytes = this.build({ onlyTransactionKind: false });
    return _TransactionDataBuilder.getDigestFromBytes(bytes);
  }
  snapshot() {
    return parse(TransactionDataSchema, this);
  }
  shallowClone() {
    return new _TransactionDataBuilder({
      version: this.version,
      sender: this.sender,
      expiration: this.expiration,
      gasData: __spreadValues({}, this.gasData),
      inputs: [...this.inputs],
      commands: [...this.commands]
    });
  }
  applyResolvedData(resolved) {
    if (!this.sender) {
      this.sender = resolved.sender ?? null;
    }
    if (!this.expiration) {
      this.expiration = resolved.expiration ?? null;
    }
    if (!this.gasData.budget) {
      this.gasData.budget = resolved.gasData.budget;
    }
    if (!this.gasData.owner) {
      this.gasData.owner = resolved.gasData.owner ?? null;
    }
    if (!this.gasData.payment) {
      this.gasData.payment = resolved.gasData.payment;
    }
    if (!this.gasData.price) {
      this.gasData.price = resolved.gasData.price;
    }
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      const resolvedInput = resolved.inputs[i];
      switch (input.$kind) {
        case "UnresolvedPure":
          if (resolvedInput.$kind !== "Pure") {
            throw new Error(
              `Expected input at index ${i} to resolve to a Pure argument, but got ${JSON.stringify(
                resolvedInput
              )}`
            );
          }
          this.inputs[i] = resolvedInput;
          break;
        case "UnresolvedObject":
          if (resolvedInput.$kind !== "Object") {
            throw new Error(
              `Expected input at index ${i} to resolve to an Object argument, but got ${JSON.stringify(
                resolvedInput
              )}`
            );
          }
          if (resolvedInput.Object.$kind === "ImmOrOwnedObject" || resolvedInput.Object.$kind === "Receiving") {
            const original = input.UnresolvedObject;
            const resolved2 = resolvedInput.Object.ImmOrOwnedObject ?? resolvedInput.Object.Receiving;
            if (normalizeSuiAddress(original.objectId) !== normalizeSuiAddress(resolved2.objectId) || original.version != null && original.version !== resolved2.version || original.digest != null && original.digest !== resolved2.digest || // Objects with shared object properties should not resolve to owned objects
            original.mutable != null || original.initialSharedVersion != null) {
              throw new Error(
                `Input at index ${i} did not match unresolved object. ${JSON.stringify(original)} is not compatible with ${JSON.stringify(resolved2)}`
              );
            }
          } else if (resolvedInput.Object.$kind === "SharedObject") {
            const original = input.UnresolvedObject;
            const resolved2 = resolvedInput.Object.SharedObject;
            if (normalizeSuiAddress(original.objectId) !== normalizeSuiAddress(resolved2.objectId) || original.initialSharedVersion != null && original.initialSharedVersion !== resolved2.initialSharedVersion || original.mutable != null && original.mutable !== resolved2.mutable || // Objects with owned object properties should not resolve to shared objects
            original.version != null || original.digest != null) {
              throw new Error(
                `Input at index ${i} did not match unresolved object. ${JSON.stringify(original)} is not compatible with ${JSON.stringify(resolved2)}`
              );
            }
          } else {
            throw new Error(
              `Input at index ${i} resolved to an unexpected Object kind: ${JSON.stringify(
                resolvedInput.Object
              )}`
            );
          }
          this.inputs[i] = resolvedInput;
          break;
      }
    }
  }
};

// node_modules/@mysten/sui/dist/esm/transactions/utils.js
function getIdFromCallArg(arg) {
  if (typeof arg === "string") {
    return normalizeSuiAddress(arg);
  }
  if (arg.Object) {
    if (arg.Object.ImmOrOwnedObject) {
      return normalizeSuiAddress(arg.Object.ImmOrOwnedObject.objectId);
    }
    if (arg.Object.Receiving) {
      return normalizeSuiAddress(arg.Object.Receiving.objectId);
    }
    return normalizeSuiAddress(arg.Object.SharedObject.objectId);
  }
  if (arg.UnresolvedObject) {
    return normalizeSuiAddress(arg.UnresolvedObject.objectId);
  }
  return void 0;
}
function isArgument(value) {
  return is(ArgumentSchema, value);
}

// node_modules/@mysten/sui/dist/esm/experimental/cache.js
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _prefix;
var _cache;
var _ClientCache = class _ClientCache2 {
  constructor({ prefix, cache } = {}) {
    __privateAdd(this, _prefix);
    __privateAdd(this, _cache);
    __privateSet(this, _prefix, prefix ?? []);
    __privateSet(this, _cache, cache ?? /* @__PURE__ */ new Map());
  }
  read(key, load) {
    const cacheKey = [__privateGet(this, _prefix), ...key].join(":");
    if (__privateGet(this, _cache).has(cacheKey)) {
      return __privateGet(this, _cache).get(cacheKey);
    }
    const result = load();
    __privateGet(this, _cache).set(cacheKey, result);
    if (typeof result === "object" && result !== null && "then" in result) {
      return Promise.resolve(result).then((v) => {
        __privateGet(this, _cache).set(cacheKey, v);
        return v;
      }).catch((err) => {
        __privateGet(this, _cache).delete(cacheKey);
        throw err;
      });
    }
    return result;
  }
  readSync(key, load) {
    const cacheKey = [__privateGet(this, _prefix), ...key].join(":");
    if (__privateGet(this, _cache).has(cacheKey)) {
      return __privateGet(this, _cache).get(cacheKey);
    }
    const result = load();
    __privateGet(this, _cache).set(cacheKey, result);
    return result;
  }
  clear(prefix) {
    const prefixKey = [...__privateGet(this, _prefix), ...prefix ?? []].join(":");
    if (!prefixKey) {
      __privateGet(this, _cache).clear();
      return;
    }
    for (const key of __privateGet(this, _cache).keys()) {
      if (key.startsWith(prefixKey)) {
        __privateGet(this, _cache).delete(key);
      }
    }
  }
  scope(prefix) {
    return new _ClientCache2({
      prefix: [...__privateGet(this, _prefix), ...Array.isArray(prefix) ? prefix : [prefix]],
      cache: __privateGet(this, _cache)
    });
  }
};
_prefix = /* @__PURE__ */ new WeakMap();
_cache = /* @__PURE__ */ new WeakMap();
var ClientCache = _ClientCache;

// node_modules/@mysten/sui/dist/esm/version.js
var PACKAGE_VERSION = "1.43.1";
var TARGETED_RPC_VERSION = "1.60.0";

// node_modules/@mysten/sui/dist/esm/experimental/mvr.js
var __typeError2 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck2 = (obj, member, msg) => member.has(obj) || __typeError2("Cannot " + msg);
var __privateGet2 = (obj, member, getter) => (__accessCheck2(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd2 = (obj, member, value) => member.has(obj) ? __typeError2("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet2 = (obj, member, value, setter) => (__accessCheck2(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck2(obj, member, "access private method"), method);
var _cache2;
var _url;
var _pageSize;
var _overrides;
var _MvrClient_instances;
var mvrPackageDataLoader_get;
var mvrTypeDataLoader_get;
var resolvePackages_fn;
var resolveTypes_fn;
var fetch_fn;
var NAME_SEPARATOR = "/";
var MVR_API_HEADER = {
  "Mvr-Source": `@mysten/sui@${PACKAGE_VERSION}`
};
var MvrClient = class {
  constructor({ cache, url, pageSize = 50, overrides }) {
    __privateAdd2(this, _MvrClient_instances);
    __privateAdd2(this, _cache2);
    __privateAdd2(this, _url);
    __privateAdd2(this, _pageSize);
    __privateAdd2(this, _overrides);
    __privateSet2(this, _cache2, cache);
    __privateSet2(this, _url, url);
    __privateSet2(this, _pageSize, pageSize);
    __privateSet2(this, _overrides, {
      packages: overrides?.packages,
      types: overrides?.types
    });
    validateOverrides(__privateGet2(this, _overrides));
  }
  async resolvePackage({
    package: name
  }) {
    if (!hasMvrName(name)) {
      return {
        package: name
      };
    }
    const resolved = await __privateGet2(this, _MvrClient_instances, mvrPackageDataLoader_get).load(name);
    return {
      package: resolved
    };
  }
  async resolveType({
    type
  }) {
    if (!hasMvrName(type)) {
      return {
        type
      };
    }
    const mvrTypes = [...extractMvrTypes(type)];
    const resolvedTypes = await __privateGet2(this, _MvrClient_instances, mvrTypeDataLoader_get).loadMany(mvrTypes);
    const typeMap = {};
    for (let i = 0; i < mvrTypes.length; i++) {
      const resolvedType = resolvedTypes[i];
      if (resolvedType instanceof Error) {
        throw resolvedType;
      }
      typeMap[mvrTypes[i]] = resolvedType;
    }
    return {
      type: replaceMvrNames(type, typeMap)
    };
  }
  async resolve({
    types = [],
    packages = []
  }) {
    const mvrTypes = /* @__PURE__ */ new Set();
    for (const type of types ?? []) {
      extractMvrTypes(type, mvrTypes);
    }
    const typesArray = [...mvrTypes];
    const [resolvedTypes, resolvedPackages] = await Promise.all([
      typesArray.length > 0 ? __privateGet2(this, _MvrClient_instances, mvrTypeDataLoader_get).loadMany(typesArray) : [],
      packages.length > 0 ? __privateGet2(this, _MvrClient_instances, mvrPackageDataLoader_get).loadMany(packages) : []
    ]);
    const typeMap = __spreadValues({}, __privateGet2(this, _overrides)?.types);
    for (const [i, type] of typesArray.entries()) {
      const resolvedType = resolvedTypes[i];
      if (resolvedType instanceof Error) {
        throw resolvedType;
      }
      typeMap[type] = resolvedType;
    }
    const replacedTypes = {};
    for (const type of types ?? []) {
      const resolvedType = replaceMvrNames(type, typeMap);
      replacedTypes[type] = {
        type: resolvedType
      };
    }
    const replacedPackages = {};
    for (const [i, pkg] of (packages ?? []).entries()) {
      const resolvedPkg = __privateGet2(this, _overrides)?.packages?.[pkg] ?? resolvedPackages[i];
      if (resolvedPkg instanceof Error) {
        throw resolvedPkg;
      }
      replacedPackages[pkg] = {
        package: resolvedPkg
      };
    }
    return {
      types: replacedTypes,
      packages: replacedPackages
    };
  }
};
_cache2 = /* @__PURE__ */ new WeakMap();
_url = /* @__PURE__ */ new WeakMap();
_pageSize = /* @__PURE__ */ new WeakMap();
_overrides = /* @__PURE__ */ new WeakMap();
_MvrClient_instances = /* @__PURE__ */ new WeakSet();
mvrPackageDataLoader_get = function() {
  return __privateGet2(this, _cache2).readSync(["#mvrPackageDataLoader", __privateGet2(this, _url) ?? ""], () => {
    const loader = new DataLoader(async (packages) => {
      if (!__privateGet2(this, _url)) {
        throw new Error(
          `MVR Api URL is not set for the current client (resolving ${packages.join(", ")})`
        );
      }
      const resolved = await __privateMethod(this, _MvrClient_instances, resolvePackages_fn).call(this, packages);
      return packages.map(
        (pkg) => resolved[pkg] ?? new Error(`Failed to resolve package: ${pkg}`)
      );
    });
    const overrides = __privateGet2(this, _overrides)?.packages;
    if (overrides) {
      for (const [pkg, id] of Object.entries(overrides)) {
        loader.prime(pkg, id);
      }
    }
    return loader;
  });
};
mvrTypeDataLoader_get = function() {
  return __privateGet2(this, _cache2).readSync(["#mvrTypeDataLoader", __privateGet2(this, _url) ?? ""], () => {
    const loader = new DataLoader(async (types) => {
      if (!__privateGet2(this, _url)) {
        throw new Error(
          `MVR Api URL is not set for the current client (resolving ${types.join(", ")})`
        );
      }
      const resolved = await __privateMethod(this, _MvrClient_instances, resolveTypes_fn).call(this, types);
      return types.map((type) => resolved[type] ?? new Error(`Failed to resolve type: ${type}`));
    });
    const overrides = __privateGet2(this, _overrides)?.types;
    if (overrides) {
      for (const [type, id] of Object.entries(overrides)) {
        loader.prime(type, id);
      }
    }
    return loader;
  });
};
resolvePackages_fn = async function(packages) {
  if (packages.length === 0) return {};
  const batches = chunk(packages, __privateGet2(this, _pageSize));
  const results = {};
  await Promise.all(
    batches.map(async (batch) => {
      const data = await __privateMethod(this, _MvrClient_instances, fetch_fn).call(this, "/v1/resolution/bulk", {
        names: batch
      });
      if (!data?.resolution) return;
      for (const pkg of Object.keys(data?.resolution)) {
        const pkgData = data.resolution[pkg]?.package_id;
        if (!pkgData) continue;
        results[pkg] = pkgData;
      }
    })
  );
  return results;
};
resolveTypes_fn = async function(types) {
  if (types.length === 0) return {};
  const batches = chunk(types, __privateGet2(this, _pageSize));
  const results = {};
  await Promise.all(
    batches.map(async (batch) => {
      const data = await __privateMethod(this, _MvrClient_instances, fetch_fn).call(this, "/v1/struct-definition/bulk", {
        types: batch
      });
      if (!data?.resolution) return;
      for (const type of Object.keys(data?.resolution)) {
        const typeData = data.resolution[type]?.type_tag;
        if (!typeData) continue;
        results[type] = typeData;
      }
    })
  );
  return results;
};
fetch_fn = async function(url, body) {
  if (!__privateGet2(this, _url)) {
    throw new Error("MVR Api URL is not set for the current client");
  }
  const response = await fetch(`${__privateGet2(this, _url)}${url}`, {
    method: "POST",
    headers: __spreadValues({
      "Content-Type": "application/json"
    }, MVR_API_HEADER),
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Failed to resolve types: ${errorBody?.message}`);
  }
  return response.json();
};
function validateOverrides(overrides) {
  if (overrides?.packages) {
    for (const [pkg, id] of Object.entries(overrides.packages)) {
      if (!isValidNamedPackage(pkg)) {
        throw new Error(`Invalid package name: ${pkg}`);
      }
      if (!isValidSuiAddress(normalizeSuiAddress(id))) {
        throw new Error(`Invalid package ID: ${id}`);
      }
    }
  }
  if (overrides?.types) {
    for (const [type, val] of Object.entries(overrides.types)) {
      if (parseStructTag(type).typeParams.length > 0) {
        throw new Error(
          "Type overrides must be first-level only. If you want to supply generic types, just pass each type individually."
        );
      }
      const parsedValue = parseStructTag(val);
      if (!isValidSuiAddress(parsedValue.address)) {
        throw new Error(`Invalid type: ${val}`);
      }
    }
  }
}
function extractMvrTypes(type, types = /* @__PURE__ */ new Set()) {
  if (typeof type === "string" && !hasMvrName(type)) return types;
  const tag = isStructTag(type) ? type : parseStructTag(type);
  if (hasMvrName(tag.address)) types.add(`${tag.address}::${tag.module}::${tag.name}`);
  for (const param of tag.typeParams) {
    extractMvrTypes(param, types);
  }
  return types;
}
function replaceMvrNames(tag, typeCache) {
  const type = isStructTag(tag) ? tag : parseStructTag(tag);
  const typeTag = `${type.address}::${type.module}::${type.name}`;
  const cacheHit = typeCache[typeTag];
  return normalizeStructTag(__spreadProps(__spreadValues({}, type), {
    address: cacheHit ? cacheHit.split("::")[0] : type.address,
    typeParams: type.typeParams.map((param) => replaceMvrNames(param, typeCache))
  }));
}
function hasMvrName(nameOrType) {
  return nameOrType.includes(NAME_SEPARATOR) || nameOrType.includes("@") || nameOrType.includes(".sui");
}
function isStructTag(type) {
  return typeof type === "object" && "address" in type && "module" in type && "name" in type && "typeParams" in type;
}
function findNamesInTransaction(builder) {
  const packages = /* @__PURE__ */ new Set();
  const types = /* @__PURE__ */ new Set();
  for (const command of builder.commands) {
    switch (command.$kind) {
      case "MakeMoveVec":
        if (command.MakeMoveVec.type) {
          getNamesFromTypeList([command.MakeMoveVec.type]).forEach((type) => {
            types.add(type);
          });
        }
        break;
      case "MoveCall":
        const moveCall = command.MoveCall;
        const pkg = moveCall.package.split("::")[0];
        if (hasMvrName(pkg)) {
          if (!isValidNamedPackage(pkg)) throw new Error(`Invalid package name: ${pkg}`);
          packages.add(pkg);
        }
        getNamesFromTypeList(moveCall.typeArguments ?? []).forEach((type) => {
          types.add(type);
        });
        break;
      default:
        break;
    }
  }
  return {
    packages: [...packages],
    types: [...types]
  };
}
function replaceNames(builder, resolved) {
  for (const command of builder.commands) {
    if (command.MakeMoveVec?.type) {
      if (!hasMvrName(command.MakeMoveVec.type)) continue;
      if (!resolved.types[command.MakeMoveVec.type])
        throw new Error(`No resolution found for type: ${command.MakeMoveVec.type}`);
      command.MakeMoveVec.type = resolved.types[command.MakeMoveVec.type].type;
    }
    const tx = command.MoveCall;
    if (!tx) continue;
    const nameParts = tx.package.split("::");
    const name = nameParts[0];
    if (hasMvrName(name) && !resolved.packages[name])
      throw new Error(`No address found for package: ${name}`);
    if (hasMvrName(name)) {
      nameParts[0] = resolved.packages[name].package;
      tx.package = nameParts.join("::");
    }
    const types = tx.typeArguments;
    if (!types) continue;
    for (let i = 0; i < types.length; i++) {
      if (!hasMvrName(types[i])) continue;
      if (!resolved.types[types[i]]) throw new Error(`No resolution found for type: ${types[i]}`);
      types[i] = resolved.types[types[i]].type;
    }
    tx.typeArguments = types;
  }
}
function getNamesFromTypeList(types) {
  const names = /* @__PURE__ */ new Set();
  for (const type of types) {
    if (hasMvrName(type)) {
      if (!isValidNamedType(type)) throw new Error(`Invalid type with names: ${type}`);
      names.add(type);
    }
  }
  return names;
}

// node_modules/@mysten/sui/dist/esm/transactions/plugins/NamedPackagesPlugin.js
var cacheMap = /* @__PURE__ */ new WeakMap();
var namedPackagesPlugin = (options) => {
  let mvrClient;
  if (options) {
    const overrides = options.overrides ?? {
      packages: {},
      types: {}
    };
    if (!cacheMap.has(overrides)) {
      cacheMap.set(overrides, new ClientCache());
    }
    mvrClient = new MvrClient({
      cache: cacheMap.get(overrides),
      url: options.url,
      pageSize: options.pageSize,
      overrides
    });
  }
  return async (transactionData, buildOptions, next) => {
    const names = findNamesInTransaction(transactionData);
    if (names.types.length === 0 && names.packages.length === 0) {
      return next();
    }
    const resolved = await (mvrClient || getClient(buildOptions).core.mvr).resolve({
      types: names.types,
      packages: names.packages
    });
    replaceNames(transactionData, resolved);
    await next();
  };
};
function getClient(options) {
  if (!options.client) {
    throw new Error(
      `No sui client passed to Transaction#build, but transaction data was not sufficient to build offline.`
    );
  }
  return options.client;
}

// node_modules/@mysten/sui/dist/esm/transactions/data/v2.js
function enumUnion(options) {
  return union(
    Object.entries(options).map(([key, value]) => object({ [key]: value }))
  );
}
var Argument = enumUnion({
  GasCoin: literal(true),
  Input: pipe(number(), integer()),
  Result: pipe(number(), integer()),
  NestedResult: tuple([pipe(number(), integer()), pipe(number(), integer())])
});
var GasData = object({
  budget: nullable(JsonU64),
  price: nullable(JsonU64),
  owner: nullable(SuiAddress),
  payment: nullable(array(ObjectRefSchema))
});
var ProgrammableMoveCall = object({
  package: ObjectID,
  module: string(),
  function: string(),
  // snake case in rust
  typeArguments: array(string()),
  arguments: array(Argument)
});
var $Intent2 = object({
  name: string(),
  inputs: record(string(), union([Argument, array(Argument)])),
  data: record(string(), unknown())
});
var Command = enumUnion({
  MoveCall: ProgrammableMoveCall,
  TransferObjects: object({
    objects: array(Argument),
    address: Argument
  }),
  SplitCoins: object({
    coin: Argument,
    amounts: array(Argument)
  }),
  MergeCoins: object({
    destination: Argument,
    sources: array(Argument)
  }),
  Publish: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID)
  }),
  MakeMoveVec: object({
    type: nullable(string()),
    elements: array(Argument)
  }),
  Upgrade: object({
    modules: array(BCSBytes),
    dependencies: array(ObjectID),
    package: ObjectID,
    ticket: Argument
  }),
  $Intent: $Intent2
});
var ObjectArg2 = enumUnion({
  ImmOrOwnedObject: ObjectRefSchema,
  SharedObject: object({
    objectId: ObjectID,
    // snake case in rust
    initialSharedVersion: JsonU64,
    mutable: boolean()
  }),
  Receiving: ObjectRefSchema
});
var CallArg = enumUnion({
  Object: ObjectArg2,
  Pure: object({
    bytes: BCSBytes
  }),
  UnresolvedPure: object({
    value: unknown()
  }),
  UnresolvedObject: object({
    objectId: ObjectID,
    version: optional(nullable(JsonU64)),
    digest: optional(nullable(string())),
    initialSharedVersion: optional(nullable(JsonU64)),
    mutable: optional(nullable(boolean()))
  })
});
var TransactionExpiration3 = enumUnion({
  None: literal(true),
  Epoch: JsonU64
});
var SerializedTransactionDataV2Schema = object({
  version: literal(2),
  sender: nullish(SuiAddress),
  expiration: nullish(TransactionExpiration3),
  gasData: GasData,
  inputs: array(CallArg),
  commands: array(Command),
  digest: optional(nullable(string()))
});

// node_modules/@mysten/sui/dist/esm/jsonRpc/json-rpc-resolver.js
var MAX_OBJECTS_PER_FETCH = 50;
var GAS_SAFE_OVERHEAD = 1000n;
var MAX_GAS = 5e10;
function jsonRpcClientResolveTransactionPlugin(client) {
  return async function resolveTransactionData(transactionData, options, next) {
    await normalizeInputs(transactionData, client);
    await resolveObjectReferences(transactionData, client);
    if (!options.onlyTransactionKind) {
      await setGasPrice(transactionData, client);
      await setGasBudget(transactionData, client);
      await setGasPayment(transactionData, client);
    }
    return await next();
  };
}
async function setGasPrice(transactionData, client) {
  if (!transactionData.gasConfig.price) {
    transactionData.gasConfig.price = String(await client.getReferenceGasPrice());
  }
}
async function setGasBudget(transactionData, client) {
  if (transactionData.gasConfig.budget) {
    return;
  }
  const dryRunResult = await client.dryRunTransactionBlock({
    transactionBlock: transactionData.build({
      overrides: {
        gasData: {
          budget: String(MAX_GAS),
          payment: []
        }
      }
    })
  });
  if (dryRunResult.effects.status.status !== "success") {
    throw new Error(
      `Dry run failed, could not automatically determine a budget: ${dryRunResult.effects.status.error}`,
      { cause: dryRunResult }
    );
  }
  const safeOverhead = GAS_SAFE_OVERHEAD * BigInt(transactionData.gasConfig.price || 1n);
  const baseComputationCostWithOverhead = BigInt(dryRunResult.effects.gasUsed.computationCost) + safeOverhead;
  const gasBudget = baseComputationCostWithOverhead + BigInt(dryRunResult.effects.gasUsed.storageCost) - BigInt(dryRunResult.effects.gasUsed.storageRebate);
  transactionData.gasConfig.budget = String(
    gasBudget > baseComputationCostWithOverhead ? gasBudget : baseComputationCostWithOverhead
  );
}
async function setGasPayment(transactionData, client) {
  if (!transactionData.gasConfig.payment) {
    const coins = await client.getCoins({
      owner: transactionData.gasConfig.owner || transactionData.sender,
      coinType: SUI_TYPE_ARG
    });
    const paymentCoins = coins.data.filter((coin) => {
      const matchingInput = transactionData.inputs.find((input) => {
        if (input.Object?.ImmOrOwnedObject) {
          return coin.coinObjectId === input.Object.ImmOrOwnedObject.objectId;
        }
        return false;
      });
      return !matchingInput;
    }).map((coin) => ({
      objectId: coin.coinObjectId,
      digest: coin.digest,
      version: coin.version
    }));
    if (!paymentCoins.length) {
      throw new Error("No valid gas coins found for the transaction.");
    }
    transactionData.gasConfig.payment = paymentCoins.map(
      (payment) => parse(ObjectRefSchema, payment)
    );
  }
}
async function resolveObjectReferences(transactionData, client) {
  const objectsToResolve = transactionData.inputs.filter((input) => {
    return input.UnresolvedObject && !(input.UnresolvedObject.version || input.UnresolvedObject?.initialSharedVersion);
  });
  const dedupedIds = [
    ...new Set(
      objectsToResolve.map((input) => normalizeSuiObjectId(input.UnresolvedObject.objectId))
    )
  ];
  const objectChunks = dedupedIds.length ? chunk(dedupedIds, MAX_OBJECTS_PER_FETCH) : [];
  const resolved = (await Promise.all(
    objectChunks.map(
      (chunk2) => client.multiGetObjects({
        ids: chunk2,
        options: { showOwner: true }
      })
    )
  )).flat();
  const responsesById = new Map(
    dedupedIds.map((id, index) => {
      return [id, resolved[index]];
    })
  );
  const invalidObjects = Array.from(responsesById).filter(([_, obj]) => obj.error).map(([_, obj]) => JSON.stringify(obj.error));
  if (invalidObjects.length) {
    throw new Error(`The following input objects are invalid: ${invalidObjects.join(", ")}`);
  }
  const objects = resolved.map((object2) => {
    if (object2.error || !object2.data) {
      throw new Error(`Failed to fetch object: ${object2.error}`);
    }
    const owner = object2.data.owner;
    const initialSharedVersion = owner && typeof owner === "object" ? "Shared" in owner ? owner.Shared.initial_shared_version : "ConsensusAddressOwner" in owner ? owner.ConsensusAddressOwner.start_version : null : null;
    return {
      objectId: object2.data.objectId,
      digest: object2.data.digest,
      version: object2.data.version,
      initialSharedVersion
    };
  });
  const objectsById = new Map(
    dedupedIds.map((id, index) => {
      return [id, objects[index]];
    })
  );
  for (const [index, input] of transactionData.inputs.entries()) {
    if (!input.UnresolvedObject) {
      continue;
    }
    let updated;
    const id = normalizeSuiAddress(input.UnresolvedObject.objectId);
    const object2 = objectsById.get(id);
    if (input.UnresolvedObject.initialSharedVersion ?? object2?.initialSharedVersion) {
      updated = Inputs.SharedObjectRef({
        objectId: id,
        initialSharedVersion: input.UnresolvedObject.initialSharedVersion || object2?.initialSharedVersion,
        mutable: input.UnresolvedObject.mutable || isUsedAsMutable(transactionData, index)
      });
    } else if (isUsedAsReceiving(transactionData, index)) {
      updated = Inputs.ReceivingRef(
        {
          objectId: id,
          digest: input.UnresolvedObject.digest ?? object2?.digest,
          version: input.UnresolvedObject.version ?? object2?.version
        }
      );
    }
    transactionData.inputs[transactionData.inputs.indexOf(input)] = updated ?? Inputs.ObjectRef({
      objectId: id,
      digest: input.UnresolvedObject.digest ?? object2?.digest,
      version: input.UnresolvedObject.version ?? object2?.version
    });
  }
}
async function normalizeInputs(transactionData, client) {
  const { inputs, commands } = transactionData;
  const moveCallsToResolve = [];
  const moveFunctionsToResolve = /* @__PURE__ */ new Set();
  commands.forEach((command) => {
    if (command.MoveCall) {
      if (command.MoveCall._argumentTypes) {
        return;
      }
      const inputs2 = command.MoveCall.arguments.map((arg) => {
        if (arg.$kind === "Input") {
          return transactionData.inputs[arg.Input];
        }
        return null;
      });
      const needsResolution = inputs2.some(
        (input) => input?.UnresolvedPure || input?.UnresolvedObject && typeof input?.UnresolvedObject.mutable !== "boolean"
      );
      if (needsResolution) {
        const functionName = `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`;
        moveFunctionsToResolve.add(functionName);
        moveCallsToResolve.push(command.MoveCall);
      }
    }
  });
  const moveFunctionParameters = /* @__PURE__ */ new Map();
  if (moveFunctionsToResolve.size > 0) {
    await Promise.all(
      [...moveFunctionsToResolve].map(async (functionName) => {
        const [packageId, moduleId, functionId] = functionName.split("::");
        const def = await client.getNormalizedMoveFunction({
          package: packageId,
          module: moduleId,
          function: functionId
        });
        moveFunctionParameters.set(
          functionName,
          def.parameters.map((param) => normalizedTypeToMoveTypeSignature(param))
        );
      })
    );
  }
  if (moveCallsToResolve.length) {
    await Promise.all(
      moveCallsToResolve.map(async (moveCall) => {
        const parameters = moveFunctionParameters.get(
          `${moveCall.package}::${moveCall.module}::${moveCall.function}`
        );
        if (!parameters) {
          return;
        }
        const hasTxContext = parameters.length > 0 && isTxContext(parameters.at(-1));
        const params = hasTxContext ? parameters.slice(0, parameters.length - 1) : parameters;
        moveCall._argumentTypes = params;
      })
    );
  }
  commands.forEach((command) => {
    if (!command.MoveCall) {
      return;
    }
    const moveCall = command.MoveCall;
    const fnName = `${moveCall.package}::${moveCall.module}::${moveCall.function}`;
    const params = moveCall._argumentTypes;
    if (!params) {
      return;
    }
    if (params.length !== command.MoveCall.arguments.length) {
      throw new Error(`Incorrect number of arguments for ${fnName}`);
    }
    params.forEach((param, i) => {
      const arg = moveCall.arguments[i];
      if (arg.$kind !== "Input") return;
      const input = inputs[arg.Input];
      if (!input.UnresolvedPure && !input.UnresolvedObject) {
        return;
      }
      const inputValue = input.UnresolvedPure?.value ?? input.UnresolvedObject?.objectId;
      const schema = getPureBcsSchema(param.body);
      if (schema) {
        arg.type = "pure";
        inputs[inputs.indexOf(input)] = Inputs.Pure(schema.serialize(inputValue));
        return;
      }
      if (typeof inputValue !== "string") {
        throw new Error(
          `Expect the argument to be an object id string, got ${JSON.stringify(
            inputValue,
            null,
            2
          )}`
        );
      }
      arg.type = "object";
      const unresolvedObject = input.UnresolvedPure ? {
        $kind: "UnresolvedObject",
        UnresolvedObject: {
          objectId: inputValue
        }
      } : input;
      inputs[arg.Input] = unresolvedObject;
    });
  });
}
function isUsedAsMutable(transactionData, index) {
  let usedAsMutable = false;
  transactionData.getInputUses(index, (arg, tx) => {
    if (tx.MoveCall && tx.MoveCall._argumentTypes) {
      const argIndex = tx.MoveCall.arguments.indexOf(arg);
      usedAsMutable = tx.MoveCall._argumentTypes[argIndex].ref !== "&" || usedAsMutable;
    }
    if (tx.$kind === "MakeMoveVec" || tx.$kind === "MergeCoins" || tx.$kind === "SplitCoins" || tx.$kind === "TransferObjects") {
      usedAsMutable = true;
    }
  });
  return usedAsMutable;
}
function isUsedAsReceiving(transactionData, index) {
  let usedAsReceiving = false;
  transactionData.getInputUses(index, (arg, tx) => {
    if (tx.MoveCall && tx.MoveCall._argumentTypes) {
      const argIndex = tx.MoveCall.arguments.indexOf(arg);
      usedAsReceiving = isReceivingType(tx.MoveCall._argumentTypes[argIndex]) || usedAsReceiving;
    }
  });
  return usedAsReceiving;
}
function isReceivingType(type) {
  if (typeof type.body !== "object" || !("datatype" in type.body)) {
    return false;
  }
  return type.body.datatype.package === "0x2" && type.body.datatype.module === "transfer" && type.body.datatype.type === "Receiving";
}

// node_modules/@mysten/sui/dist/esm/transactions/resolve.js
function needsTransactionResolution(data, options) {
  if (data.inputs.some((input) => {
    return input.UnresolvedObject || input.UnresolvedPure;
  })) {
    return true;
  }
  if (!options.onlyTransactionKind) {
    if (!data.gasConfig.price || !data.gasConfig.budget || !data.gasConfig.payment) {
      return true;
    }
  }
  return false;
}
async function resolveTransactionPlugin(transactionData, options, next) {
  normalizeRawArguments(transactionData);
  if (!needsTransactionResolution(transactionData, options)) {
    await validate(transactionData);
    return next();
  }
  const client = getClient2(options);
  const plugin = client.core?.resolveTransactionPlugin() ?? jsonRpcClientResolveTransactionPlugin(client);
  return plugin(transactionData, options, async () => {
    await validate(transactionData);
    await next();
  });
}
function validate(transactionData) {
  transactionData.inputs.forEach((input, index) => {
    if (input.$kind !== "Object" && input.$kind !== "Pure") {
      throw new Error(
        `Input at index ${index} has not been resolved.  Expected a Pure or Object input, but found ${JSON.stringify(
          input
        )}`
      );
    }
  });
}
function getClient2(options) {
  if (!options.client) {
    throw new Error(
      `No sui client passed to Transaction#build, but transaction data was not sufficient to build offline.`
    );
  }
  return options.client;
}
function normalizeRawArguments(transactionData) {
  for (const command of transactionData.commands) {
    switch (command.$kind) {
      case "SplitCoins":
        command.SplitCoins.amounts.forEach((amount) => {
          normalizeRawArgument(amount, suiBcs.U64, transactionData);
        });
        break;
      case "TransferObjects":
        normalizeRawArgument(command.TransferObjects.address, suiBcs.Address, transactionData);
        break;
    }
  }
}
function normalizeRawArgument(arg, schema, transactionData) {
  if (arg.$kind !== "Input") {
    return;
  }
  const input = transactionData.inputs[arg.Input];
  if (input.$kind !== "UnresolvedPure") {
    return;
  }
  transactionData.inputs[arg.Input] = Inputs.Pure(schema.serialize(input.UnresolvedPure.value));
}

// node_modules/@mysten/sui/dist/esm/transactions/object.js
function createObjectMethods(makeObject) {
  function object2(value) {
    return makeObject(value);
  }
  object2.system = (options) => {
    const mutable = options?.mutable;
    if (mutable !== void 0) {
      return object2(
        Inputs.SharedObjectRef({
          objectId: "0x5",
          initialSharedVersion: 1,
          mutable
        })
      );
    }
    return object2({
      $kind: "UnresolvedObject",
      UnresolvedObject: {
        objectId: "0x5",
        initialSharedVersion: 1
      }
    });
  };
  object2.clock = () => object2(
    Inputs.SharedObjectRef({
      objectId: "0x6",
      initialSharedVersion: 1,
      mutable: false
    })
  );
  object2.random = () => object2({
    $kind: "UnresolvedObject",
    UnresolvedObject: {
      objectId: "0x8",
      mutable: false
    }
  });
  object2.denyList = (options) => {
    return object2({
      $kind: "UnresolvedObject",
      UnresolvedObject: {
        objectId: "0x403",
        mutable: options?.mutable
      }
    });
  };
  object2.option = ({ type, value }) => (tx) => tx.moveCall({
    typeArguments: [type],
    target: `0x1::option::${value === null ? "none" : "some"}`,
    arguments: value === null ? [] : [tx.object(value)]
  });
  return object2;
}

// node_modules/@mysten/sui/dist/esm/transactions/pure.js
function createPure(makePure) {
  function pure(typeOrSerializedValue, value) {
    if (typeof typeOrSerializedValue === "string") {
      return makePure(pureBcsSchemaFromTypeName(typeOrSerializedValue).serialize(value));
    }
    if (typeOrSerializedValue instanceof Uint8Array || isSerializedBcs(typeOrSerializedValue)) {
      return makePure(typeOrSerializedValue);
    }
    throw new Error("tx.pure must be called either a bcs type name, or a serialized bcs value");
  }
  pure.u8 = (value) => makePure(suiBcs.U8.serialize(value));
  pure.u16 = (value) => makePure(suiBcs.U16.serialize(value));
  pure.u32 = (value) => makePure(suiBcs.U32.serialize(value));
  pure.u64 = (value) => makePure(suiBcs.U64.serialize(value));
  pure.u128 = (value) => makePure(suiBcs.U128.serialize(value));
  pure.u256 = (value) => makePure(suiBcs.U256.serialize(value));
  pure.bool = (value) => makePure(suiBcs.Bool.serialize(value));
  pure.string = (value) => makePure(suiBcs.String.serialize(value));
  pure.address = (value) => makePure(suiBcs.Address.serialize(value));
  pure.id = pure.address;
  pure.vector = (type, value) => {
    return makePure(
      suiBcs.vector(pureBcsSchemaFromTypeName(type)).serialize(value)
    );
  };
  pure.option = (type, value) => {
    return makePure(suiBcs.option(pureBcsSchemaFromTypeName(type)).serialize(value));
  };
  return pure;
}

// node_modules/@mysten/sui/dist/esm/transactions/Transaction.js
var __typeError3 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck3 = (obj, member, msg) => member.has(obj) || __typeError3("Cannot " + msg);
var __privateGet3 = (obj, member, getter) => (__accessCheck3(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd3 = (obj, member, value) => member.has(obj) ? __typeError3("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet3 = (obj, member, value, setter) => (__accessCheck3(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod2 = (obj, member, method) => (__accessCheck3(obj, member, "access private method"), method);
var _serializationPlugins;
var _buildPlugins;
var _intentResolvers;
var _inputSection;
var _commandSection;
var _availableResults;
var _pendingPromises;
var _added;
var _data;
var _Transaction_instances;
var fork_fn;
var addCommand_fn;
var addInput_fn;
var normalizeTransactionArgument_fn;
var resolveArgument_fn;
var prepareBuild_fn;
var runPlugins_fn;
var waitForPendingTasks_fn;
var sortCommandsAndInputs_fn;
function createTransactionResult(index, length = Infinity) {
  const baseResult = {
    $kind: "Result",
    get Result() {
      return typeof index === "function" ? index() : index;
    }
  };
  const nestedResults = [];
  const nestedResultFor = (resultIndex) => nestedResults[resultIndex] ?? (nestedResults[resultIndex] = {
    $kind: "NestedResult",
    get NestedResult() {
      return [typeof index === "function" ? index() : index, resultIndex];
    }
  });
  return new Proxy(baseResult, {
    set() {
      throw new Error(
        "The transaction result is a proxy, and does not support setting properties directly"
      );
    },
    // TODO: Instead of making this return a concrete argument, we should ideally
    // make it reference-based (so that this gets resolved at build-time), which
    // allows re-ordering transactions.
    get(target, property) {
      if (property in target) {
        return Reflect.get(target, property);
      }
      if (property === Symbol.iterator) {
        return function* () {
          let i = 0;
          while (i < length) {
            yield nestedResultFor(i);
            i++;
          }
        };
      }
      if (typeof property === "symbol") return;
      const resultIndex = parseInt(property, 10);
      if (Number.isNaN(resultIndex) || resultIndex < 0) return;
      return nestedResultFor(resultIndex);
    }
  });
}
var TRANSACTION_BRAND = Symbol.for("@mysten/transaction");
function isTransaction(obj) {
  return !!obj && typeof obj === "object" && obj[TRANSACTION_BRAND] === true;
}
var modulePluginRegistry = {
  buildPlugins: /* @__PURE__ */ new Map(),
  serializationPlugins: /* @__PURE__ */ new Map()
};
var TRANSACTION_REGISTRY_KEY = Symbol.for("@mysten/transaction/registry");
function getGlobalPluginRegistry() {
  try {
    const target = globalThis;
    if (!target[TRANSACTION_REGISTRY_KEY]) {
      target[TRANSACTION_REGISTRY_KEY] = modulePluginRegistry;
    }
    return target[TRANSACTION_REGISTRY_KEY];
  } catch {
    return modulePluginRegistry;
  }
}
var _Transaction = class _Transaction2 {
  constructor() {
    __privateAdd3(this, _Transaction_instances);
    __privateAdd3(this, _serializationPlugins);
    __privateAdd3(this, _buildPlugins);
    __privateAdd3(this, _intentResolvers, /* @__PURE__ */ new Map());
    __privateAdd3(this, _inputSection, []);
    __privateAdd3(this, _commandSection, []);
    __privateAdd3(this, _availableResults, /* @__PURE__ */ new Set());
    __privateAdd3(this, _pendingPromises, /* @__PURE__ */ new Set());
    __privateAdd3(this, _added, /* @__PURE__ */ new Map());
    __privateAdd3(this, _data);
    this.object = createObjectMethods(
      (value) => {
        if (typeof value === "function") {
          return this.object(this.add(value));
        }
        if (typeof value === "object" && is(ArgumentSchema, value)) {
          return value;
        }
        const id = getIdFromCallArg(value);
        const inserted = __privateGet3(this, _data).inputs.find((i) => id === getIdFromCallArg(i));
        if (inserted?.Object?.SharedObject && typeof value === "object" && value.Object?.SharedObject) {
          inserted.Object.SharedObject.mutable = inserted.Object.SharedObject.mutable || value.Object.SharedObject.mutable;
        }
        return inserted ? { $kind: "Input", Input: __privateGet3(this, _data).inputs.indexOf(inserted), type: "object" } : __privateMethod2(this, _Transaction_instances, addInput_fn).call(this, "object", typeof value === "string" ? {
          $kind: "UnresolvedObject",
          UnresolvedObject: { objectId: normalizeSuiAddress(value) }
        } : value);
      }
    );
    const globalPlugins = getGlobalPluginRegistry();
    __privateSet3(this, _data, new TransactionDataBuilder());
    __privateSet3(this, _buildPlugins, [...globalPlugins.buildPlugins.values()]);
    __privateSet3(this, _serializationPlugins, [...globalPlugins.serializationPlugins.values()]);
  }
  /**
   * Converts from a serialize transaction kind (built with `build({ onlyTransactionKind: true })`) to a `Transaction` class.
   * Supports either a byte array, or base64-encoded bytes.
   */
  static fromKind(serialized) {
    const tx = new _Transaction2();
    __privateSet3(tx, _data, TransactionDataBuilder.fromKindBytes(
      typeof serialized === "string" ? fromBase64(serialized) : serialized
    ));
    __privateSet3(tx, _inputSection, __privateGet3(tx, _data).inputs.slice());
    __privateSet3(tx, _commandSection, __privateGet3(tx, _data).commands.slice());
    __privateSet3(tx, _availableResults, new Set(__privateGet3(tx, _commandSection).map((_, i) => i)));
    return tx;
  }
  /**
   * Converts from a serialized transaction format to a `Transaction` class.
   * There are two supported serialized formats:
   * - A string returned from `Transaction#serialize`. The serialized format must be compatible, or it will throw an error.
   * - A byte array (or base64-encoded bytes) containing BCS transaction data.
   */
  static from(transaction) {
    const newTransaction = new _Transaction2();
    if (isTransaction(transaction)) {
      __privateSet3(newTransaction, _data, TransactionDataBuilder.restore(
        transaction.getData()
      ));
    } else if (typeof transaction !== "string" || !transaction.startsWith("{")) {
      __privateSet3(newTransaction, _data, TransactionDataBuilder.fromBytes(
        typeof transaction === "string" ? fromBase64(transaction) : transaction
      ));
    } else {
      __privateSet3(newTransaction, _data, TransactionDataBuilder.restore(JSON.parse(transaction)));
    }
    __privateSet3(newTransaction, _inputSection, __privateGet3(newTransaction, _data).inputs.slice());
    __privateSet3(newTransaction, _commandSection, __privateGet3(newTransaction, _data).commands.slice());
    __privateSet3(newTransaction, _availableResults, new Set(__privateGet3(newTransaction, _commandSection).map((_, i) => i)));
    return newTransaction;
  }
  static registerGlobalSerializationPlugin(stepOrStep, step) {
    getGlobalPluginRegistry().serializationPlugins.set(
      stepOrStep,
      step ?? stepOrStep
    );
  }
  static unregisterGlobalSerializationPlugin(name) {
    getGlobalPluginRegistry().serializationPlugins.delete(name);
  }
  static registerGlobalBuildPlugin(stepOrStep, step) {
    getGlobalPluginRegistry().buildPlugins.set(
      stepOrStep,
      step ?? stepOrStep
    );
  }
  static unregisterGlobalBuildPlugin(name) {
    getGlobalPluginRegistry().buildPlugins.delete(name);
  }
  addSerializationPlugin(step) {
    __privateGet3(this, _serializationPlugins).push(step);
  }
  addBuildPlugin(step) {
    __privateGet3(this, _buildPlugins).push(step);
  }
  addIntentResolver(intent, resolver) {
    if (__privateGet3(this, _intentResolvers).has(intent) && __privateGet3(this, _intentResolvers).get(intent) !== resolver) {
      throw new Error(`Intent resolver for ${intent} already exists`);
    }
    __privateGet3(this, _intentResolvers).set(intent, resolver);
  }
  setSender(sender) {
    __privateGet3(this, _data).sender = sender;
  }
  /**
   * Sets the sender only if it has not already been set.
   * This is useful for sponsored transaction flows where the sender may not be the same as the signer address.
   */
  setSenderIfNotSet(sender) {
    if (!__privateGet3(this, _data).sender) {
      __privateGet3(this, _data).sender = sender;
    }
  }
  setExpiration(expiration) {
    __privateGet3(this, _data).expiration = expiration ? parse(TransactionExpiration, expiration) : null;
  }
  setGasPrice(price) {
    __privateGet3(this, _data).gasConfig.price = String(price);
  }
  setGasBudget(budget) {
    __privateGet3(this, _data).gasConfig.budget = String(budget);
  }
  setGasBudgetIfNotSet(budget) {
    if (__privateGet3(this, _data).gasData.budget == null) {
      __privateGet3(this, _data).gasConfig.budget = String(budget);
    }
  }
  setGasOwner(owner) {
    __privateGet3(this, _data).gasConfig.owner = owner;
  }
  setGasPayment(payments) {
    __privateGet3(this, _data).gasConfig.payment = payments.map((payment) => parse(ObjectRefSchema, payment));
  }
  /** @deprecated Use `getData()` instead. */
  get blockData() {
    return serializeV1TransactionData(__privateGet3(this, _data).snapshot());
  }
  /** Get a snapshot of the transaction data, in JSON form: */
  getData() {
    return __privateGet3(this, _data).snapshot();
  }
  // Used to brand transaction classes so that they can be identified, even between multiple copies
  // of the builder.
  get [TRANSACTION_BRAND]() {
    return true;
  }
  // Temporary workaround for the wallet interface accidentally serializing transactions via postMessage
  get pure() {
    Object.defineProperty(this, "pure", {
      enumerable: false,
      value: createPure((value) => {
        if (isSerializedBcs(value)) {
          return __privateMethod2(this, _Transaction_instances, addInput_fn).call(this, "pure", {
            $kind: "Pure",
            Pure: {
              bytes: value.toBase64()
            }
          });
        }
        return __privateMethod2(this, _Transaction_instances, addInput_fn).call(this, "pure", is(NormalizedCallArg, value) ? parse(NormalizedCallArg, value) : value instanceof Uint8Array ? Inputs.Pure(value) : { $kind: "UnresolvedPure", UnresolvedPure: { value } });
      })
    });
    return this.pure;
  }
  /** Returns an argument for the gas coin, to be used in a transaction. */
  get gas() {
    return { $kind: "GasCoin", GasCoin: true };
  }
  /**
   * Add a new object input to the transaction using the fully-resolved object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  objectRef(...args) {
    return this.object(Inputs.ObjectRef(...args));
  }
  /**
   * Add a new receiving input to the transaction using the fully-resolved object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  receivingRef(...args) {
    return this.object(Inputs.ReceivingRef(...args));
  }
  /**
   * Add a new shared object input to the transaction using the fully-resolved shared object reference.
   * If you only have an object ID, use `builder.object(id)` instead.
   */
  sharedObjectRef(...args) {
    return this.object(Inputs.SharedObjectRef(...args));
  }
  add(command) {
    if (typeof command === "function") {
      if (__privateGet3(this, _added).has(command)) {
        return __privateGet3(this, _added).get(command);
      }
      const fork = __privateMethod2(this, _Transaction_instances, fork_fn).call(this);
      const result = command(fork);
      if (!(result && typeof result === "object" && "then" in result)) {
        __privateSet3(this, _availableResults, __privateGet3(fork, _availableResults));
        __privateGet3(this, _added).set(command, result);
        return result;
      }
      const placeholder = __privateMethod2(this, _Transaction_instances, addCommand_fn).call(this, {
        $kind: "$Intent",
        $Intent: {
          name: "AsyncTransactionThunk",
          inputs: {},
          data: {
            resultIndex: __privateGet3(this, _data).commands.length,
            result: null
          }
        }
      });
      __privateGet3(this, _pendingPromises).add(
        Promise.resolve(result).then((result2) => {
          placeholder.$Intent.data.result = result2;
        })
      );
      const txResult = createTransactionResult(() => placeholder.$Intent.data.resultIndex);
      __privateGet3(this, _added).set(command, txResult);
      return txResult;
    } else {
      __privateMethod2(this, _Transaction_instances, addCommand_fn).call(this, command);
    }
    return createTransactionResult(__privateGet3(this, _data).commands.length - 1);
  }
  // Method shorthands:
  splitCoins(coin, amounts) {
    const command = Commands.SplitCoins(
      typeof coin === "string" ? this.object(coin) : __privateMethod2(this, _Transaction_instances, resolveArgument_fn).call(this, coin),
      amounts.map(
        (amount) => typeof amount === "number" || typeof amount === "bigint" || typeof amount === "string" ? this.pure.u64(amount) : __privateMethod2(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, amount)
      )
    );
    __privateMethod2(this, _Transaction_instances, addCommand_fn).call(this, command);
    return createTransactionResult(__privateGet3(this, _data).commands.length - 1, amounts.length);
  }
  mergeCoins(destination, sources) {
    return this.add(
      Commands.MergeCoins(
        this.object(destination),
        sources.map((src) => this.object(src))
      )
    );
  }
  publish({ modules, dependencies }) {
    return this.add(
      Commands.Publish({
        modules,
        dependencies
      })
    );
  }
  upgrade({
    modules,
    dependencies,
    package: packageId,
    ticket
  }) {
    return this.add(
      Commands.Upgrade({
        modules,
        dependencies,
        package: packageId,
        ticket: this.object(ticket)
      })
    );
  }
  moveCall(_a) {
    var _b = _a, {
      arguments: args
    } = _b, input = __objRest(_b, [
      "arguments"
    ]);
    return this.add(
      Commands.MoveCall(__spreadProps(__spreadValues({}, input), {
        arguments: args?.map((arg) => __privateMethod2(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, arg))
      }))
    );
  }
  transferObjects(objects, address) {
    return this.add(
      Commands.TransferObjects(
        objects.map((obj) => this.object(obj)),
        typeof address === "string" ? this.pure.address(address) : __privateMethod2(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, address)
      )
    );
  }
  makeMoveVec({
    type,
    elements
  }) {
    return this.add(
      Commands.MakeMoveVec({
        type,
        elements: elements.map((obj) => this.object(obj))
      })
    );
  }
  /**
   * @deprecated Use toJSON instead.
   * For synchronous serialization, you can use `getData()`
   * */
  serialize() {
    return JSON.stringify(serializeV1TransactionData(__privateGet3(this, _data).snapshot()));
  }
  async toJSON(options = {}) {
    await this.prepareForSerialization(options);
    const fullyResolved = this.isFullyResolved();
    return JSON.stringify(
      parse(
        SerializedTransactionDataV2Schema,
        fullyResolved ? __spreadProps(__spreadValues({}, __privateGet3(this, _data).snapshot()), {
          digest: __privateGet3(this, _data).getDigest()
        }) : __privateGet3(this, _data).snapshot()
      ),
      (_key, value) => typeof value === "bigint" ? value.toString() : value,
      2
    );
  }
  /** Build the transaction to BCS bytes, and sign it with the provided keypair. */
  async sign(options) {
    const _a = options, { signer } = _a, buildOptions = __objRest(_a, ["signer"]);
    const bytes = await this.build(buildOptions);
    return signer.signTransaction(bytes);
  }
  /**
   *  Ensures that:
   *  - All objects have been fully resolved to a specific version
   *  - All pure inputs have been serialized to bytes
   *  - All async thunks have been fully resolved
   *  - All transaction intents have been resolved
   * 	- The gas payment, budget, and price have been set
   *  - The transaction sender has been set
   *
   *  When true, the transaction will always be built to the same bytes and digest (unless the transaction is mutated)
   */
  isFullyResolved() {
    if (!__privateGet3(this, _data).sender) {
      return false;
    }
    if (__privateGet3(this, _pendingPromises).size > 0) {
      return false;
    }
    if (__privateGet3(this, _data).commands.some((cmd) => cmd.$Intent)) {
      return false;
    }
    if (needsTransactionResolution(__privateGet3(this, _data), {})) {
      return false;
    }
    return true;
  }
  /** Build the transaction to BCS bytes. */
  async build(options = {}) {
    await this.prepareForSerialization(options);
    await __privateMethod2(this, _Transaction_instances, prepareBuild_fn).call(this, options);
    return __privateGet3(this, _data).build({
      onlyTransactionKind: options.onlyTransactionKind
    });
  }
  /** Derive transaction digest */
  async getDigest(options = {}) {
    await this.prepareForSerialization(options);
    await __privateMethod2(this, _Transaction_instances, prepareBuild_fn).call(this, options);
    return __privateGet3(this, _data).getDigest();
  }
  async prepareForSerialization(options) {
    await __privateMethod2(this, _Transaction_instances, waitForPendingTasks_fn).call(this);
    __privateMethod2(this, _Transaction_instances, sortCommandsAndInputs_fn).call(this);
    const intents = /* @__PURE__ */ new Set();
    for (const command of __privateGet3(this, _data).commands) {
      if (command.$Intent) {
        intents.add(command.$Intent.name);
      }
    }
    const steps = [...__privateGet3(this, _serializationPlugins)];
    for (const intent of intents) {
      if (options.supportedIntents?.includes(intent)) {
        continue;
      }
      if (!__privateGet3(this, _intentResolvers).has(intent)) {
        throw new Error(`Missing intent resolver for ${intent}`);
      }
      steps.push(__privateGet3(this, _intentResolvers).get(intent));
    }
    steps.push(namedPackagesPlugin());
    await __privateMethod2(this, _Transaction_instances, runPlugins_fn).call(this, steps, options);
  }
};
_serializationPlugins = /* @__PURE__ */ new WeakMap();
_buildPlugins = /* @__PURE__ */ new WeakMap();
_intentResolvers = /* @__PURE__ */ new WeakMap();
_inputSection = /* @__PURE__ */ new WeakMap();
_commandSection = /* @__PURE__ */ new WeakMap();
_availableResults = /* @__PURE__ */ new WeakMap();
_pendingPromises = /* @__PURE__ */ new WeakMap();
_added = /* @__PURE__ */ new WeakMap();
_data = /* @__PURE__ */ new WeakMap();
_Transaction_instances = /* @__PURE__ */ new WeakSet();
fork_fn = function() {
  const fork = new _Transaction();
  __privateSet3(fork, _data, __privateGet3(this, _data));
  __privateSet3(fork, _serializationPlugins, __privateGet3(this, _serializationPlugins));
  __privateSet3(fork, _buildPlugins, __privateGet3(this, _buildPlugins));
  __privateSet3(fork, _intentResolvers, __privateGet3(this, _intentResolvers));
  __privateSet3(fork, _pendingPromises, __privateGet3(this, _pendingPromises));
  __privateSet3(fork, _availableResults, new Set(__privateGet3(this, _availableResults)));
  __privateSet3(fork, _added, __privateGet3(this, _added));
  __privateGet3(this, _inputSection).push(__privateGet3(fork, _inputSection));
  __privateGet3(this, _commandSection).push(__privateGet3(fork, _commandSection));
  return fork;
};
addCommand_fn = function(command) {
  const resultIndex = __privateGet3(this, _data).commands.length;
  __privateGet3(this, _commandSection).push(command);
  __privateGet3(this, _availableResults).add(resultIndex);
  __privateGet3(this, _data).commands.push(command);
  __privateGet3(this, _data).mapCommandArguments(resultIndex, (arg) => {
    if (arg.$kind === "Result" && !__privateGet3(this, _availableResults).has(arg.Result)) {
      throw new Error(
        `Result { Result: ${arg.Result} } is not available to use the current transaction`
      );
    }
    if (arg.$kind === "NestedResult" && !__privateGet3(this, _availableResults).has(arg.NestedResult[0])) {
      throw new Error(
        `Result { NestedResult: [${arg.NestedResult[0]}, ${arg.NestedResult[1]}] } is not available to use the current transaction`
      );
    }
    if (arg.$kind === "Input" && arg.Input >= __privateGet3(this, _data).inputs.length) {
      throw new Error(
        `Input { Input: ${arg.Input} } references an input that does not exist in the current transaction`
      );
    }
    return arg;
  });
  return command;
};
addInput_fn = function(type, input) {
  __privateGet3(this, _inputSection).push(input);
  return __privateGet3(this, _data).addInput(type, input);
};
normalizeTransactionArgument_fn = function(arg) {
  if (isSerializedBcs(arg)) {
    return this.pure(arg);
  }
  return __privateMethod2(this, _Transaction_instances, resolveArgument_fn).call(this, arg);
};
resolveArgument_fn = function(arg) {
  if (typeof arg === "function") {
    const resolved = this.add(arg);
    if (typeof resolved === "function") {
      return __privateMethod2(this, _Transaction_instances, resolveArgument_fn).call(this, resolved);
    }
    return parse(ArgumentSchema, resolved);
  }
  return parse(ArgumentSchema, arg);
};
prepareBuild_fn = async function(options) {
  if (!options.onlyTransactionKind && !__privateGet3(this, _data).sender) {
    throw new Error("Missing transaction sender");
  }
  await __privateMethod2(this, _Transaction_instances, runPlugins_fn).call(this, [...__privateGet3(this, _buildPlugins), resolveTransactionPlugin], options);
};
runPlugins_fn = async function(plugins, options) {
  try {
    const createNext = (i) => {
      if (i >= plugins.length) {
        return () => {
        };
      }
      const plugin = plugins[i];
      return async () => {
        const next = createNext(i + 1);
        let calledNext = false;
        let nextResolved = false;
        await plugin(__privateGet3(this, _data), options, async () => {
          if (calledNext) {
            throw new Error(`next() was call multiple times in TransactionPlugin ${i}`);
          }
          calledNext = true;
          await next();
          nextResolved = true;
        });
        if (!calledNext) {
          throw new Error(`next() was not called in TransactionPlugin ${i}`);
        }
        if (!nextResolved) {
          throw new Error(`next() was not awaited in TransactionPlugin ${i}`);
        }
      };
    };
    await createNext(0)();
  } finally {
    __privateSet3(this, _inputSection, __privateGet3(this, _data).inputs.slice());
    __privateSet3(this, _commandSection, __privateGet3(this, _data).commands.slice());
  }
};
waitForPendingTasks_fn = async function() {
  while (__privateGet3(this, _pendingPromises).size > 0) {
    const newPromise = Promise.all(__privateGet3(this, _pendingPromises));
    __privateGet3(this, _pendingPromises).clear();
    __privateGet3(this, _pendingPromises).add(newPromise);
    await newPromise;
    __privateGet3(this, _pendingPromises).delete(newPromise);
  }
};
sortCommandsAndInputs_fn = function() {
  const unorderedCommands = __privateGet3(this, _data).commands;
  const unorderedInputs = __privateGet3(this, _data).inputs;
  const orderedCommands = __privateGet3(this, _commandSection).flat(Infinity);
  const orderedInputs = __privateGet3(this, _inputSection).flat(Infinity);
  if (orderedCommands.length !== unorderedCommands.length) {
    throw new Error("Unexpected number of commands found in transaction data");
  }
  if (orderedInputs.length !== unorderedInputs.length) {
    throw new Error("Unexpected number of inputs found in transaction data");
  }
  const filteredCommands = orderedCommands.filter(
    (cmd) => cmd.$Intent?.name !== "AsyncTransactionThunk"
  );
  __privateGet3(this, _data).commands = filteredCommands;
  __privateGet3(this, _data).inputs = orderedInputs;
  __privateSet3(this, _commandSection, filteredCommands);
  __privateSet3(this, _inputSection, orderedInputs);
  __privateSet3(this, _availableResults, new Set(filteredCommands.map((_, i) => i)));
  function getOriginalIndex(index) {
    const command = unorderedCommands[index];
    if (command.$Intent?.name === "AsyncTransactionThunk") {
      const result = command.$Intent.data.result;
      if (result == null) {
        throw new Error("AsyncTransactionThunk has not been resolved");
      }
      return getOriginalIndex(result.Result);
    }
    const updated = filteredCommands.indexOf(command);
    if (updated === -1) {
      throw new Error("Unable to find original index for command");
    }
    return updated;
  }
  __privateGet3(this, _data).mapArguments((arg) => {
    if (arg.$kind === "Input") {
      const updated = orderedInputs.indexOf(unorderedInputs[arg.Input]);
      if (updated === -1) {
        throw new Error("Input has not been resolved");
      }
      return __spreadProps(__spreadValues({}, arg), { Input: updated });
    } else if (arg.$kind === "Result") {
      const updated = getOriginalIndex(arg.Result);
      return __spreadProps(__spreadValues({}, arg), { Result: updated });
    } else if (arg.$kind === "NestedResult") {
      const updated = getOriginalIndex(arg.NestedResult[0]);
      return __spreadProps(__spreadValues({}, arg), { NestedResult: [updated, arg.NestedResult[1]] });
    }
    return arg;
  });
  for (const [i, cmd] of unorderedCommands.entries()) {
    if (cmd.$Intent?.name === "AsyncTransactionThunk") {
      try {
        cmd.$Intent.data.resultIndex = getOriginalIndex(i);
      } catch {
      }
    }
  }
};
var Transaction = _Transaction;

export {
  getPureBcsSchema,
  normalizedTypeToMoveTypeSignature,
  Inputs,
  bigint,
  object,
  string,
  parse,
  UpgradePolicy,
  Commands,
  jsonRpcClientResolveTransactionPlugin,
  getClient2 as getClient,
  createObjectMethods,
  createPure,
  TransactionDataBuilder,
  isArgument,
  ClientCache,
  PACKAGE_VERSION,
  TARGETED_RPC_VERSION,
  MvrClient,
  hasMvrName,
  namedPackagesPlugin,
  isTransaction,
  Transaction
};
//# sourceMappingURL=chunk-OJZEUKCG.js.map
