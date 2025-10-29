import {
  Transaction,
  TransactionDataBuilder,
  bigint,
  createObjectMethods,
  createPure,
  object,
  string
} from "./chunk-IX2S6EDK.js";
import {
  fromBase64,
  normalizeStructTag,
  suiBcs,
  toBase64
} from "./chunk-YEGMFPOD.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@wallet-standard/app/lib/esm/wallets.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _AppReadyEvent_detail;
var wallets = void 0;
var registeredWalletsSet = /* @__PURE__ */ new Set();
function addRegisteredWallet(wallet) {
  cachedWalletsArray = void 0;
  registeredWalletsSet.add(wallet);
}
function removeRegisteredWallet(wallet) {
  cachedWalletsArray = void 0;
  registeredWalletsSet.delete(wallet);
}
var listeners = {};
function getWallets() {
  if (wallets)
    return wallets;
  wallets = Object.freeze({ register, get, on });
  if (typeof window === "undefined")
    return wallets;
  const api = Object.freeze({ register });
  try {
    window.addEventListener("wallet-standard:register-wallet", ({ detail: callback }) => callback(api));
  } catch (error) {
    console.error("wallet-standard:register-wallet event listener could not be added\n", error);
  }
  try {
    window.dispatchEvent(new AppReadyEvent(api));
  } catch (error) {
    console.error("wallet-standard:app-ready event could not be dispatched\n", error);
  }
  return wallets;
}
function register(...wallets2) {
  wallets2 = wallets2.filter((wallet) => !registeredWalletsSet.has(wallet));
  if (!wallets2.length)
    return () => {
    };
  wallets2.forEach((wallet) => addRegisteredWallet(wallet));
  listeners["register"]?.forEach((listener) => guard(() => listener(...wallets2)));
  return function unregister() {
    wallets2.forEach((wallet) => removeRegisteredWallet(wallet));
    listeners["unregister"]?.forEach((listener) => guard(() => listener(...wallets2)));
  };
}
var cachedWalletsArray;
function get() {
  if (!cachedWalletsArray) {
    cachedWalletsArray = [...registeredWalletsSet];
  }
  return cachedWalletsArray;
}
function on(event, listener) {
  listeners[event]?.push(listener) || (listeners[event] = [listener]);
  return function off() {
    listeners[event] = listeners[event]?.filter((existingListener) => listener !== existingListener);
  };
}
function guard(callback) {
  try {
    callback();
  } catch (error) {
    console.error(error);
  }
}
var AppReadyEvent = class extends Event {
  get detail() {
    return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
  }
  get type() {
    return "wallet-standard:app-ready";
  }
  constructor(api) {
    super("wallet-standard:app-ready", {
      bubbles: false,
      cancelable: false,
      composed: false
    });
    _AppReadyEvent_detail.set(this, void 0);
    __classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
  }
  /** @deprecated */
  preventDefault() {
    throw new Error("preventDefault cannot be called");
  }
  /** @deprecated */
  stopImmediatePropagation() {
    throw new Error("stopImmediatePropagation cannot be called");
  }
  /** @deprecated */
  stopPropagation() {
    throw new Error("stopPropagation cannot be called");
  }
};
_AppReadyEvent_detail = /* @__PURE__ */ new WeakMap();
function DEPRECATED_getWallets() {
  if (wallets)
    return wallets;
  wallets = getWallets();
  if (typeof window === "undefined")
    return wallets;
  const callbacks = window.navigator.wallets || [];
  if (!Array.isArray(callbacks)) {
    console.error("window.navigator.wallets is not an array");
    return wallets;
  }
  const { register: register2 } = wallets;
  const push = (...callbacks2) => callbacks2.forEach((callback) => guard(() => callback({ register: register2 })));
  try {
    Object.defineProperty(window.navigator, "wallets", {
      value: Object.freeze({ push })
    });
  } catch (error) {
    console.error("window.navigator.wallets could not be set");
    return wallets;
  }
  push(...callbacks);
  return wallets;
}

// node_modules/@wallet-standard/errors/lib/esm/codes.js
var WALLET_STANDARD_ERROR__REGISTRY__WALLET_NOT_FOUND = 3834e3;
var WALLET_STANDARD_ERROR__REGISTRY__WALLET_ACCOUNT_NOT_FOUND = 3834001;
var WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED = 4001e3;
var WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED = 616e4;
var WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED = 6160001;
var WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED = 6160002;

// node_modules/@wallet-standard/errors/lib/esm/messages.js
var WalletStandardErrorMessages = {
  [WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED]: "The wallet account $address does not support the chain `$chain`",
  [WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED]: "The wallet account $address does not support the `$featureName` feature",
  [WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED]: "The wallet '$walletName' does not support the `$featureName` feature",
  [WALLET_STANDARD_ERROR__REGISTRY__WALLET_ACCOUNT_NOT_FOUND]: "No account with address $address could be found in the '$walletName' wallet",
  [WALLET_STANDARD_ERROR__REGISTRY__WALLET_NOT_FOUND]: "No underlying Wallet Standard wallet could be found for this handle. This can happen if the wallet associated with the handle has been unregistered.",
  [WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED]: "The user rejected the request"
};

// node_modules/@wallet-standard/errors/lib/esm/message-formatter.js
var StateType;
(function(StateType2) {
  StateType2[StateType2["EscapeSequence"] = 0] = "EscapeSequence";
  StateType2[StateType2["Text"] = 1] = "Text";
  StateType2[StateType2["Variable"] = 2] = "Variable";
})(StateType || (StateType = {}));
var START_INDEX = "i";
var TYPE = "t";
function getHumanReadableErrorMessage(code, context = {}) {
  const messageFormatString = WalletStandardErrorMessages[code];
  if (messageFormatString.length === 0) {
    return "";
  }
  let state;
  function commitStateUpTo(endIndex) {
    if (state[TYPE] === StateType.Variable) {
      const variableName = messageFormatString.slice(state[START_INDEX] + 1, endIndex);
      fragments.push(variableName in context ? `${context[variableName]}` : `$${variableName}`);
    } else if (state[TYPE] === StateType.Text) {
      fragments.push(messageFormatString.slice(state[START_INDEX], endIndex));
    }
  }
  const fragments = [];
  messageFormatString.split("").forEach((char, ii) => {
    if (ii === 0) {
      state = {
        [START_INDEX]: 0,
        [TYPE]: messageFormatString[0] === "\\" ? StateType.EscapeSequence : messageFormatString[0] === "$" ? StateType.Variable : StateType.Text
      };
      return;
    }
    let nextState;
    switch (state[TYPE]) {
      case StateType.EscapeSequence:
        nextState = { [START_INDEX]: ii, [TYPE]: StateType.Text };
        break;
      case StateType.Text:
        if (char === "\\") {
          nextState = { [START_INDEX]: ii, [TYPE]: StateType.EscapeSequence };
        } else if (char === "$") {
          nextState = { [START_INDEX]: ii, [TYPE]: StateType.Variable };
        }
        break;
      case StateType.Variable:
        if (char === "\\") {
          nextState = { [START_INDEX]: ii, [TYPE]: StateType.EscapeSequence };
        } else if (char === "$") {
          nextState = { [START_INDEX]: ii, [TYPE]: StateType.Variable };
        } else if (!char.match(/\w/)) {
          nextState = { [START_INDEX]: ii, [TYPE]: StateType.Text };
        }
        break;
    }
    if (nextState) {
      if (state !== nextState) {
        commitStateUpTo(ii);
      }
      state = nextState;
    }
  });
  commitStateUpTo();
  return fragments.join("");
}
function getErrorMessage(code, context = {}) {
  if (true) {
    return getHumanReadableErrorMessage(code, context);
  } else {
    let decodingAdviceMessage = `Wallet Standard error #${code}; Decode this error by running \`npx @wallet-standard/errors decode -- ${code}`;
    if (Object.keys(context).length) {
      decodingAdviceMessage += ` '${encodeContextObject(context)}'`;
    }
    return `${decodingAdviceMessage}\``;
  }
}

// node_modules/@wallet-standard/errors/lib/esm/error.js
function isWalletStandardError(e, code) {
  const isWalletStandardError2 = e instanceof Error && e.name === "WalletStandardError";
  if (isWalletStandardError2) {
    if (code !== void 0) {
      return e.context.__code === code;
    }
    return true;
  }
  return false;
}
var WalletStandardError = class extends Error {
  constructor(...[code, contextAndErrorOptions]) {
    let context;
    let errorOptions;
    if (contextAndErrorOptions) {
      const _a = contextAndErrorOptions, { cause } = _a, contextRest = __objRest(_a, ["cause"]);
      if (cause) {
        errorOptions = { cause };
      }
      if (Object.keys(contextRest).length > 0) {
        context = contextRest;
      }
    }
    const message = getErrorMessage(code, context);
    super(message, errorOptions);
    this.context = __spreadValues({
      __code: code
    }, context);
    this.name = "WalletStandardError";
  }
};

// node_modules/@wallet-standard/errors/lib/esm/stack-trace.js
function safeCaptureStackTrace(...args) {
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(...args);
  }
}

// node_modules/@wallet-standard/features/lib/esm/connect.js
var StandardConnect = "standard:connect";
var Connect = StandardConnect;

// node_modules/@wallet-standard/features/lib/esm/disconnect.js
var StandardDisconnect = "standard:disconnect";
var Disconnect = StandardDisconnect;

// node_modules/@wallet-standard/features/lib/esm/events.js
var StandardEvents = "standard:events";
var Events = StandardEvents;

// node_modules/@wallet-standard/wallet/lib/esm/register.js
var __classPrivateFieldGet2 = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _RegisterWalletEvent_detail;
function registerWallet(wallet) {
  const callback = ({ register: register2 }) => register2(wallet);
  try {
    window.dispatchEvent(new RegisterWalletEvent(callback));
  } catch (error) {
    console.error("wallet-standard:register-wallet event could not be dispatched\n", error);
  }
  try {
    window.addEventListener("wallet-standard:app-ready", ({ detail: api }) => callback(api));
  } catch (error) {
    console.error("wallet-standard:app-ready event listener could not be added\n", error);
  }
}
var RegisterWalletEvent = class extends Event {
  get detail() {
    return __classPrivateFieldGet2(this, _RegisterWalletEvent_detail, "f");
  }
  get type() {
    return "wallet-standard:register-wallet";
  }
  constructor(callback) {
    super("wallet-standard:register-wallet", {
      bubbles: false,
      cancelable: false,
      composed: false
    });
    _RegisterWalletEvent_detail.set(this, void 0);
    __classPrivateFieldSet2(this, _RegisterWalletEvent_detail, callback, "f");
  }
  /** @deprecated */
  preventDefault() {
    throw new Error("preventDefault cannot be called");
  }
  /** @deprecated */
  stopImmediatePropagation() {
    throw new Error("stopImmediatePropagation cannot be called");
  }
  /** @deprecated */
  stopPropagation() {
    throw new Error("stopPropagation cannot be called");
  }
};
_RegisterWalletEvent_detail = /* @__PURE__ */ new WeakMap();
function DEPRECATED_registerWallet(wallet) {
  var _a;
  registerWallet(wallet);
  try {
    ((_a = window.navigator).wallets || (_a.wallets = [])).push(({ register: register2 }) => register2(wallet));
  } catch (error) {
    console.error("window.navigator.wallets could not be pushed\n", error);
  }
}

// node_modules/@wallet-standard/wallet/lib/esm/util.js
var __classPrivateFieldGet3 = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet3 = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _ReadonlyWalletAccount_address;
var _ReadonlyWalletAccount_publicKey;
var _ReadonlyWalletAccount_chains;
var _ReadonlyWalletAccount_features;
var _ReadonlyWalletAccount_label;
var _ReadonlyWalletAccount_icon;
var ReadonlyWalletAccount = class _ReadonlyWalletAccount {
  /** Implementation of {@link "@wallet-standard/base".WalletAccount.address | WalletAccount::address} */
  get address() {
    return __classPrivateFieldGet3(this, _ReadonlyWalletAccount_address, "f");
  }
  /** Implementation of {@link "@wallet-standard/base".WalletAccount.publicKey | WalletAccount::publicKey} */
  get publicKey() {
    return __classPrivateFieldGet3(this, _ReadonlyWalletAccount_publicKey, "f").slice();
  }
  /** Implementation of {@link "@wallet-standard/base".WalletAccount.chains | WalletAccount::chains} */
  get chains() {
    return __classPrivateFieldGet3(this, _ReadonlyWalletAccount_chains, "f").slice();
  }
  /** Implementation of {@link "@wallet-standard/base".WalletAccount.features | WalletAccount::features} */
  get features() {
    return __classPrivateFieldGet3(this, _ReadonlyWalletAccount_features, "f").slice();
  }
  /** Implementation of {@link "@wallet-standard/base".WalletAccount.label | WalletAccount::label} */
  get label() {
    return __classPrivateFieldGet3(this, _ReadonlyWalletAccount_label, "f");
  }
  /** Implementation of {@link "@wallet-standard/base".WalletAccount.icon | WalletAccount::icon} */
  get icon() {
    return __classPrivateFieldGet3(this, _ReadonlyWalletAccount_icon, "f");
  }
  /**
   * Create and freeze a read-only account.
   *
   * @param account Account to copy properties from.
   */
  constructor(account) {
    _ReadonlyWalletAccount_address.set(this, void 0);
    _ReadonlyWalletAccount_publicKey.set(this, void 0);
    _ReadonlyWalletAccount_chains.set(this, void 0);
    _ReadonlyWalletAccount_features.set(this, void 0);
    _ReadonlyWalletAccount_label.set(this, void 0);
    _ReadonlyWalletAccount_icon.set(this, void 0);
    if (new.target === _ReadonlyWalletAccount) {
      Object.freeze(this);
    }
    __classPrivateFieldSet3(this, _ReadonlyWalletAccount_address, account.address, "f");
    __classPrivateFieldSet3(this, _ReadonlyWalletAccount_publicKey, account.publicKey.slice(), "f");
    __classPrivateFieldSet3(this, _ReadonlyWalletAccount_chains, account.chains.slice(), "f");
    __classPrivateFieldSet3(this, _ReadonlyWalletAccount_features, account.features.slice(), "f");
    __classPrivateFieldSet3(this, _ReadonlyWalletAccount_label, account.label, "f");
    __classPrivateFieldSet3(this, _ReadonlyWalletAccount_icon, account.icon, "f");
  }
};
_ReadonlyWalletAccount_address = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_publicKey = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_chains = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_features = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_label = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_icon = /* @__PURE__ */ new WeakMap();
function arraysEqual(a, b) {
  if (a === b)
    return true;
  const length = a.length;
  if (length !== b.length)
    return false;
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i])
      return false;
  }
  return true;
}
function bytesEqual(a, b) {
  return arraysEqual(a, b);
}
function concatBytes(first, ...others) {
  const length = others.reduce((length2, bytes2) => length2 + bytes2.length, first.length);
  const bytes = new Uint8Array(length);
  bytes.set(first, 0);
  for (const other of others) {
    bytes.set(other, bytes.length);
  }
  return bytes;
}
function pick(source, ...keys) {
  const picked = {};
  for (const key of keys) {
    picked[key] = source[key];
  }
  return picked;
}
function guard2(callback) {
  try {
    callback();
  } catch (error) {
    console.error(error);
  }
}

// node_modules/@mysten/sui/dist/esm/transactions/ObjectCache.js
var _caches;
var _cache;
var _onEffects;
_caches = /* @__PURE__ */ new WeakMap();
_cache = /* @__PURE__ */ new WeakMap();
_onEffects = /* @__PURE__ */ new WeakMap();

// node_modules/@mysten/sui/dist/esm/transactions/executor/caching.js
var _client;
var _lastDigest;
_client = /* @__PURE__ */ new WeakMap();
_lastDigest = /* @__PURE__ */ new WeakMap();

// node_modules/@mysten/sui/dist/esm/transactions/executor/queue.js
var _queue;
var _queue2;
_queue = /* @__PURE__ */ new WeakMap();
_queue2 = /* @__PURE__ */ new WeakMap();

// node_modules/@mysten/sui/dist/esm/transactions/executor/serial.js
var _queue3;
var _signer;
var _cache2;
var _defaultGasBudget;
var _cacheGasCoin;
var _buildTransaction;
_queue3 = /* @__PURE__ */ new WeakMap();
_signer = /* @__PURE__ */ new WeakMap();
_cache2 = /* @__PURE__ */ new WeakMap();
_defaultGasBudget = /* @__PURE__ */ new WeakMap();
_cacheGasCoin = /* @__PURE__ */ new WeakMap();
_buildTransaction = /* @__PURE__ */ new WeakMap();
function getGasCoinFromEffects(effects) {
  if (!effects.V2) {
    throw new Error("Unexpected effects version");
  }
  const gasObjectChange = effects.V2.changedObjects[effects.V2.gasObjectIndex];
  if (!gasObjectChange) {
    throw new Error("Gas object not found in effects");
  }
  const [objectId, { outputState }] = gasObjectChange;
  if (!outputState.ObjectWrite) {
    throw new Error("Unexpected gas object state");
  }
  const [digest, owner] = outputState.ObjectWrite;
  return {
    ref: {
      objectId,
      digest,
      version: effects.V2.lamportVersion
    },
    owner: owner.AddressOwner || owner.ObjectOwner
  };
}

// node_modules/@mysten/sui/dist/esm/transactions/executor/parallel.js
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _signer2;
var _client2;
var _coinBatchSize;
var _initialCoinBalance;
var _minimumCoinBalance;
var _epochBoundaryWindow;
var _defaultGasBudget2;
var _maxPoolSize;
var _sourceCoins;
var _coinPool;
var _cache3;
var _objectIdQueues;
var _buildQueue;
var _executeQueue;
var _lastDigest2;
var _cacheLock;
var _pendingTransactions;
var _gasPrice;
var _ParallelTransactionExecutor_instances;
var getUsedObjects_fn;
var execute_fn;
var updateCache_fn;
var waitForLastDigest_fn;
var getGasCoin_fn;
var getGasPrice_fn;
var refillCoinPool_fn;
_signer2 = /* @__PURE__ */ new WeakMap();
_client2 = /* @__PURE__ */ new WeakMap();
_coinBatchSize = /* @__PURE__ */ new WeakMap();
_initialCoinBalance = /* @__PURE__ */ new WeakMap();
_minimumCoinBalance = /* @__PURE__ */ new WeakMap();
_epochBoundaryWindow = /* @__PURE__ */ new WeakMap();
_defaultGasBudget2 = /* @__PURE__ */ new WeakMap();
_maxPoolSize = /* @__PURE__ */ new WeakMap();
_sourceCoins = /* @__PURE__ */ new WeakMap();
_coinPool = /* @__PURE__ */ new WeakMap();
_cache3 = /* @__PURE__ */ new WeakMap();
_objectIdQueues = /* @__PURE__ */ new WeakMap();
_buildQueue = /* @__PURE__ */ new WeakMap();
_executeQueue = /* @__PURE__ */ new WeakMap();
_lastDigest2 = /* @__PURE__ */ new WeakMap();
_cacheLock = /* @__PURE__ */ new WeakMap();
_pendingTransactions = /* @__PURE__ */ new WeakMap();
_gasPrice = /* @__PURE__ */ new WeakMap();
_ParallelTransactionExecutor_instances = /* @__PURE__ */ new WeakSet();
getUsedObjects_fn = async function(transaction) {
  const usedObjects = /* @__PURE__ */ new Set();
  let serialized = false;
  transaction.addSerializationPlugin(async (blockData, _options, next) => {
    await next();
    if (serialized) {
      return;
    }
    serialized = true;
    blockData.inputs.forEach((input) => {
      if (input.Object?.ImmOrOwnedObject?.objectId) {
        usedObjects.add(input.Object.ImmOrOwnedObject.objectId);
      } else if (input.Object?.Receiving?.objectId) {
        usedObjects.add(input.Object.Receiving.objectId);
      } else if (input.UnresolvedObject?.objectId && !input.UnresolvedObject.initialSharedVersion) {
        usedObjects.add(input.UnresolvedObject.objectId);
      }
    });
  });
  await transaction.prepareForSerialization({ client: __privateGet(this, _client2) });
  return usedObjects;
};
execute_fn = async function(transaction, usedObjects, options, additionalSignatures = []) {
  let gasCoin;
  try {
    transaction.setSenderIfNotSet(__privateGet(this, _signer2).toSuiAddress());
    await __privateGet(this, _buildQueue).runTask(async () => {
      const data = transaction.getData();
      if (!data.gasData.price) {
        transaction.setGasPrice(await __privateMethod(this, _ParallelTransactionExecutor_instances, getGasPrice_fn).call(this));
      }
      transaction.setGasBudgetIfNotSet(__privateGet(this, _defaultGasBudget2));
      await __privateMethod(this, _ParallelTransactionExecutor_instances, updateCache_fn).call(this);
      gasCoin = await __privateMethod(this, _ParallelTransactionExecutor_instances, getGasCoin_fn).call(this);
      __privateWrapper(this, _pendingTransactions)._++;
      transaction.setGasPayment([
        {
          objectId: gasCoin.id,
          version: gasCoin.version,
          digest: gasCoin.digest
        }
      ]);
      await __privateGet(this, _cache3).buildTransaction({ transaction, onlyTransactionKind: true });
    });
    const bytes = await transaction.build({ client: __privateGet(this, _client2) });
    const { signature } = await __privateGet(this, _signer2).signTransaction(bytes);
    const results = await __privateGet(this, _cache3).executeTransaction({
      transaction: bytes,
      signature: [signature, ...additionalSignatures],
      options: __spreadProps(__spreadValues({}, options), {
        showEffects: true
      })
    });
    const effectsBytes = Uint8Array.from(results.rawEffects);
    const effects = suiBcs.TransactionEffects.parse(effectsBytes);
    const gasResult = getGasCoinFromEffects(effects);
    const gasUsed = effects.V2?.gasUsed;
    if (gasCoin && gasUsed && gasResult.owner === __privateGet(this, _signer2).toSuiAddress()) {
      const totalUsed = BigInt(gasUsed.computationCost) + BigInt(gasUsed.storageCost) + BigInt(gasUsed.storageCost) - BigInt(gasUsed.storageRebate);
      const remainingBalance = gasCoin.balance - totalUsed;
      let usesGasCoin = false;
      new TransactionDataBuilder(transaction.getData()).mapArguments((arg) => {
        if (arg.$kind === "GasCoin") {
          usesGasCoin = true;
        }
        return arg;
      });
      if (!usesGasCoin && remainingBalance >= __privateGet(this, _minimumCoinBalance)) {
        __privateGet(this, _coinPool).push({
          id: gasResult.ref.objectId,
          version: gasResult.ref.version,
          digest: gasResult.ref.digest,
          balance: remainingBalance
        });
      } else {
        if (!__privateGet(this, _sourceCoins)) {
          __privateSet(this, _sourceCoins, /* @__PURE__ */ new Map());
        }
        __privateGet(this, _sourceCoins).set(gasResult.ref.objectId, gasResult.ref);
      }
    }
    __privateSet(this, _lastDigest2, results.digest);
    return {
      digest: results.digest,
      effects: toBase64(effectsBytes),
      data: results
    };
  } catch (error) {
    if (gasCoin) {
      if (!__privateGet(this, _sourceCoins)) {
        __privateSet(this, _sourceCoins, /* @__PURE__ */ new Map());
      }
      __privateGet(this, _sourceCoins).set(gasCoin.id, null);
    }
    await __privateMethod(this, _ParallelTransactionExecutor_instances, updateCache_fn).call(this, async () => {
      await Promise.all([
        __privateGet(this, _cache3).cache.deleteObjects([...usedObjects]),
        __privateMethod(this, _ParallelTransactionExecutor_instances, waitForLastDigest_fn).call(this)
      ]);
    });
    throw error;
  } finally {
    usedObjects.forEach((objectId) => {
      const queue = __privateGet(this, _objectIdQueues).get(objectId);
      if (queue && queue.length > 0) {
        queue.shift()();
      } else if (queue) {
        __privateGet(this, _objectIdQueues).delete(objectId);
      }
    });
    __privateWrapper(this, _pendingTransactions)._--;
  }
};
updateCache_fn = async function(fn) {
  if (__privateGet(this, _cacheLock)) {
    await __privateGet(this, _cacheLock);
  }
  __privateSet(this, _cacheLock, fn?.().then(
    () => {
      __privateSet(this, _cacheLock, null);
    },
    () => {
    }
  ) ?? null);
};
waitForLastDigest_fn = async function() {
  const digest = __privateGet(this, _lastDigest2);
  if (digest) {
    __privateSet(this, _lastDigest2, null);
    await __privateGet(this, _client2).waitForTransaction({ digest });
  }
};
getGasCoin_fn = async function() {
  if (__privateGet(this, _coinPool).length === 0 && __privateGet(this, _pendingTransactions) <= __privateGet(this, _maxPoolSize)) {
    await __privateMethod(this, _ParallelTransactionExecutor_instances, refillCoinPool_fn).call(this);
  }
  if (__privateGet(this, _coinPool).length === 0) {
    throw new Error("No coins available");
  }
  const coin = __privateGet(this, _coinPool).shift();
  return coin;
};
getGasPrice_fn = async function() {
  const remaining = __privateGet(this, _gasPrice) ? __privateGet(this, _gasPrice).expiration - __privateGet(this, _epochBoundaryWindow) - Date.now() : 0;
  if (remaining > 0) {
    return __privateGet(this, _gasPrice).price;
  }
  if (__privateGet(this, _gasPrice)) {
    const timeToNextEpoch = Math.max(
      __privateGet(this, _gasPrice).expiration + __privateGet(this, _epochBoundaryWindow) - Date.now(),
      1e3
    );
    await new Promise((resolve) => setTimeout(resolve, timeToNextEpoch));
  }
  const state = await __privateGet(this, _client2).getLatestSuiSystemState();
  __privateSet(this, _gasPrice, {
    price: BigInt(state.referenceGasPrice),
    expiration: Number.parseInt(state.epochStartTimestampMs, 10) + Number.parseInt(state.epochDurationMs, 10)
  });
  return __privateMethod(this, _ParallelTransactionExecutor_instances, getGasPrice_fn).call(this);
};
refillCoinPool_fn = async function() {
  const batchSize = Math.min(
    __privateGet(this, _coinBatchSize),
    __privateGet(this, _maxPoolSize) - (__privateGet(this, _coinPool).length + __privateGet(this, _pendingTransactions)) + 1
  );
  if (batchSize === 0) {
    return;
  }
  const txb = new Transaction();
  const address = __privateGet(this, _signer2).toSuiAddress();
  txb.setSender(address);
  if (__privateGet(this, _sourceCoins)) {
    const refs = [];
    const ids = [];
    for (const [id, ref] of __privateGet(this, _sourceCoins)) {
      if (ref) {
        refs.push(ref);
      } else {
        ids.push(id);
      }
    }
    if (ids.length > 0) {
      const coins = await __privateGet(this, _client2).multiGetObjects({
        ids
      });
      refs.push(
        ...coins.filter((coin) => coin.data !== null).map(({ data }) => ({
          objectId: data.objectId,
          version: data.version,
          digest: data.digest
        }))
      );
    }
    txb.setGasPayment(refs);
    __privateSet(this, _sourceCoins, /* @__PURE__ */ new Map());
  }
  const amounts = new Array(batchSize).fill(__privateGet(this, _initialCoinBalance));
  const results = txb.splitCoins(txb.gas, amounts);
  const coinResults = [];
  for (let i = 0; i < amounts.length; i++) {
    coinResults.push(results[i]);
  }
  txb.transferObjects(coinResults, address);
  await this.waitForLastTransaction();
  const result = await __privateGet(this, _client2).signAndExecuteTransaction({
    transaction: txb,
    signer: __privateGet(this, _signer2),
    options: {
      showRawEffects: true
    }
  });
  const effects = suiBcs.TransactionEffects.parse(Uint8Array.from(result.rawEffects));
  effects.V2?.changedObjects.forEach(([id, { outputState }], i) => {
    if (i === effects.V2?.gasObjectIndex || !outputState.ObjectWrite) {
      return;
    }
    __privateGet(this, _coinPool).push({
      id,
      version: effects.V2.lamportVersion,
      digest: outputState.ObjectWrite[0],
      balance: BigInt(__privateGet(this, _initialCoinBalance))
    });
  });
  if (!__privateGet(this, _sourceCoins)) {
    __privateSet(this, _sourceCoins, /* @__PURE__ */ new Map());
  }
  const gasObject = getGasCoinFromEffects(effects).ref;
  __privateGet(this, _sourceCoins).set(gasObject.objectId, gasObject);
  await __privateGet(this, _client2).waitForTransaction({ digest: result.digest });
};

// node_modules/@mysten/sui/dist/esm/transactions/intents/CoinWithBalance.js
var SUI_TYPE = normalizeStructTag("0x2::sui::SUI");
var CoinWithBalanceData = object({
  type: string(),
  balance: bigint()
});

// node_modules/@mysten/sui/dist/esm/transactions/Arguments.js
var Arguments = {
  pure: createPure((value) => (tx) => tx.pure(value)),
  object: createObjectMethods((value) => (tx) => tx.object(value)),
  sharedObjectRef: (...args) => (tx) => tx.sharedObjectRef(...args),
  objectRef: (...args) => (tx) => tx.objectRef(...args),
  receivingRef: (...args) => (tx) => tx.receivingRef(...args)
};

// node_modules/@mysten/wallet-standard/dist/esm/wallet.js
async function signAndExecuteTransaction(wallet, input) {
  if (wallet.features["sui:signAndExecuteTransaction"]) {
    return wallet.features["sui:signAndExecuteTransaction"].signAndExecuteTransaction(input);
  }
  if (!wallet.features["sui:signAndExecuteTransactionBlock"]) {
    throw new Error(
      `Provided wallet (${wallet.name}) does not support the signAndExecuteTransaction feature.`
    );
  }
  const { signAndExecuteTransactionBlock } = wallet.features["sui:signAndExecuteTransactionBlock"];
  const transactionBlock = Transaction.from(await input.transaction.toJSON());
  const { digest, rawEffects, rawTransaction } = await signAndExecuteTransactionBlock({
    account: input.account,
    chain: input.chain,
    transactionBlock,
    options: {
      showRawEffects: true,
      showRawInput: true
    }
  });
  const [
    {
      txSignatures: [signature],
      intentMessage: { value: bcsTransaction }
    }
  ] = suiBcs.SenderSignedData.parse(fromBase64(rawTransaction));
  const bytes = suiBcs.TransactionData.serialize(bcsTransaction).toBase64();
  return {
    digest,
    signature,
    bytes,
    effects: toBase64(new Uint8Array(rawEffects))
  };
}
async function signTransaction(wallet, input) {
  if (wallet.features["sui:signTransaction"]) {
    return wallet.features["sui:signTransaction"].signTransaction(input);
  }
  if (!wallet.features["sui:signTransactionBlock"]) {
    throw new Error(
      `Provided wallet (${wallet.name}) does not support the signTransaction feature.`
    );
  }
  const { signTransactionBlock } = wallet.features["sui:signTransactionBlock"];
  const transaction = Transaction.from(await input.transaction.toJSON());
  const { transactionBlockBytes, signature } = await signTransactionBlock({
    transactionBlock: transaction,
    account: input.account,
    chain: input.chain
  });
  return { bytes: transactionBlockBytes, signature };
}

// node_modules/@mysten/wallet-standard/dist/esm/features/suiSignMessage.js
var SuiSignMessage = "sui:signMessage";

// node_modules/@mysten/wallet-standard/dist/esm/features/suiSignTransactionBlock.js
var SuiSignTransactionBlock = "sui:signTransactionBlock";

// node_modules/@mysten/wallet-standard/dist/esm/features/suiSignTransaction.js
var SuiSignTransaction = "sui:signTransaction";

// node_modules/@mysten/wallet-standard/dist/esm/features/suiSignAndExecuteTransactionBlock.js
var SuiSignAndExecuteTransactionBlock = "sui:signAndExecuteTransactionBlock";

// node_modules/@mysten/wallet-standard/dist/esm/features/suiSignAndExecuteTransaction.js
var SuiSignAndExecuteTransaction = "sui:signAndExecuteTransaction";

// node_modules/@mysten/wallet-standard/dist/esm/features/suiSignPersonalMessage.js
var SuiSignPersonalMessage = "sui:signPersonalMessage";

// node_modules/@mysten/wallet-standard/dist/esm/features/suiReportTransactionEffects.js
var SuiReportTransactionEffects = "sui:reportTransactionEffects";

// node_modules/@mysten/wallet-standard/dist/esm/features/suiGetCapabilities.js
var SuiGetCapabilities = "sui:getCapabilities";

// node_modules/@mysten/wallet-standard/dist/esm/detect.js
var REQUIRED_FEATURES = [StandardConnect, StandardEvents];
function isWalletWithRequiredFeatureSet(wallet, additionalFeatures = []) {
  return [...REQUIRED_FEATURES, ...additionalFeatures].every(
    (feature) => feature in wallet.features
  );
}

// node_modules/@mysten/wallet-standard/dist/esm/chains.js
var SUI_DEVNET_CHAIN = "sui:devnet";
var SUI_TESTNET_CHAIN = "sui:testnet";
var SUI_LOCALNET_CHAIN = "sui:localnet";
var SUI_MAINNET_CHAIN = "sui:mainnet";
var SUI_CHAINS = [
  SUI_DEVNET_CHAIN,
  SUI_TESTNET_CHAIN,
  SUI_LOCALNET_CHAIN,
  SUI_MAINNET_CHAIN
];
function isSuiChain(chain) {
  return SUI_CHAINS.includes(chain);
}
export {
  Connect,
  DEPRECATED_getWallets,
  DEPRECATED_registerWallet,
  Disconnect,
  Events,
  ReadonlyWalletAccount,
  SUI_CHAINS,
  SUI_DEVNET_CHAIN,
  SUI_LOCALNET_CHAIN,
  SUI_MAINNET_CHAIN,
  SUI_TESTNET_CHAIN,
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
  SuiGetCapabilities,
  SuiReportTransactionEffects,
  SuiSignAndExecuteTransaction,
  SuiSignAndExecuteTransactionBlock,
  SuiSignMessage,
  SuiSignPersonalMessage,
  SuiSignTransaction,
  SuiSignTransactionBlock,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED,
  WALLET_STANDARD_ERROR__REGISTRY__WALLET_ACCOUNT_NOT_FOUND,
  WALLET_STANDARD_ERROR__REGISTRY__WALLET_NOT_FOUND,
  WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED,
  WalletStandardError,
  arraysEqual,
  bytesEqual,
  concatBytes,
  getWallets,
  guard2 as guard,
  isSuiChain,
  isWalletStandardError,
  isWalletWithRequiredFeatureSet,
  pick,
  registerWallet,
  safeCaptureStackTrace,
  signAndExecuteTransaction,
  signTransaction
};
//# sourceMappingURL=@mysten_wallet-standard.js.map
