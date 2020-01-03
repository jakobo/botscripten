(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList)
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var asyncToGenerator = _asyncToGenerator;

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source);

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol$1 = root.Symbol;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * The inverse of `_.escape`; this method converts the HTML entities
   * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to
   * their corresponding characters.
   *
   * **Note:** No other HTML entities are unescaped. To unescape additional
   * HTML entities use a third-party library like [_he_](https://mths.be/he).
   *
   * @static
   * @memberOf _
   * @since 0.6.0
   * @category String
   * @param {string} [string=''] The string to unescape.
   * @returns {string} Returns the unescaped string.
   * @example
   *
   * _.unescape('fred, barney, &amp; pebbles');
   * // => 'fred, barney, & pebbles'
   */
  function unescape(string) {
    string = toString(string);
    return (string && reHasEscapedHtml.test(string))
      ? string.replace(reEscapedHtml, unescapeHtmlChar)
      : string;
  }

  var lodash_unescape = unescape;

  var TOKEN_ESCAPED_OCTO = "__TOKEN_ESCAPED_BACKSLASH_OCTO__";
  var BLOCK_DIRECTIVE = /^###@([\S]+)([\s\S]*?)###/gm;
  var INLINE_DIRECTIVE = /^#@([\S]+)(.*)$/gm;

  var extractDirectives = function extractDirectives(s) {
    var directives = []; // avoid using escaped items

    s = s.replace("\\#", TOKEN_ESCAPED_OCTO);

    while (s.match(BLOCK_DIRECTIVE)) {
      s = s.replace(BLOCK_DIRECTIVE, function (match, dir, content) {
        directives.push({
          name: "@".concat(dir),
          content: content.trim()
        });
        return "";
      });
    }

    while (s.match(INLINE_DIRECTIVE)) {
      s = s.replace(INLINE_DIRECTIVE, function (match, dir, content) {
        directives.push({
          name: "@".concat(dir),
          content: content.trim()
        });
        return "";
      });
    }

    return directives;
  };

  var LINK_PATTERN = /\[\[(.*?)\]\]/gm;

  var extractLinks = function extractLinks(str) {
    var links = [];
    var original = str;

    while (str.match(LINK_PATTERN)) {
      str = str.replace(LINK_PATTERN, function (match, t) {
        var display = t;
        var target = t; // display|target format

        var barIndex = t.indexOf("|");
        var rightArrIndex = t.indexOf("->");
        var leftArrIndex = t.indexOf("<-");

        switch (true) {
          case barIndex >= 0:
            display = t.substr(0, barIndex);
            target = t.substr(barIndex + 1);
            break;

          case rightArrIndex >= 0:
            display = t.substr(0, rightArrIndex);
            target = t.substr(rightArrIndex + 2);
            break;

          case leftArrIndex >= 0:
            display = t.substr(leftArrIndex + 2);
            target = t.substr(0, leftArrIndex);
            break;
        }

        links.push({
          display: display,
          target: target
        });
        return ""; // render nothing if it's a twee link
      });
    }

    return {
      links: links,
      updated: str,
      original: original
    };
  };

  var TOKEN_ESCAPED_OCTO$1 = "__TOKEN_ESCAPED_BACKSLASH_OCTO__";
  var BLOCK_COMMENT = /###[\s\S]*?###/gm;
  var INLINE_COMMENT = /^#.*$/gm;

  var stripComments = function stripComments(str) {
    return str.replace("\\#", TOKEN_ESCAPED_OCTO$1).replace(BLOCK_COMMENT, "").replace(INLINE_COMMENT, "").replace(TOKEN_ESCAPED_OCTO$1, "#").trim();
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var findStory = function findStory(win) {
    if (win && win.story) {
      return win.story;
    }

    return {
      state: {}
    };
  };

  var renderPassage = function renderPassage(passage) {
    var source = passage.source;
    var directives = extractDirectives(source);
    var result = stripComments(source);

    if (passage) {
      // remove links if set previously
      passage.links = [];
    } // [[links]]


    var linkData = extractLinks(result);
    result = linkData.updated;

    if (passage) {
      passage.links = linkData.links;
    } // before handling any tags, handle any/all directives


    directives.forEach(function (d) {
      if (!passage.story.directives[d.name]) return;
      passage.story.directives[d.name].forEach(function (run) {
        result = run(d.content, result, passage, passage.story);
      });
    }); // if no speaker tag, return an empty render set

    if (!passage.getSpeaker()) {
      return {
        directives: directives,
        text: []
      };
    } // if prompt tag is set, notify the story


    if (passage) {
      var prompts = passage.prefixTag("prompt");

      if (prompts.length) {
        passage.story.prompt(prompts[0]);
      }
    }

    if (passage.hasTag("oneline")) {
      return {
        directives: directives,
        text: [result]
      };
    } // if this is a multiline item, trim, split, and mark each item
    // return the array


    result = result.trim();
    return {
      directives: directives,
      text: result.split(/[\r\n]+/g)
    };
  };

  var Passage = function Passage(id, name, tags, source, story) {
    var _this = this;

    classCallCheck(this, Passage);

    defineProperty(this, "id", null);

    defineProperty(this, "name", null);

    defineProperty(this, "tags", null);

    defineProperty(this, "tagDict", {});

    defineProperty(this, "source", null);

    defineProperty(this, "links", []);

    defineProperty(this, "getSpeaker", function () {
      var speakerTag = _this.tags.find(function (t) {
        return t.indexOf("speaker-") === 0;
      }) || "";
      if (speakerTag) return speakerTag.replace(/^speaker-/, "");
      return null;
    });

    defineProperty(this, "prefixTag", function (pfx, asDict) {
      return _this.tags.filter(function (t) {
        return t.indexOf("".concat(pfx, "-")) === 0;
      }).map(function (t) {
        return t.replace("".concat(pfx, "-"), "");
      }).reduce(function (a, t) {
        if (asDict) return _objectSpread({}, a, defineProperty({}, t, 1));
        return [].concat(toConsumableArray(a), [t]);
      }, asDict ? {} : []);
    });

    defineProperty(this, "hasTag", function (t) {
      return _this.tagDict[t];
    });

    defineProperty(this, "render", function () {
      return renderPassage(_this);
    });

    this.id = id;
    this.name = name;
    this.tags = tags;
    this.source = lodash_unescape(source);
    this.story = story;
    this.tags.forEach(function (t) {
      return _this.tagDict[t] = 1;
    });
  };

  defineProperty(Passage, "render", function (str) {
    return renderPassage(new Passage(null, null, null, str, findStory(window || null)));
  });

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag$1 = '[object Symbol]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"'`]/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf$1(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf$1(htmlEscapes);

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString$1 = objectProto$1.toString;

  /** Built-in value references. */
  var Symbol$2 = root$1.Symbol;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : undefined,
      symbolToString$1 = symbolProto$1 ? symbolProto$1.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString$1(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol$1(value)) {
      return symbolToString$1 ? symbolToString$1.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike$1(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol$1(value) {
    return typeof value == 'symbol' ||
      (isObjectLike$1(value) && objectToString$1.call(value) == symbolTag$1);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString$1(value) {
    return value == null ? '' : baseToString$1(value);
  }

  /**
   * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
   * their corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in IE < 9, they can break out of
   * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the
   * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString$1(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var lodash_escape = escape;

  var selectPassages = "tw-passagedata";
  var selectCss = '*[type="text/twine-css"]';
  var selectJs = '*[type="text/twine-javascript"]';
  var selectActiveLink = "#user-response-panel a[data-passage]";
  var selectActiveButton = "#user-response-panel button[data-passage]";
  var selectActiveInput = "#user-response-panel input";
  var selectActive = ".chat-panel .active";
  var selectHistory = ".chat-panel .history";
  var selectResponses = "#user-response-panel";
  var typingIndicator = "#animation-container";
  var IS_NUMERIC = /^[\d]+$/;
  /**
   * Determine if a provided string contains only numbers
   * In the case of `pid` values for passages, this is true
   */

  var isNumeric = function isNumeric(d) {
    return IS_NUMERIC.test(d);
  };
  /**
   * Format a user passage (such as a response)
   */


  var USER_PASSAGE_TMPL = function USER_PASSAGE_TMPL(_ref) {
    var id = _ref.id,
        text = _ref.text;
    return "\n  <div class=\"chat-passage-wrapper\" data-speaker=\"you\">\n    <div class=\"chat-passage phistory\" data-speaker=\"you\" data-upassage=\"".concat(id, "\">\n      ").concat(text, "\n    </div>\n  </div>\n");
  };
  /**
   * Format a message from a non-user
   */


  var OTHER_PASSAGE_TMPL = function OTHER_PASSAGE_TMPL(_ref2) {
    var speaker = _ref2.speaker,
        tags = _ref2.tags,
        text = _ref2.text;
    return "\n  <div data-speaker=\"".concat(speaker, "\" class=\"chat-passage-wrapper ").concat(tags.join(" "), "\">\n    <div data-speaker=\"").concat(speaker, "\" class=\"chat-passage\">\n      ").concat(text, "\n    </div>\n  </div>\n");
  };

  var DIRECTIVES_TMPL = function DIRECTIVES_TMPL(directives) {
    return "\n  <div class=\"directives\">\n    ".concat(directives.map(function (_ref3) {
      var name = _ref3.name,
          content = _ref3.content;
      return "<div class=\"directive\" name=\"".concat(name, "\">").concat(content.trim(), "</div>");
    }).join(""), "\n  </div>\n");
  };
  /**
   * Forces a delay via promises in order to spread out messages
   */


  var delay =
  /*#__PURE__*/
  function () {
    var _ref4 = asyncToGenerator(
    /*#__PURE__*/
    regenerator.mark(function _callee() {
      var t,
          _args = arguments;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              t = _args.length > 0 && _args[0] !== undefined ? _args[0] : 0;
              return _context.abrupt("return", new Promise(function (resolve) {
                return setTimeout(resolve, t);
              }));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function delay() {
      return _ref4.apply(this, arguments);
    };
  }(); // Find one/many nodes within a context. We [...findAll] to ensure we're cast as an array
  // not as a node list


  var find = function find(ctx, s) {
    return ctx.querySelector(s);
  };

  var findAll = function findAll(ctx, s) {
    return toConsumableArray(ctx.querySelectorAll(s)) || [];
  };
  /**
   * Standard Twine Format Story Object
   */


  var Story = // Twine v2
  function Story(win, src) {
    var _this = this;

    classCallCheck(this, Story);

    defineProperty(this, "version", 2);

    defineProperty(this, "document", null);

    defineProperty(this, "story", null);

    defineProperty(this, "name", "");

    defineProperty(this, "startsAt", 0);

    defineProperty(this, "current", 0);

    defineProperty(this, "history", []);

    defineProperty(this, "passages", {});

    defineProperty(this, "showPrompt", false);

    defineProperty(this, "errorMessage", "\u26A0 %s");

    defineProperty(this, "directives", {});

    defineProperty(this, "elements", {});

    defineProperty(this, "userScripts", []);

    defineProperty(this, "userStyles", []);

    defineProperty(this, "start", function () {
      // activate userscripts and styles
      _this.userStyles.forEach(function (s) {
        var t = _this.document.createElement("style");

        t.innerHTML = s;

        _this.document.body.appendChild(t);
      });

      _this.userScripts.forEach(function (s) {
        // eval is evil, but this is simply how Twine works
        // eslint-disable-line
        globalEval(s);
      }); // when you click on a[data-passage] (response link)...


      _this.document.body.addEventListener("click", function (e) {
        if (!e.target.matches(selectActiveLink)) {
          return;
        }

        _this.advance(_this.findPassage(e.target.getAttribute("data-passage")), e.target.innerHTML);
      }); // when you click on button[data-passage] (response input)...


      _this.document.body.addEventListener("click", function (e) {
        if (!e.target.matches(selectActiveButton)) {
          return;
        } // capture and disable showPrompt feature


        var value = find(_this.document, selectActiveInput).value;
        _this.showPrompt = false;

        _this.advance(_this.findPassage(e.target.getAttribute("data-passage")), value);
      });

      _this.advance(_this.findPassage(_this.startsAt));
    });

    defineProperty(this, "findPassage", function (idOrName) {
      if (isNumeric(idOrName)) {
        return _this.passages[idOrName];
      } else {
        // handle passages with ' and " (can't use a css selector consistently)
        var p = findAll(_this.story, "tw-passagedata").filter(function (p) {
          return lodash_unescape(p.getAttribute("name")) === idOrName;
        })[0];
        if (!p) return null;
        return _this.passages[p.getAttribute("pid")];
      }
    });

    defineProperty(this, "advance",
    /*#__PURE__*/
    function () {
      var _ref5 = asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee2(passage) {
        var userText,
            last,
            existing,
            _args2 = arguments;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                userText = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;

                _this.history.push(passage.id);

                last = _this.current; // .active is captured & cleared

                existing = _this.elements.active.innerHTML;
                _this.elements.active.innerHTML = ""; // whatever was in active is moved up into history

                _this.elements.history.innerHTML += existing; // if there is userText, it is added to .history

                if (userText) {
                  _this.renderUserMessage(last, userText, function (s) {
                    return _this.elements.history.innerHTML += s;
                  });
                } // The new passage is rendered and placed in .active
                // after all renders, user options are displayed


                _context2.next = 9;
                return _this.renderPassage(passage, function (s) {
                  return _this.elements.active.innerHTML += s;
                });

              case 9:
                if (!(!passage.hasTag("wait") && passage.links.length === 1)) {
                  _context2.next = 12;
                  break;
                }

                // auto advance if the wait tag is not set and there is exactly
                // 1 link found in our pssage.
                _this.advance(_this.findPassage(passage.links[0].target));

                return _context2.abrupt("return");

              case 12:
                _this.renderChoices(passage);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref5.apply(this, arguments);
      };
    }());

    defineProperty(this, "renderUserMessage",
    /*#__PURE__*/
    function () {
      var _ref6 = asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee3(pid, text, renderer) {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return renderer(USER_PASSAGE_TMPL({
                  pid: pid,
                  text: text
                }));

              case 2:
                _this.scrollToBottom();

                return _context3.abrupt("return", Promise.resolve());

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x2, _x3, _x4) {
        return _ref6.apply(this, arguments);
      };
    }());

    defineProperty(this, "renderPassage",
    /*#__PURE__*/
    function () {
      var _ref7 = asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee4(passage, renderer) {
        var speaker, statements, next, content;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                speaker = passage.getSpeaker();
                statements = passage.render();
                console.log(statements.directives);
                _context4.next = 5;
                return renderer(DIRECTIVES_TMPL(statements.directives));

              case 5:
                next = statements.text.shift();

                _this.showTyping();

              case 7:
                if (!next) {
                  _context4.next = 16;
                  break;
                }

                content = OTHER_PASSAGE_TMPL({
                  speaker: speaker,
                  tags: passage.tags,
                  text: next
                });
                _context4.next = 11;
                return delay(_this.calculateDelay(next));

              case 11:
                _context4.next = 13;
                return renderer(content);

              case 13:
                next = statements.text.shift();
                _context4.next = 7;
                break;

              case 16:
                _this.hideTyping();

                _this.scrollToBottom();

                return _context4.abrupt("return", Promise.resolve());

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x5, _x6) {
        return _ref7.apply(this, arguments);
      };
    }());

    defineProperty(this, "calculateDelay", function (txt) {
      var typingDelayRatio = 0.3;
      var rate = 20; // ms

      return txt.length * rate * typingDelayRatio;
    });

    defineProperty(this, "showTyping", function () {
      find(_this.document, typingIndicator).style.visibility = "visible";
    });

    defineProperty(this, "hideTyping", function () {
      find(_this.document, typingIndicator).style.visibility = "hidden";
    });

    defineProperty(this, "scrollToBottom", function () {
      var hist = find(_this.document, "#phistory");
      document.scrollingElement.scrollTop = hist.offsetHeight;
    });

    defineProperty(this, "removeChoices", function () {
      var panel = find(_this.document, selectResponses);
      panel.innerHTML = "";
    });

    defineProperty(this, "renderChoices", function (passage) {
      _this.removeChoices();

      var panel = find(_this.document, selectResponses);
      passage.links.forEach(function (l) {
        panel.innerHTML += "<a href=\"javascript:void(0)\" class=\"user-response\" data-passage=\"".concat(lodash_escape(l.target), "\">").concat(l.display, "</a>");
      });
    });

    defineProperty(this, "directive", function (id, cb) {
      if (!_this.directives[id]) {
        _this.directives[id] = [];
      }

      _this.directives[id].push(cb);
    });

    this.window = win;

    if (src) {
      this.document = document.implementation.createHTMLDocument("Botscripten Injected Content");
    } else {
      this.document = document;
    }

    this.story = find(this.document, "tw-storydata"); // elements

    this.elements = {
      active: find(this.document, selectActive),
      history: find(this.document, selectHistory)
    }; // properties of story node

    this.name = this.story.getAttribute("name") || "";
    this.startsAt = this.story.getAttribute("startnode") || 0;
    findAll(this.story, selectPassages).forEach(function (p) {
      var id = parseInt(p.getAttribute("pid"));
      var name = p.getAttribute("name");
      var tags = (p.getAttribute("tags") || "").split(/\s+/g);
      var passage = p.innerHTML || "";
      _this.passages[id] = new Passage(id, name, tags, passage, _this);
    });
    find(this.document, "title").innerHTML = this.name;
    find(this.document, "#ptitle").innerHTML = this.name;
    this.userScripts = (findAll(this.document, selectJs) || []).map(function (el) {
      return el.innerHTML;
    });
    this.userStyles = (findAll(this.document, selectCss) || []).map(function (el) {
      return el.innerHTML;
    });
  }
  /**
   * Starts the story by setting up listeners and then advancing
   * to the first item in the stack
   */
  ;

  (function (win) {
    if (typeof win !== "undefined") {
      win.document.addEventListener("DOMContentLoaded", function (event) {
        win.globalEval = eval;
        win.story = new Story(win);
        win.story.start();

        if (win.document.querySelector("#show_directives").checked) {
          win.document.body.classList.add("show-directives");
        }

        if (win.document.querySelector("#proofing").checked) {
          win.document.body.classList.add("proof");
        } else {
          win.document.body.classList.add("run");
        }
      });
      win.document.querySelector("#show_directives").addEventListener("change", function (e) {
        if (e.target.checked) {
          win.document.body.classList.add("show-directives");
        } else {
          win.document.body.classList.remove("show-directives");
        }
      });
      win.document.querySelector("#proofing").addEventListener("change", function (e) {
        if (e.target.checked) {
          win.document.body.classList.add("proof");
          win.document.body.classList.remove("run");
        } else {
          win.document.body.classList.add("run");
          win.document.body.classList.remove("proof");
        }
      });
      document.querySelector("tw-passagedata[pid='" + document.querySelector("tw-storydata").getAttribute("startnode") + "']").classList.add("start");
    }
  })(window || undefined);

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90c2NyaXB0ZW4udW1kLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRob3V0SG9sZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9ub25JdGVyYWJsZVNwcmVhZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoLnVuZXNjYXBlL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi9leHRyYWN0RGlyZWN0aXZlcy5qcyIsIi4uL3NyYy9jb21tb24vZXh0cmFjdExpbmtzLmpzIiwiLi4vc3JjL2NvbW1vbi9zdHJpcENvbW1lbnRzLmpzIiwiLi4vc3JjL3R3aW5lL1Bhc3NhZ2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoLmVzY2FwZS9pbmRleC5qcyIsIi4uL3NyYy90d2luZS9TdG9yeS5qcyIsIi4uL3NyYy90d2luZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jbGFzc0NhbGxDaGVjazsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycjJbaV0gPSBhcnJbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjI7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRob3V0SG9sZXM7IiwiZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheTsiLCJmdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVTcHJlYWQ7IiwidmFyIGFycmF5V2l0aG91dEhvbGVzID0gcmVxdWlyZShcIi4vYXJyYXlXaXRob3V0SG9sZXNcIik7XG5cbnZhciBpdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXlcIik7XG5cbnZhciBub25JdGVyYWJsZVNwcmVhZCA9IHJlcXVpcmUoXCIuL25vbkl0ZXJhYmxlU3ByZWFkXCIpO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7XG4gIHJldHVybiBhcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IGl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3RvQ29uc3VtYWJsZUFycmF5OyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbnZhciByZUVzY2FwZWRIdG1sID0gLyYoPzphbXB8bHR8Z3R8cXVvdHwjMzl8Izk2KTsvZyxcbiAgICByZUhhc0VzY2FwZWRIdG1sID0gUmVnRXhwKHJlRXNjYXBlZEh0bWwuc291cmNlKTtcblxuLyoqIFVzZWQgdG8gbWFwIEhUTUwgZW50aXRpZXMgdG8gY2hhcmFjdGVycy4gKi9cbnZhciBodG1sVW5lc2NhcGVzID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnLFxuICAnJmd0Oyc6ICc+JyxcbiAgJyZxdW90Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiLFxuICAnJiM5NjsnOiAnYCdcbn07XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eU9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlPZihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYF8udW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBjaGFyYWN0ZXIuXG4gKi9cbnZhciB1bmVzY2FwZUh0bWxDaGFyID0gYmFzZVByb3BlcnR5T2YoaHRtbFVuZXNjYXBlcyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiBgXy5lc2NhcGVgOyB0aGlzIG1ldGhvZCBjb252ZXJ0cyB0aGUgSFRNTCBlbnRpdGllc1xuICogYCZhbXA7YCwgYCZsdDtgLCBgJmd0O2AsIGAmcXVvdDtgLCBgJiMzOTtgLCBhbmQgYCYjOTY7YCBpbiBgc3RyaW5nYCB0b1xuICogdGhlaXIgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzLlxuICpcbiAqICoqTm90ZToqKiBObyBvdGhlciBIVE1MIGVudGl0aWVzIGFyZSB1bmVzY2FwZWQuIFRvIHVuZXNjYXBlIGFkZGl0aW9uYWxcbiAqIEhUTUwgZW50aXRpZXMgdXNlIGEgdGhpcmQtcGFydHkgbGlicmFyeSBsaWtlIFtfaGVfXShodHRwczovL210aHMuYmUvaGUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC42LjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc0VzY2FwZWRIdG1sLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlZEh0bWwsIHVuZXNjYXBlSHRtbENoYXIpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5lc2NhcGU7XG4iLCJjb25zdCBUT0tFTl9FU0NBUEVEX09DVE8gPSBcIl9fVE9LRU5fRVNDQVBFRF9CQUNLU0xBU0hfT0NUT19fXCI7XG5jb25zdCBCTE9DS19ESVJFQ1RJVkUgPSAvXiMjI0AoW1xcU10rKShbXFxzXFxTXSo/KSMjIy9nbTtcbmNvbnN0IElOTElORV9ESVJFQ1RJVkUgPSAvXiNAKFtcXFNdKykoLiopJC9nbTtcblxuY29uc3QgZXh0cmFjdERpcmVjdGl2ZXMgPSBzID0+IHtcbiAgY29uc3QgZGlyZWN0aXZlcyA9IFtdO1xuXG4gIC8vIGF2b2lkIHVzaW5nIGVzY2FwZWQgaXRlbXNcbiAgcyA9IHMucmVwbGFjZShcIlxcXFwjXCIsIFRPS0VOX0VTQ0FQRURfT0NUTyk7XG5cbiAgd2hpbGUgKHMubWF0Y2goQkxPQ0tfRElSRUNUSVZFKSkge1xuICAgIHMgPSBzLnJlcGxhY2UoQkxPQ0tfRElSRUNUSVZFLCAobWF0Y2gsIGRpciwgY29udGVudCkgPT4ge1xuICAgICAgZGlyZWN0aXZlcy5wdXNoKHsgbmFtZTogYEAke2Rpcn1gLCBjb250ZW50OiBjb250ZW50LnRyaW0oKSB9KTtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH0pO1xuICB9XG5cbiAgd2hpbGUgKHMubWF0Y2goSU5MSU5FX0RJUkVDVElWRSkpIHtcbiAgICBzID0gcy5yZXBsYWNlKElOTElORV9ESVJFQ1RJVkUsIChtYXRjaCwgZGlyLCBjb250ZW50KSA9PiB7XG4gICAgICBkaXJlY3RpdmVzLnB1c2goeyBuYW1lOiBgQCR7ZGlyfWAsIGNvbnRlbnQ6IGNvbnRlbnQudHJpbSgpIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlcztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4dHJhY3REaXJlY3RpdmVzO1xuIiwiY29uc3QgTElOS19QQVRURVJOID0gL1xcW1xcWyguKj8pXFxdXFxdL2dtO1xuXG5jb25zdCBleHRyYWN0TGlua3MgPSBzdHIgPT4ge1xuICBjb25zdCBsaW5rcyA9IFtdO1xuICBjb25zdCBvcmlnaW5hbCA9IHN0cjtcblxuICB3aGlsZSAoc3RyLm1hdGNoKExJTktfUEFUVEVSTikpIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShMSU5LX1BBVFRFUk4sIChtYXRjaCwgdCkgPT4ge1xuICAgICAgbGV0IGRpc3BsYXkgPSB0O1xuICAgICAgbGV0IHRhcmdldCA9IHQ7XG5cbiAgICAgIC8vIGRpc3BsYXl8dGFyZ2V0IGZvcm1hdFxuICAgICAgY29uc3QgYmFySW5kZXggPSB0LmluZGV4T2YoXCJ8XCIpO1xuICAgICAgY29uc3QgcmlnaHRBcnJJbmRleCA9IHQuaW5kZXhPZihcIi0+XCIpO1xuICAgICAgY29uc3QgbGVmdEFyckluZGV4ID0gdC5pbmRleE9mKFwiPC1cIik7XG5cbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICBjYXNlIGJhckluZGV4ID49IDA6XG4gICAgICAgICAgZGlzcGxheSA9IHQuc3Vic3RyKDAsIGJhckluZGV4KTtcbiAgICAgICAgICB0YXJnZXQgPSB0LnN1YnN0cihiYXJJbmRleCArIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHJpZ2h0QXJySW5kZXggPj0gMDpcbiAgICAgICAgICBkaXNwbGF5ID0gdC5zdWJzdHIoMCwgcmlnaHRBcnJJbmRleCk7XG4gICAgICAgICAgdGFyZ2V0ID0gdC5zdWJzdHIocmlnaHRBcnJJbmRleCArIDIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGxlZnRBcnJJbmRleCA+PSAwOlxuICAgICAgICAgIGRpc3BsYXkgPSB0LnN1YnN0cihsZWZ0QXJySW5kZXggKyAyKTtcbiAgICAgICAgICB0YXJnZXQgPSB0LnN1YnN0cigwLCBsZWZ0QXJySW5kZXgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBsaW5rcy5wdXNoKHtcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBcIlwiOyAvLyByZW5kZXIgbm90aGluZyBpZiBpdCdzIGEgdHdlZSBsaW5rXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxpbmtzLFxuICAgIHVwZGF0ZWQ6IHN0cixcbiAgICBvcmlnaW5hbCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4dHJhY3RMaW5rcztcbiIsImNvbnN0IFRPS0VOX0VTQ0FQRURfT0NUTyA9IFwiX19UT0tFTl9FU0NBUEVEX0JBQ0tTTEFTSF9PQ1RPX19cIjtcblxuY29uc3QgQkxPQ0tfQ09NTUVOVCA9IC8jIyNbXFxzXFxTXSo/IyMjL2dtO1xuY29uc3QgSU5MSU5FX0NPTU1FTlQgPSAvXiMuKiQvZ207XG5cbmNvbnN0IHN0cmlwQ29tbWVudHMgPSBzdHIgPT5cbiAgc3RyXG4gICAgLnJlcGxhY2UoXCJcXFxcI1wiLCBUT0tFTl9FU0NBUEVEX09DVE8pXG4gICAgLnJlcGxhY2UoQkxPQ0tfQ09NTUVOVCwgXCJcIilcbiAgICAucmVwbGFjZShJTkxJTkVfQ09NTUVOVCwgXCJcIilcbiAgICAucmVwbGFjZShUT0tFTl9FU0NBUEVEX09DVE8sIFwiI1wiKVxuICAgIC50cmltKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmlwQ29tbWVudHM7XG4iLCJpbXBvcnQgdW5lc2NhcGUgZnJvbSBcImxvZGFzaC51bmVzY2FwZVwiO1xuaW1wb3J0IGV4dHJhY3REaXJlY3RpdmVzIGZyb20gXCIuLi9jb21tb24vZXh0cmFjdERpcmVjdGl2ZXNcIjtcbmltcG9ydCBleHRyYWN0TGlua3MgZnJvbSBcIi4uL2NvbW1vbi9leHRyYWN0TGlua3NcIjtcbmltcG9ydCBzdHJpcENvbW1lbnRzIGZyb20gXCIuLi9jb21tb24vc3RyaXBDb21tZW50c1wiO1xuXG5jb25zdCBmaW5kU3RvcnkgPSB3aW4gPT4ge1xuICBpZiAod2luICYmIHdpbi5zdG9yeSkge1xuICAgIHJldHVybiB3aW4uc3Rvcnk7XG4gIH1cbiAgcmV0dXJuIHsgc3RhdGU6IHt9IH07XG59O1xuXG5jb25zdCByZW5kZXJQYXNzYWdlID0gcGFzc2FnZSA9PiB7XG4gIGNvbnN0IHNvdXJjZSA9IHBhc3NhZ2Uuc291cmNlO1xuXG4gIGNvbnN0IGRpcmVjdGl2ZXMgPSBleHRyYWN0RGlyZWN0aXZlcyhzb3VyY2UpO1xuICBsZXQgcmVzdWx0ID0gc3RyaXBDb21tZW50cyhzb3VyY2UpO1xuXG4gIGlmIChwYXNzYWdlKSB7XG4gICAgLy8gcmVtb3ZlIGxpbmtzIGlmIHNldCBwcmV2aW91c2x5XG4gICAgcGFzc2FnZS5saW5rcyA9IFtdO1xuICB9XG5cbiAgLy8gW1tsaW5rc11dXG4gIGNvbnN0IGxpbmtEYXRhID0gZXh0cmFjdExpbmtzKHJlc3VsdCk7XG4gIHJlc3VsdCA9IGxpbmtEYXRhLnVwZGF0ZWQ7XG4gIGlmIChwYXNzYWdlKSB7XG4gICAgcGFzc2FnZS5saW5rcyA9IGxpbmtEYXRhLmxpbmtzO1xuICB9XG5cbiAgLy8gYmVmb3JlIGhhbmRsaW5nIGFueSB0YWdzLCBoYW5kbGUgYW55L2FsbCBkaXJlY3RpdmVzXG4gIGRpcmVjdGl2ZXMuZm9yRWFjaChkID0+IHtcbiAgICBpZiAoIXBhc3NhZ2Uuc3RvcnkuZGlyZWN0aXZlc1tkLm5hbWVdKSByZXR1cm47XG4gICAgcGFzc2FnZS5zdG9yeS5kaXJlY3RpdmVzW2QubmFtZV0uZm9yRWFjaChydW4gPT4ge1xuICAgICAgcmVzdWx0ID0gcnVuKGQuY29udGVudCwgcmVzdWx0LCBwYXNzYWdlLCBwYXNzYWdlLnN0b3J5KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gaWYgbm8gc3BlYWtlciB0YWcsIHJldHVybiBhbiBlbXB0eSByZW5kZXIgc2V0XG4gIGlmICghcGFzc2FnZS5nZXRTcGVha2VyKCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlyZWN0aXZlcyxcbiAgICAgIHRleHQ6IFtdLFxuICAgIH07XG4gIH1cblxuICAvLyBpZiBwcm9tcHQgdGFnIGlzIHNldCwgbm90aWZ5IHRoZSBzdG9yeVxuICBpZiAocGFzc2FnZSkge1xuICAgIGNvbnN0IHByb21wdHMgPSBwYXNzYWdlLnByZWZpeFRhZyhcInByb21wdFwiKTtcbiAgICBpZiAocHJvbXB0cy5sZW5ndGgpIHtcbiAgICAgIHBhc3NhZ2Uuc3RvcnkucHJvbXB0KHByb21wdHNbMF0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwYXNzYWdlLmhhc1RhZyhcIm9uZWxpbmVcIikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlyZWN0aXZlcyxcbiAgICAgIHRleHQ6IFtyZXN1bHRdLFxuICAgIH07XG4gIH1cblxuICAvLyBpZiB0aGlzIGlzIGEgbXVsdGlsaW5lIGl0ZW0sIHRyaW0sIHNwbGl0LCBhbmQgbWFyayBlYWNoIGl0ZW1cbiAgLy8gcmV0dXJuIHRoZSBhcnJheVxuICByZXN1bHQgPSByZXN1bHQudHJpbSgpO1xuICByZXR1cm4ge1xuICAgIGRpcmVjdGl2ZXMsXG4gICAgdGV4dDogcmVzdWx0LnNwbGl0KC9bXFxyXFxuXSsvZyksXG4gIH07XG59O1xuXG5jbGFzcyBQYXNzYWdlIHtcbiAgaWQgPSBudWxsO1xuICBuYW1lID0gbnVsbDtcbiAgdGFncyA9IG51bGw7XG4gIHRhZ0RpY3QgPSB7fTtcbiAgc291cmNlID0gbnVsbDtcbiAgbGlua3MgPSBbXTtcblxuICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgdGFncywgc291cmNlLCBzdG9yeSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudGFncyA9IHRhZ3M7XG4gICAgdGhpcy5zb3VyY2UgPSB1bmVzY2FwZShzb3VyY2UpO1xuICAgIHRoaXMuc3RvcnkgPSBzdG9yeTtcblxuICAgIHRoaXMudGFncy5mb3JFYWNoKHQgPT4gKHRoaXMudGFnRGljdFt0XSA9IDEpKTtcbiAgfVxuXG4gIGdldFNwZWFrZXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYWtlclRhZyA9IHRoaXMudGFncy5maW5kKHQgPT4gdC5pbmRleE9mKFwic3BlYWtlci1cIikgPT09IDApIHx8IFwiXCI7XG4gICAgaWYgKHNwZWFrZXJUYWcpIHJldHVybiBzcGVha2VyVGFnLnJlcGxhY2UoL15zcGVha2VyLS8sIFwiXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIHByZWZpeFRhZyA9IChwZngsIGFzRGljdCkgPT5cbiAgICB0aGlzLnRhZ3NcbiAgICAgIC5maWx0ZXIodCA9PiB0LmluZGV4T2YoYCR7cGZ4fS1gKSA9PT0gMClcbiAgICAgIC5tYXAodCA9PiB0LnJlcGxhY2UoYCR7cGZ4fS1gLCBcIlwiKSlcbiAgICAgIC5yZWR1Y2UoXG4gICAgICAgIChhLCB0KSA9PiB7XG4gICAgICAgICAgaWYgKGFzRGljdClcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmEsXG4gICAgICAgICAgICAgIFt0XTogMSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gWy4uLmEsIHRdO1xuICAgICAgICB9LFxuICAgICAgICBhc0RpY3QgPyB7fSA6IFtdXG4gICAgICApO1xuXG4gIGhhc1RhZyA9IHQgPT4gdGhpcy50YWdEaWN0W3RdO1xuXG4gIC8vIHN0YXRpYyBhbmQgaW5zdGFuY2UgcmVuZGVyc1xuICBzdGF0aWMgcmVuZGVyID0gc3RyID0+XG4gICAgcmVuZGVyUGFzc2FnZShcbiAgICAgIG5ldyBQYXNzYWdlKG51bGwsIG51bGwsIG51bGwsIHN0ciwgZmluZFN0b3J5KHdpbmRvdyB8fCBudWxsKSlcbiAgICApO1xuICByZW5kZXIgPSAoKSA9PiByZW5kZXJQYXNzYWdlKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQYXNzYWdlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyBhbmQgSFRNTCBjaGFyYWN0ZXJzLiAqL1xudmFyIHJlVW5lc2NhcGVkSHRtbCA9IC9bJjw+XCInYF0vZyxcbiAgICByZUhhc1VuZXNjYXBlZEh0bWwgPSBSZWdFeHAocmVVbmVzY2FwZWRIdG1sLnNvdXJjZSk7XG5cbi8qKiBVc2VkIHRvIG1hcCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuICovXG52YXIgaHRtbEVzY2FwZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmIzM5OycsXG4gICdgJzogJyYjOTY7J1xufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eU9mKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCBieSBgXy5lc2NhcGVgIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAqL1xudmFyIGVzY2FwZUh0bWxDaGFyID0gYmFzZVByb3BlcnR5T2YoaHRtbEVzY2FwZXMpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGNoYXJhY3RlcnMgXCImXCIsIFwiPFwiLCBcIj5cIiwgJ1wiJywgXCInXCIsIGFuZCBcIlxcYFwiIGluIGBzdHJpbmdgIHRvXG4gKiB0aGVpciBjb3JyZXNwb25kaW5nIEhUTUwgZW50aXRpZXMuXG4gKlxuICogKipOb3RlOioqIE5vIG90aGVyIGNoYXJhY3RlcnMgYXJlIGVzY2FwZWQuIFRvIGVzY2FwZSBhZGRpdGlvbmFsXG4gKiBjaGFyYWN0ZXJzIHVzZSBhIHRoaXJkLXBhcnR5IGxpYnJhcnkgbGlrZSBbX2hlX10oaHR0cHM6Ly9tdGhzLmJlL2hlKS5cbiAqXG4gKiBUaG91Z2ggdGhlIFwiPlwiIGNoYXJhY3RlciBpcyBlc2NhcGVkIGZvciBzeW1tZXRyeSwgY2hhcmFjdGVycyBsaWtlXG4gKiBcIj5cIiBhbmQgXCIvXCIgZG9uJ3QgbmVlZCBlc2NhcGluZyBpbiBIVE1MIGFuZCBoYXZlIG5vIHNwZWNpYWwgbWVhbmluZ1xuICogdW5sZXNzIHRoZXkncmUgcGFydCBvZiBhIHRhZyBvciB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuIFNlZVxuICogW01hdGhpYXMgQnluZW5zJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2FtYmlndW91cy1hbXBlcnNhbmRzKVxuICogKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQmFja3RpY2tzIGFyZSBlc2NhcGVkIGJlY2F1c2UgaW4gSUUgPCA5LCB0aGV5IGNhbiBicmVhayBvdXQgb2ZcbiAqIGF0dHJpYnV0ZSB2YWx1ZXMgb3IgSFRNTCBjb21tZW50cy4gU2VlIFsjNTldKGh0dHBzOi8vaHRtbDVzZWMub3JnLyM1OSksXG4gKiBbIzEwMl0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwMiksIFsjMTA4XShodHRwczovL2h0bWw1c2VjLm9yZy8jMTA4KSwgYW5kXG4gKiBbIzEzM10oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEzMykgb2YgdGhlXG4gKiBbSFRNTDUgU2VjdXJpdHkgQ2hlYXRzaGVldF0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvKSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFdoZW4gd29ya2luZyB3aXRoIEhUTUwgeW91IHNob3VsZCBhbHdheXNcbiAqIFtxdW90ZSBhdHRyaWJ1dGUgdmFsdWVzXShodHRwOi8vd29ua28uY29tL3Bvc3QvaHRtbC1lc2NhcGluZykgdG8gcmVkdWNlXG4gKiBYU1MgdmVjdG9ycy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGUoJ2ZyZWQsIGJhcm5leSwgJiBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiBlc2NhcGUoc3RyaW5nKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzVW5lc2NhcGVkSHRtbC50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVVuZXNjYXBlZEh0bWwsIGVzY2FwZUh0bWxDaGFyKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZTtcbiIsImltcG9ydCBQYXNzYWdlIGZyb20gXCIuL1Bhc3NhZ2VcIjtcbmltcG9ydCBlc2NhcGUgZnJvbSBcImxvZGFzaC5lc2NhcGVcIjtcbmltcG9ydCB1bmVzY2FwZSBmcm9tIFwibG9kYXNoLnVuZXNjYXBlXCI7XG5cbmNvbnN0IHNlbGVjdFBhc3NhZ2VzID0gXCJ0dy1wYXNzYWdlZGF0YVwiO1xuY29uc3Qgc2VsZWN0Q3NzID0gJypbdHlwZT1cInRleHQvdHdpbmUtY3NzXCJdJztcbmNvbnN0IHNlbGVjdEpzID0gJypbdHlwZT1cInRleHQvdHdpbmUtamF2YXNjcmlwdFwiXSc7XG5jb25zdCBzZWxlY3RBY3RpdmVMaW5rID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbCBhW2RhdGEtcGFzc2FnZV1cIjtcbmNvbnN0IHNlbGVjdEFjdGl2ZUJ1dHRvbiA9IFwiI3VzZXItcmVzcG9uc2UtcGFuZWwgYnV0dG9uW2RhdGEtcGFzc2FnZV1cIjtcbmNvbnN0IHNlbGVjdEFjdGl2ZUlucHV0ID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbCBpbnB1dFwiO1xuY29uc3Qgc2VsZWN0QWN0aXZlID0gXCIuY2hhdC1wYW5lbCAuYWN0aXZlXCI7XG5jb25zdCBzZWxlY3RIaXN0b3J5ID0gXCIuY2hhdC1wYW5lbCAuaGlzdG9yeVwiO1xuY29uc3Qgc2VsZWN0UmVzcG9uc2VzID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbFwiO1xuY29uc3QgdHlwaW5nSW5kaWNhdG9yID0gXCIjYW5pbWF0aW9uLWNvbnRhaW5lclwiO1xuXG5jb25zdCBJU19OVU1FUklDID0gL15bXFxkXSskLztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBwcm92aWRlZCBzdHJpbmcgY29udGFpbnMgb25seSBudW1iZXJzXG4gKiBJbiB0aGUgY2FzZSBvZiBgcGlkYCB2YWx1ZXMgZm9yIHBhc3NhZ2VzLCB0aGlzIGlzIHRydWVcbiAqL1xuY29uc3QgaXNOdW1lcmljID0gZCA9PiBJU19OVU1FUklDLnRlc3QoZCk7XG5cbi8qKlxuICogRm9ybWF0IGEgdXNlciBwYXNzYWdlIChzdWNoIGFzIGEgcmVzcG9uc2UpXG4gKi9cbmNvbnN0IFVTRVJfUEFTU0FHRV9UTVBMID0gKHsgaWQsIHRleHQgfSkgPT4gYFxuICA8ZGl2IGNsYXNzPVwiY2hhdC1wYXNzYWdlLXdyYXBwZXJcIiBkYXRhLXNwZWFrZXI9XCJ5b3VcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY2hhdC1wYXNzYWdlIHBoaXN0b3J5XCIgZGF0YS1zcGVha2VyPVwieW91XCIgZGF0YS11cGFzc2FnZT1cIiR7aWR9XCI+XG4gICAgICAke3RleHR9XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuLyoqXG4gKiBGb3JtYXQgYSBtZXNzYWdlIGZyb20gYSBub24tdXNlclxuICovXG5jb25zdCBPVEhFUl9QQVNTQUdFX1RNUEwgPSAoeyBzcGVha2VyLCB0YWdzLCB0ZXh0IH0pID0+IGBcbiAgPGRpdiBkYXRhLXNwZWFrZXI9XCIke3NwZWFrZXJ9XCIgY2xhc3M9XCJjaGF0LXBhc3NhZ2Utd3JhcHBlciAke3RhZ3Muam9pbihcIiBcIil9XCI+XG4gICAgPGRpdiBkYXRhLXNwZWFrZXI9XCIke3NwZWFrZXJ9XCIgY2xhc3M9XCJjaGF0LXBhc3NhZ2VcIj5cbiAgICAgICR7dGV4dH1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jb25zdCBESVJFQ1RJVkVTX1RNUEwgPSBkaXJlY3RpdmVzID0+IGBcbiAgPGRpdiBjbGFzcz1cImRpcmVjdGl2ZXNcIj5cbiAgICAke2RpcmVjdGl2ZXNcbiAgICAgIC5tYXAoXG4gICAgICAgICh7IG5hbWUsIGNvbnRlbnQgfSkgPT5cbiAgICAgICAgICBgPGRpdiBjbGFzcz1cImRpcmVjdGl2ZVwiIG5hbWU9XCIke25hbWV9XCI+JHtjb250ZW50LnRyaW0oKX08L2Rpdj5gXG4gICAgICApXG4gICAgICAuam9pbihcIlwiKX1cbiAgPC9kaXY+XG5gO1xuXG4vKipcbiAqIEZvcmNlcyBhIGRlbGF5IHZpYSBwcm9taXNlcyBpbiBvcmRlciB0byBzcHJlYWQgb3V0IG1lc3NhZ2VzXG4gKi9cbmNvbnN0IGRlbGF5ID0gYXN5bmMgKHQgPSAwKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdCkpO1xuXG4vLyBGaW5kIG9uZS9tYW55IG5vZGVzIHdpdGhpbiBhIGNvbnRleHQuIFdlIFsuLi5maW5kQWxsXSB0byBlbnN1cmUgd2UncmUgY2FzdCBhcyBhbiBhcnJheVxuLy8gbm90IGFzIGEgbm9kZSBsaXN0XG5jb25zdCBmaW5kID0gKGN0eCwgcykgPT4gY3R4LnF1ZXJ5U2VsZWN0b3Iocyk7XG5jb25zdCBmaW5kQWxsID0gKGN0eCwgcykgPT4gWy4uLmN0eC5xdWVyeVNlbGVjdG9yQWxsKHMpXSB8fCBbXTtcblxuLyoqXG4gKiBTdGFuZGFyZCBUd2luZSBGb3JtYXQgU3RvcnkgT2JqZWN0XG4gKi9cbmNsYXNzIFN0b3J5IHtcbiAgdmVyc2lvbiA9IDI7IC8vIFR3aW5lIHYyXG5cbiAgZG9jdW1lbnQgPSBudWxsO1xuICBzdG9yeSA9IG51bGw7XG4gIG5hbWUgPSBcIlwiO1xuICBzdGFydHNBdCA9IDA7XG4gIGN1cnJlbnQgPSAwO1xuICBoaXN0b3J5ID0gW107XG4gIHBhc3NhZ2VzID0ge307XG4gIHNob3dQcm9tcHQgPSBmYWxzZTtcbiAgZXJyb3JNZXNzYWdlID0gXCJcXHUyNmEwICVzXCI7XG5cbiAgZGlyZWN0aXZlcyA9IHt9O1xuICBlbGVtZW50cyA9IHt9O1xuXG4gIHVzZXJTY3JpcHRzID0gW107XG4gIHVzZXJTdHlsZXMgPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih3aW4sIHNyYykge1xuICAgIHRoaXMud2luZG93ID0gd2luO1xuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcbiAgICAgICAgXCJCb3RzY3JpcHRlbiBJbmplY3RlZCBDb250ZW50XCJcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3J5ID0gZmluZCh0aGlzLmRvY3VtZW50LCBcInR3LXN0b3J5ZGF0YVwiKTtcblxuICAgIC8vIGVsZW1lbnRzXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcbiAgICAgIGFjdGl2ZTogZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RBY3RpdmUpLFxuICAgICAgaGlzdG9yeTogZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RIaXN0b3J5KSxcbiAgICB9O1xuXG4gICAgLy8gcHJvcGVydGllcyBvZiBzdG9yeSBub2RlXG4gICAgdGhpcy5uYW1lID0gdGhpcy5zdG9yeS5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IFwiXCI7XG4gICAgdGhpcy5zdGFydHNBdCA9IHRoaXMuc3RvcnkuZ2V0QXR0cmlidXRlKFwic3RhcnRub2RlXCIpIHx8IDA7XG5cbiAgICBmaW5kQWxsKHRoaXMuc3RvcnksIHNlbGVjdFBhc3NhZ2VzKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgY29uc3QgaWQgPSBwYXJzZUludChwLmdldEF0dHJpYnV0ZShcInBpZFwiKSk7XG4gICAgICBjb25zdCBuYW1lID0gcC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xuICAgICAgY29uc3QgdGFncyA9IChwLmdldEF0dHJpYnV0ZShcInRhZ3NcIikgfHwgXCJcIikuc3BsaXQoL1xccysvZyk7XG4gICAgICBjb25zdCBwYXNzYWdlID0gcC5pbm5lckhUTUwgfHwgXCJcIjtcblxuICAgICAgdGhpcy5wYXNzYWdlc1tpZF0gPSBuZXcgUGFzc2FnZShpZCwgbmFtZSwgdGFncywgcGFzc2FnZSwgdGhpcyk7XG4gICAgfSk7XG5cbiAgICBmaW5kKHRoaXMuZG9jdW1lbnQsIFwidGl0bGVcIikuaW5uZXJIVE1MID0gdGhpcy5uYW1lO1xuICAgIGZpbmQodGhpcy5kb2N1bWVudCwgXCIjcHRpdGxlXCIpLmlubmVySFRNTCA9IHRoaXMubmFtZTtcblxuICAgIHRoaXMudXNlclNjcmlwdHMgPSAoZmluZEFsbCh0aGlzLmRvY3VtZW50LCBzZWxlY3RKcykgfHwgW10pLm1hcChcbiAgICAgIGVsID0+IGVsLmlubmVySFRNTFxuICAgICk7XG4gICAgdGhpcy51c2VyU3R5bGVzID0gKGZpbmRBbGwodGhpcy5kb2N1bWVudCwgc2VsZWN0Q3NzKSB8fCBbXSkubWFwKFxuICAgICAgZWwgPT4gZWwuaW5uZXJIVE1MXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIHN0b3J5IGJ5IHNldHRpbmcgdXAgbGlzdGVuZXJzIGFuZCB0aGVuIGFkdmFuY2luZ1xuICAgKiB0byB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgc3RhY2tcbiAgICovXG4gIHN0YXJ0ID0gKCkgPT4ge1xuICAgIC8vIGFjdGl2YXRlIHVzZXJzY3JpcHRzIGFuZCBzdHlsZXNcbiAgICB0aGlzLnVzZXJTdHlsZXMuZm9yRWFjaChzID0+IHtcbiAgICAgIGNvbnN0IHQgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgIHQuaW5uZXJIVE1MID0gcztcbiAgICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0KTtcbiAgICB9KTtcbiAgICB0aGlzLnVzZXJTY3JpcHRzLmZvckVhY2gocyA9PiB7XG4gICAgICAvLyBldmFsIGlzIGV2aWwsIGJ1dCB0aGlzIGlzIHNpbXBseSBob3cgVHdpbmUgd29ya3NcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIGdsb2JhbEV2YWwocyk7XG4gICAgfSk7XG5cbiAgICAvLyB3aGVuIHlvdSBjbGljayBvbiBhW2RhdGEtcGFzc2FnZV0gKHJlc3BvbnNlIGxpbmspLi4uXG4gICAgdGhpcy5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQubWF0Y2hlcyhzZWxlY3RBY3RpdmVMaW5rKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWR2YW5jZShcbiAgICAgICAgdGhpcy5maW5kUGFzc2FnZShlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhc3NhZ2VcIikpLFxuICAgICAgICBlLnRhcmdldC5pbm5lckhUTUxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvLyB3aGVuIHlvdSBjbGljayBvbiBidXR0b25bZGF0YS1wYXNzYWdlXSAocmVzcG9uc2UgaW5wdXQpLi4uXG4gICAgdGhpcy5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQubWF0Y2hlcyhzZWxlY3RBY3RpdmVCdXR0b24pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gY2FwdHVyZSBhbmQgZGlzYWJsZSBzaG93UHJvbXB0IGZlYXR1cmVcbiAgICAgIGNvbnN0IHZhbHVlID0gZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RBY3RpdmVJbnB1dCkudmFsdWU7XG4gICAgICB0aGlzLnNob3dQcm9tcHQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5hZHZhbmNlKFxuICAgICAgICB0aGlzLmZpbmRQYXNzYWdlKGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtcGFzc2FnZVwiKSksXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hZHZhbmNlKHRoaXMuZmluZFBhc3NhZ2UodGhpcy5zdGFydHNBdCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGaW5kIGEgcGFzc2FnZSBiYXNlZCBvbiBpdHMgaWQgb3IgbmFtZVxuICAgKi9cbiAgZmluZFBhc3NhZ2UgPSBpZE9yTmFtZSA9PiB7XG4gICAgaWYgKGlzTnVtZXJpYyhpZE9yTmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhc3NhZ2VzW2lkT3JOYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaGFuZGxlIHBhc3NhZ2VzIHdpdGggJyBhbmQgXCIgKGNhbid0IHVzZSBhIGNzcyBzZWxlY3RvciBjb25zaXN0ZW50bHkpXG4gICAgICBjb25zdCBwID0gZmluZEFsbCh0aGlzLnN0b3J5LCBcInR3LXBhc3NhZ2VkYXRhXCIpLmZpbHRlcihcbiAgICAgICAgcCA9PiB1bmVzY2FwZShwLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpID09PSBpZE9yTmFtZVxuICAgICAgKVswXTtcbiAgICAgIGlmICghcCkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5wYXNzYWdlc1twLmdldEF0dHJpYnV0ZShcInBpZFwiKV07XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBBZHZhbmNlIHRoZSBzdG9yeSB0byB0aGUgcGFzc2FnZSBzcGVjaWZpZWQsIG9wdGlvbmFsbHkgYWRkaW5nIHVzZXJUZXh0XG4gICAqL1xuICBhZHZhbmNlID0gYXN5bmMgKHBhc3NhZ2UsIHVzZXJUZXh0ID0gbnVsbCkgPT4ge1xuICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhc3NhZ2UuaWQpO1xuICAgIGNvbnN0IGxhc3QgPSB0aGlzLmN1cnJlbnQ7XG5cbiAgICAvLyAuYWN0aXZlIGlzIGNhcHR1cmVkICYgY2xlYXJlZFxuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5lbGVtZW50cy5hY3RpdmUuaW5uZXJIVE1MO1xuICAgIHRoaXMuZWxlbWVudHMuYWN0aXZlLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvLyB3aGF0ZXZlciB3YXMgaW4gYWN0aXZlIGlzIG1vdmVkIHVwIGludG8gaGlzdG9yeVxuICAgIHRoaXMuZWxlbWVudHMuaGlzdG9yeS5pbm5lckhUTUwgKz0gZXhpc3Rpbmc7XG5cbiAgICAvLyBpZiB0aGVyZSBpcyB1c2VyVGV4dCwgaXQgaXMgYWRkZWQgdG8gLmhpc3RvcnlcbiAgICBpZiAodXNlclRleHQpIHtcbiAgICAgIHRoaXMucmVuZGVyVXNlck1lc3NhZ2UoXG4gICAgICAgIGxhc3QsXG4gICAgICAgIHVzZXJUZXh0LFxuICAgICAgICBzID0+ICh0aGlzLmVsZW1lbnRzLmhpc3RvcnkuaW5uZXJIVE1MICs9IHMpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFRoZSBuZXcgcGFzc2FnZSBpcyByZW5kZXJlZCBhbmQgcGxhY2VkIGluIC5hY3RpdmVcbiAgICAvLyBhZnRlciBhbGwgcmVuZGVycywgdXNlciBvcHRpb25zIGFyZSBkaXNwbGF5ZWRcbiAgICBhd2FpdCB0aGlzLnJlbmRlclBhc3NhZ2UoXG4gICAgICBwYXNzYWdlLFxuICAgICAgcyA9PiAodGhpcy5lbGVtZW50cy5hY3RpdmUuaW5uZXJIVE1MICs9IHMpXG4gICAgKTtcblxuICAgIGlmICghcGFzc2FnZS5oYXNUYWcoXCJ3YWl0XCIpICYmIHBhc3NhZ2UubGlua3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBhdXRvIGFkdmFuY2UgaWYgdGhlIHdhaXQgdGFnIGlzIG5vdCBzZXQgYW5kIHRoZXJlIGlzIGV4YWN0bHlcbiAgICAgIC8vIDEgbGluayBmb3VuZCBpbiBvdXIgcHNzYWdlLlxuICAgICAgdGhpcy5hZHZhbmNlKHRoaXMuZmluZFBhc3NhZ2UocGFzc2FnZS5saW5rc1swXS50YXJnZXQpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlckNob2ljZXMocGFzc2FnZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0ZXh0IGFzIGlmIGl0IGNhbWUgZnJvbSB0aGUgdXNlclxuICAgKi9cbiAgcmVuZGVyVXNlck1lc3NhZ2UgPSBhc3luYyAocGlkLCB0ZXh0LCByZW5kZXJlcikgPT4ge1xuICAgIGF3YWl0IHJlbmRlcmVyKFxuICAgICAgVVNFUl9QQVNTQUdFX1RNUEwoe1xuICAgICAgICBwaWQsXG4gICAgICAgIHRleHQsXG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVuZGVyIGEgVHdpbmUgcGFzc2FnZSBvYmplY3RcbiAgICovXG4gIHJlbmRlclBhc3NhZ2UgPSBhc3luYyAocGFzc2FnZSwgcmVuZGVyZXIpID0+IHtcbiAgICBjb25zdCBzcGVha2VyID0gcGFzc2FnZS5nZXRTcGVha2VyKCk7XG4gICAgbGV0IHN0YXRlbWVudHMgPSBwYXNzYWdlLnJlbmRlcigpO1xuICAgIGNvbnNvbGUubG9nKHN0YXRlbWVudHMuZGlyZWN0aXZlcyk7XG5cbiAgICBhd2FpdCByZW5kZXJlcihESVJFQ1RJVkVTX1RNUEwoc3RhdGVtZW50cy5kaXJlY3RpdmVzKSk7XG5cbiAgICBsZXQgbmV4dCA9IHN0YXRlbWVudHMudGV4dC5zaGlmdCgpO1xuICAgIHRoaXMuc2hvd1R5cGluZygpO1xuICAgIHdoaWxlIChuZXh0KSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gT1RIRVJfUEFTU0FHRV9UTVBMKHtcbiAgICAgICAgc3BlYWtlcixcbiAgICAgICAgdGFnczogcGFzc2FnZS50YWdzLFxuICAgICAgICB0ZXh0OiBuZXh0LFxuICAgICAgfSk7XG4gICAgICBhd2FpdCBkZWxheSh0aGlzLmNhbGN1bGF0ZURlbGF5KG5leHQpKTsgLy8gdG9kb1xuICAgICAgYXdhaXQgcmVuZGVyZXIoY29udGVudCk7XG4gICAgICBuZXh0ID0gc3RhdGVtZW50cy50ZXh0LnNoaWZ0KCk7XG4gICAgfVxuICAgIHRoaXMuaGlkZVR5cGluZygpO1xuICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfTtcblxuICAvKipcbiAgICogQSByb3VnaCBmdW5jdGlvbiBmb3IgZGV0ZXJtaW5pbmcgYSB3YWl0aW5nIHBlcmlvZCBiYXNlZCBvbiBzdHJpbmcgbGVuZ3RoXG4gICAqL1xuICBjYWxjdWxhdGVEZWxheSA9IHR4dCA9PiB7XG4gICAgY29uc3QgdHlwaW5nRGVsYXlSYXRpbyA9IDAuMztcbiAgICBjb25zdCByYXRlID0gMjA7IC8vIG1zXG4gICAgcmV0dXJuIHR4dC5sZW5ndGggKiByYXRlICogdHlwaW5nRGVsYXlSYXRpbztcbiAgfTtcblxuICAvKipcbiAgICogU2hvd3MgdGhlIHR5cGluZyBpbmRpY2F0b3JcbiAgICovXG4gIHNob3dUeXBpbmcgPSAoKSA9PiB7XG4gICAgZmluZCh0aGlzLmRvY3VtZW50LCB0eXBpbmdJbmRpY2F0b3IpLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgfTtcblxuICAvKipcbiAgICogSGlkZXMgdGhlIHR5cGluZyBpbmRpY2F0b3JcbiAgICovXG4gIGhpZGVUeXBpbmcgPSAoKSA9PiB7XG4gICAgZmluZCh0aGlzLmRvY3VtZW50LCB0eXBpbmdJbmRpY2F0b3IpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTY3JvbGxzIHRoZSBkb2N1bWVudCBhcyBmYXIgYXMgcG9zc2libGUgKGJhc2VkIG9uIGhpc3RvcnkgY29udGFpbmVyJ3MgaGVpZ2h0KVxuICAgKi9cbiAgc2Nyb2xsVG9Cb3R0b20gPSAoKSA9PiB7XG4gICAgY29uc3QgaGlzdCA9IGZpbmQodGhpcy5kb2N1bWVudCwgXCIjcGhpc3RvcnlcIik7XG4gICAgZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxUb3AgPSBoaXN0Lm9mZnNldEhlaWdodDtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBjaG9pY2VzIHBhbmVsXG4gICAqL1xuICByZW1vdmVDaG9pY2VzID0gKCkgPT4ge1xuICAgIGNvbnN0IHBhbmVsID0gZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RSZXNwb25zZXMpO1xuICAgIHBhbmVsLmlubmVySFRNTCA9IFwiXCI7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIGNob2ljZXMgcGFuZWwgd2l0aCBhIHNldCBvZiBvcHRpb25zIGJhc2VkIG9uIHBhc3NhZ2UgbGlua3NcbiAgICovXG4gIHJlbmRlckNob2ljZXMgPSBwYXNzYWdlID0+IHtcbiAgICB0aGlzLnJlbW92ZUNob2ljZXMoKTtcbiAgICBjb25zdCBwYW5lbCA9IGZpbmQodGhpcy5kb2N1bWVudCwgc2VsZWN0UmVzcG9uc2VzKTtcbiAgICBwYXNzYWdlLmxpbmtzLmZvckVhY2gobCA9PiB7XG4gICAgICBwYW5lbC5pbm5lckhUTUwgKz0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBjbGFzcz1cInVzZXItcmVzcG9uc2VcIiBkYXRhLXBhc3NhZ2U9XCIke2VzY2FwZShcbiAgICAgICAgbC50YXJnZXRcbiAgICAgICl9XCI+JHtsLmRpc3BsYXl9PC9hPmA7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGN1c3RvbSBkaXJlY3RpdmUgZm9yIHRoaXMgc3RvcnlcbiAgICogU2lnbmF0dXJlIG9mIChkaXJlY3RpdmVDb250ZW50LCBvdXRwdXRUZXh0LCBzdG9yeSwgcGFzc2FnZSwgbmV4dClcbiAgICovXG4gIGRpcmVjdGl2ZSA9IChpZCwgY2IpID0+IHtcbiAgICBpZiAoIXRoaXMuZGlyZWN0aXZlc1tpZF0pIHtcbiAgICAgIHRoaXMuZGlyZWN0aXZlc1tpZF0gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5kaXJlY3RpdmVzW2lkXS5wdXNoKGNiKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU3Rvcnk7XG4iLCJpbXBvcnQgU3RvcnkgZnJvbSBcIi4vU3RvcnlcIjtcblxuKHdpbiA9PiB7XG4gIGlmICh0eXBlb2Ygd2luICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB3aW4uZ2xvYmFsRXZhbCA9IGV2YWw7XG4gICAgICB3aW4uc3RvcnkgPSBuZXcgU3Rvcnkod2luKTtcbiAgICAgIHdpbi5zdG9yeS5zdGFydCgpO1xuICAgICAgaWYgKHdpbi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Nob3dfZGlyZWN0aXZlc1wiKS5jaGVja2VkKSB7XG4gICAgICAgIHdpbi5kb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJzaG93LWRpcmVjdGl2ZXNcIik7XG4gICAgICB9XG4gICAgICBpZiAod2luLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvb2ZpbmdcIikuY2hlY2tlZCkge1xuICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicHJvb2ZcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicnVuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgd2luLmRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvcihcIiNzaG93X2RpcmVjdGl2ZXNcIilcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGUgPT4ge1xuICAgICAgICBpZiAoZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgIHdpbi5kb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJzaG93LWRpcmVjdGl2ZXNcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luLmRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInNob3ctZGlyZWN0aXZlc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB3aW4uZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9vZmluZ1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGUgPT4ge1xuICAgICAgaWYgKGUudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgd2luLmRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInByb29mXCIpO1xuICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicnVuXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luLmRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInJ1blwiKTtcbiAgICAgICAgd2luLmRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInByb29mXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcInR3LXBhc3NhZ2VkYXRhW3BpZD0nXCIgK1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0dy1zdG9yeWRhdGFcIikuZ2V0QXR0cmlidXRlKFwic3RhcnRub2RlXCIpICtcbiAgICAgICAgICBcIiddXCJcbiAgICAgIClcbiAgICAgIC5jbGFzc0xpc3QuYWRkKFwic3RhcnRcIik7XG4gIH1cbn0pKHdpbmRvdyB8fCB1bmRlZmluZWQpO1xuIl0sIm5hbWVzIjpbInVuZGVmaW5lZCIsInJlcXVpcmUkJDAiLCJnbG9iYWwiLCJTeW1ib2wiLCJUT0tFTl9FU0NBUEVEX09DVE8iLCJCTE9DS19ESVJFQ1RJVkUiLCJJTkxJTkVfRElSRUNUSVZFIiwiZXh0cmFjdERpcmVjdGl2ZXMiLCJzIiwiZGlyZWN0aXZlcyIsInJlcGxhY2UiLCJtYXRjaCIsImRpciIsImNvbnRlbnQiLCJwdXNoIiwibmFtZSIsInRyaW0iLCJMSU5LX1BBVFRFUk4iLCJleHRyYWN0TGlua3MiLCJzdHIiLCJsaW5rcyIsIm9yaWdpbmFsIiwidCIsImRpc3BsYXkiLCJ0YXJnZXQiLCJiYXJJbmRleCIsImluZGV4T2YiLCJyaWdodEFyckluZGV4IiwibGVmdEFyckluZGV4Iiwic3Vic3RyIiwidXBkYXRlZCIsIkJMT0NLX0NPTU1FTlQiLCJJTkxJTkVfQ09NTUVOVCIsInN0cmlwQ29tbWVudHMiLCJmaW5kU3RvcnkiLCJ3aW4iLCJzdG9yeSIsInN0YXRlIiwicmVuZGVyUGFzc2FnZSIsInBhc3NhZ2UiLCJzb3VyY2UiLCJyZXN1bHQiLCJsaW5rRGF0YSIsImZvckVhY2giLCJkIiwicnVuIiwiZ2V0U3BlYWtlciIsInRleHQiLCJwcm9tcHRzIiwicHJlZml4VGFnIiwibGVuZ3RoIiwicHJvbXB0IiwiaGFzVGFnIiwic3BsaXQiLCJQYXNzYWdlIiwiaWQiLCJ0YWdzIiwic3BlYWtlclRhZyIsImZpbmQiLCJwZngiLCJhc0RpY3QiLCJmaWx0ZXIiLCJtYXAiLCJyZWR1Y2UiLCJhIiwidGFnRGljdCIsInVuZXNjYXBlIiwid2luZG93IiwiSU5GSU5JVFkiLCJzeW1ib2xUYWciLCJmcmVlR2xvYmFsIiwiZnJlZVNlbGYiLCJyb290IiwiYmFzZVByb3BlcnR5T2YiLCJvYmplY3RQcm90byIsIm9iamVjdFRvU3RyaW5nIiwic3ltYm9sUHJvdG8iLCJzeW1ib2xUb1N0cmluZyIsImJhc2VUb1N0cmluZyIsImlzU3ltYm9sIiwiaXNPYmplY3RMaWtlIiwidG9TdHJpbmciLCJzZWxlY3RQYXNzYWdlcyIsInNlbGVjdENzcyIsInNlbGVjdEpzIiwic2VsZWN0QWN0aXZlTGluayIsInNlbGVjdEFjdGl2ZUJ1dHRvbiIsInNlbGVjdEFjdGl2ZUlucHV0Iiwic2VsZWN0QWN0aXZlIiwic2VsZWN0SGlzdG9yeSIsInNlbGVjdFJlc3BvbnNlcyIsInR5cGluZ0luZGljYXRvciIsIklTX05VTUVSSUMiLCJpc051bWVyaWMiLCJ0ZXN0IiwiVVNFUl9QQVNTQUdFX1RNUEwiLCJPVEhFUl9QQVNTQUdFX1RNUEwiLCJzcGVha2VyIiwiam9pbiIsIkRJUkVDVElWRVNfVE1QTCIsImRlbGF5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiY3R4IiwicXVlcnlTZWxlY3RvciIsImZpbmRBbGwiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJxdWVyeVNlbGVjdG9yQWxsIiwiU3RvcnkiLCJzcmMiLCJ1c2VyU3R5bGVzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiYm9keSIsImFwcGVuZENoaWxkIiwidXNlclNjcmlwdHMiLCJnbG9iYWxFdmFsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJtYXRjaGVzIiwiYWR2YW5jZSIsImZpbmRQYXNzYWdlIiwiZ2V0QXR0cmlidXRlIiwidmFsdWUiLCJzaG93UHJvbXB0Iiwic3RhcnRzQXQiLCJpZE9yTmFtZSIsInBhc3NhZ2VzIiwicCIsInVzZXJUZXh0IiwiaGlzdG9yeSIsImxhc3QiLCJjdXJyZW50IiwiZXhpc3RpbmciLCJlbGVtZW50cyIsImFjdGl2ZSIsInJlbmRlclVzZXJNZXNzYWdlIiwicmVuZGVyQ2hvaWNlcyIsInBpZCIsInJlbmRlcmVyIiwic2Nyb2xsVG9Cb3R0b20iLCJzdGF0ZW1lbnRzIiwicmVuZGVyIiwiY29uc29sZSIsImxvZyIsIm5leHQiLCJzaGlmdCIsInNob3dUeXBpbmciLCJjYWxjdWxhdGVEZWxheSIsImhpZGVUeXBpbmciLCJ0eHQiLCJ0eXBpbmdEZWxheVJhdGlvIiwicmF0ZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsImhpc3QiLCJzY3JvbGxpbmdFbGVtZW50Iiwic2Nyb2xsVG9wIiwib2Zmc2V0SGVpZ2h0IiwicGFuZWwiLCJyZW1vdmVDaG9pY2VzIiwibCIsImVzY2FwZSIsImNiIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJwYXJzZUludCIsImVsIiwiZXZlbnQiLCJldmFsIiwic3RhcnQiLCJjaGVja2VkIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIl0sIm1hcHBpbmdzIjoiOzs7OztFQUFBLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUU7SUFDOUMsSUFBSSxFQUFFLFFBQVEsWUFBWSxXQUFXLENBQUMsRUFBRTtNQUN0QyxNQUFNLElBQUksU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7S0FDMUQ7R0FDRjs7RUFFRCxrQkFBYyxHQUFHLGVBQWU7O0VDTmhDLFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0lBQ3hDLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtNQUNkLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcs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
