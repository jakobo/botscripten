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
    return "\n  <div class=\"chat-passage-reset\">\n    <div class=\"chat-passage-wrapper\" data-speaker=\"you\">\n      <div class=\"chat-passage phistory\" data-speaker=\"you\" data-upassage=\"".concat(id, "\">\n        ").concat(text, "\n      </div>\n    </div>\n  </div>\n");
  };
  /**
   * Format a message from a non-user
   */


  var OTHER_PASSAGE_TMPL = function OTHER_PASSAGE_TMPL(_ref2) {
    var speaker = _ref2.speaker,
        tags = _ref2.tags,
        text = _ref2.text;
    return "\n  <div class=\"chat-passage-reset\">\n    <div data-speaker=\"".concat(speaker, "\" class=\"chat-passage-wrapper ").concat(tags.join(" "), "\">\n      <div data-speaker=\"").concat(speaker, "\" class=\"chat-passage\">\n        ").concat(text, "\n      </div>\n    </div>\n  </div>\n");
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
      idOrName = "".concat(idOrName).trim();

      if (isNumeric(idOrName)) {
        return _this.passages[idOrName];
      } else {
        // handle passages with ' and " (can't use a css selector consistently)
        var p = findAll(_this.story, "tw-passagedata").filter(function (p) {
          return lodash_unescape(p.getAttribute("name")).trim() === idOrName;
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
                  id: pid,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90c2NyaXB0ZW4udW1kLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRob3V0SG9sZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9ub25JdGVyYWJsZVNwcmVhZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoLnVuZXNjYXBlL2luZGV4LmpzIiwiLi4vc3JjL2NvbW1vbi9leHRyYWN0RGlyZWN0aXZlcy5qcyIsIi4uL3NyYy9jb21tb24vZXh0cmFjdExpbmtzLmpzIiwiLi4vc3JjL2NvbW1vbi9zdHJpcENvbW1lbnRzLmpzIiwiLi4vc3JjL3R3aW5lL1Bhc3NhZ2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoLmVzY2FwZS9pbmRleC5qcyIsIi4uL3NyYy90d2luZS9TdG9yeS5qcyIsIi4uL3NyYy90d2luZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jbGFzc0NhbGxDaGVjazsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycjJbaV0gPSBhcnJbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjI7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRob3V0SG9sZXM7IiwiZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheTsiLCJmdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVTcHJlYWQ7IiwidmFyIGFycmF5V2l0aG91dEhvbGVzID0gcmVxdWlyZShcIi4vYXJyYXlXaXRob3V0SG9sZXNcIik7XG5cbnZhciBpdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXlcIik7XG5cbnZhciBub25JdGVyYWJsZVNwcmVhZCA9IHJlcXVpcmUoXCIuL25vbkl0ZXJhYmxlU3ByZWFkXCIpO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7XG4gIHJldHVybiBhcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IGl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3RvQ29uc3VtYWJsZUFycmF5OyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbnZhciByZUVzY2FwZWRIdG1sID0gLyYoPzphbXB8bHR8Z3R8cXVvdHwjMzl8Izk2KTsvZyxcbiAgICByZUhhc0VzY2FwZWRIdG1sID0gUmVnRXhwKHJlRXNjYXBlZEh0bWwuc291cmNlKTtcblxuLyoqIFVzZWQgdG8gbWFwIEhUTUwgZW50aXRpZXMgdG8gY2hhcmFjdGVycy4gKi9cbnZhciBodG1sVW5lc2NhcGVzID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnLFxuICAnJmd0Oyc6ICc+JyxcbiAgJyZxdW90Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiLFxuICAnJiM5NjsnOiAnYCdcbn07XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eU9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlPZihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYF8udW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBjaGFyYWN0ZXIuXG4gKi9cbnZhciB1bmVzY2FwZUh0bWxDaGFyID0gYmFzZVByb3BlcnR5T2YoaHRtbFVuZXNjYXBlcyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiBgXy5lc2NhcGVgOyB0aGlzIG1ldGhvZCBjb252ZXJ0cyB0aGUgSFRNTCBlbnRpdGllc1xuICogYCZhbXA7YCwgYCZsdDtgLCBgJmd0O2AsIGAmcXVvdDtgLCBgJiMzOTtgLCBhbmQgYCYjOTY7YCBpbiBgc3RyaW5nYCB0b1xuICogdGhlaXIgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzLlxuICpcbiAqICoqTm90ZToqKiBObyBvdGhlciBIVE1MIGVudGl0aWVzIGFyZSB1bmVzY2FwZWQuIFRvIHVuZXNjYXBlIGFkZGl0aW9uYWxcbiAqIEhUTUwgZW50aXRpZXMgdXNlIGEgdGhpcmQtcGFydHkgbGlicmFyeSBsaWtlIFtfaGVfXShodHRwczovL210aHMuYmUvaGUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC42LjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc0VzY2FwZWRIdG1sLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlZEh0bWwsIHVuZXNjYXBlSHRtbENoYXIpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5lc2NhcGU7XG4iLCJjb25zdCBUT0tFTl9FU0NBUEVEX09DVE8gPSBcIl9fVE9LRU5fRVNDQVBFRF9CQUNLU0xBU0hfT0NUT19fXCI7XG5jb25zdCBCTE9DS19ESVJFQ1RJVkUgPSAvXiMjI0AoW1xcU10rKShbXFxzXFxTXSo/KSMjIy9nbTtcbmNvbnN0IElOTElORV9ESVJFQ1RJVkUgPSAvXiNAKFtcXFNdKykoLiopJC9nbTtcblxuY29uc3QgZXh0cmFjdERpcmVjdGl2ZXMgPSBzID0+IHtcbiAgY29uc3QgZGlyZWN0aXZlcyA9IFtdO1xuXG4gIC8vIGF2b2lkIHVzaW5nIGVzY2FwZWQgaXRlbXNcbiAgcyA9IHMucmVwbGFjZShcIlxcXFwjXCIsIFRPS0VOX0VTQ0FQRURfT0NUTyk7XG5cbiAgd2hpbGUgKHMubWF0Y2goQkxPQ0tfRElSRUNUSVZFKSkge1xuICAgIHMgPSBzLnJlcGxhY2UoQkxPQ0tfRElSRUNUSVZFLCAobWF0Y2gsIGRpciwgY29udGVudCkgPT4ge1xuICAgICAgZGlyZWN0aXZlcy5wdXNoKHsgbmFtZTogYEAke2Rpcn1gLCBjb250ZW50OiBjb250ZW50LnRyaW0oKSB9KTtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH0pO1xuICB9XG5cbiAgd2hpbGUgKHMubWF0Y2goSU5MSU5FX0RJUkVDVElWRSkpIHtcbiAgICBzID0gcy5yZXBsYWNlKElOTElORV9ESVJFQ1RJVkUsIChtYXRjaCwgZGlyLCBjb250ZW50KSA9PiB7XG4gICAgICBkaXJlY3RpdmVzLnB1c2goeyBuYW1lOiBgQCR7ZGlyfWAsIGNvbnRlbnQ6IGNvbnRlbnQudHJpbSgpIH0pO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlcztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4dHJhY3REaXJlY3RpdmVzO1xuIiwiY29uc3QgTElOS19QQVRURVJOID0gL1xcW1xcWyguKj8pXFxdXFxdL2dtO1xuXG5jb25zdCBleHRyYWN0TGlua3MgPSBzdHIgPT4ge1xuICBjb25zdCBsaW5rcyA9IFtdO1xuICBjb25zdCBvcmlnaW5hbCA9IHN0cjtcblxuICB3aGlsZSAoc3RyLm1hdGNoKExJTktfUEFUVEVSTikpIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShMSU5LX1BBVFRFUk4sIChtYXRjaCwgdCkgPT4ge1xuICAgICAgbGV0IGRpc3BsYXkgPSB0O1xuICAgICAgbGV0IHRhcmdldCA9IHQ7XG5cbiAgICAgIC8vIGRpc3BsYXl8dGFyZ2V0IGZvcm1hdFxuICAgICAgY29uc3QgYmFySW5kZXggPSB0LmluZGV4T2YoXCJ8XCIpO1xuICAgICAgY29uc3QgcmlnaHRBcnJJbmRleCA9IHQuaW5kZXhPZihcIi0+XCIpO1xuICAgICAgY29uc3QgbGVmdEFyckluZGV4ID0gdC5pbmRleE9mKFwiPC1cIik7XG5cbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICBjYXNlIGJhckluZGV4ID49IDA6XG4gICAgICAgICAgZGlzcGxheSA9IHQuc3Vic3RyKDAsIGJhckluZGV4KTtcbiAgICAgICAgICB0YXJnZXQgPSB0LnN1YnN0cihiYXJJbmRleCArIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHJpZ2h0QXJySW5kZXggPj0gMDpcbiAgICAgICAgICBkaXNwbGF5ID0gdC5zdWJzdHIoMCwgcmlnaHRBcnJJbmRleCk7XG4gICAgICAgICAgdGFyZ2V0ID0gdC5zdWJzdHIocmlnaHRBcnJJbmRleCArIDIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGxlZnRBcnJJbmRleCA+PSAwOlxuICAgICAgICAgIGRpc3BsYXkgPSB0LnN1YnN0cihsZWZ0QXJySW5kZXggKyAyKTtcbiAgICAgICAgICB0YXJnZXQgPSB0LnN1YnN0cigwLCBsZWZ0QXJySW5kZXgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBsaW5rcy5wdXNoKHtcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBcIlwiOyAvLyByZW5kZXIgbm90aGluZyBpZiBpdCdzIGEgdHdlZSBsaW5rXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxpbmtzLFxuICAgIHVwZGF0ZWQ6IHN0cixcbiAgICBvcmlnaW5hbCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4dHJhY3RMaW5rcztcbiIsImNvbnN0IFRPS0VOX0VTQ0FQRURfT0NUTyA9IFwiX19UT0tFTl9FU0NBUEVEX0JBQ0tTTEFTSF9PQ1RPX19cIjtcblxuY29uc3QgQkxPQ0tfQ09NTUVOVCA9IC8jIyNbXFxzXFxTXSo/IyMjL2dtO1xuY29uc3QgSU5MSU5FX0NPTU1FTlQgPSAvXiMuKiQvZ207XG5cbmNvbnN0IHN0cmlwQ29tbWVudHMgPSBzdHIgPT5cbiAgc3RyXG4gICAgLnJlcGxhY2UoXCJcXFxcI1wiLCBUT0tFTl9FU0NBUEVEX09DVE8pXG4gICAgLnJlcGxhY2UoQkxPQ0tfQ09NTUVOVCwgXCJcIilcbiAgICAucmVwbGFjZShJTkxJTkVfQ09NTUVOVCwgXCJcIilcbiAgICAucmVwbGFjZShUT0tFTl9FU0NBUEVEX09DVE8sIFwiI1wiKVxuICAgIC50cmltKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmlwQ29tbWVudHM7XG4iLCJpbXBvcnQgdW5lc2NhcGUgZnJvbSBcImxvZGFzaC51bmVzY2FwZVwiO1xuaW1wb3J0IGV4dHJhY3REaXJlY3RpdmVzIGZyb20gXCIuLi9jb21tb24vZXh0cmFjdERpcmVjdGl2ZXNcIjtcbmltcG9ydCBleHRyYWN0TGlua3MgZnJvbSBcIi4uL2NvbW1vbi9leHRyYWN0TGlua3NcIjtcbmltcG9ydCBzdHJpcENvbW1lbnRzIGZyb20gXCIuLi9jb21tb24vc3RyaXBDb21tZW50c1wiO1xuXG5jb25zdCBmaW5kU3RvcnkgPSB3aW4gPT4ge1xuICBpZiAod2luICYmIHdpbi5zdG9yeSkge1xuICAgIHJldHVybiB3aW4uc3Rvcnk7XG4gIH1cbiAgcmV0dXJuIHsgc3RhdGU6IHt9IH07XG59O1xuXG5jb25zdCByZW5kZXJQYXNzYWdlID0gcGFzc2FnZSA9PiB7XG4gIGNvbnN0IHNvdXJjZSA9IHBhc3NhZ2Uuc291cmNlO1xuXG4gIGNvbnN0IGRpcmVjdGl2ZXMgPSBleHRyYWN0RGlyZWN0aXZlcyhzb3VyY2UpO1xuICBsZXQgcmVzdWx0ID0gc3RyaXBDb21tZW50cyhzb3VyY2UpO1xuXG4gIGlmIChwYXNzYWdlKSB7XG4gICAgLy8gcmVtb3ZlIGxpbmtzIGlmIHNldCBwcmV2aW91c2x5XG4gICAgcGFzc2FnZS5saW5rcyA9IFtdO1xuICB9XG5cbiAgLy8gW1tsaW5rc11dXG4gIGNvbnN0IGxpbmtEYXRhID0gZXh0cmFjdExpbmtzKHJlc3VsdCk7XG4gIHJlc3VsdCA9IGxpbmtEYXRhLnVwZGF0ZWQ7XG4gIGlmIChwYXNzYWdlKSB7XG4gICAgcGFzc2FnZS5saW5rcyA9IGxpbmtEYXRhLmxpbmtzO1xuICB9XG5cbiAgLy8gYmVmb3JlIGhhbmRsaW5nIGFueSB0YWdzLCBoYW5kbGUgYW55L2FsbCBkaXJlY3RpdmVzXG4gIGRpcmVjdGl2ZXMuZm9yRWFjaChkID0+IHtcbiAgICBpZiAoIXBhc3NhZ2Uuc3RvcnkuZGlyZWN0aXZlc1tkLm5hbWVdKSByZXR1cm47XG4gICAgcGFzc2FnZS5zdG9yeS5kaXJlY3RpdmVzW2QubmFtZV0uZm9yRWFjaChydW4gPT4ge1xuICAgICAgcmVzdWx0ID0gcnVuKGQuY29udGVudCwgcmVzdWx0LCBwYXNzYWdlLCBwYXNzYWdlLnN0b3J5KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gaWYgbm8gc3BlYWtlciB0YWcsIHJldHVybiBhbiBlbXB0eSByZW5kZXIgc2V0XG4gIGlmICghcGFzc2FnZS5nZXRTcGVha2VyKCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlyZWN0aXZlcyxcbiAgICAgIHRleHQ6IFtdLFxuICAgIH07XG4gIH1cblxuICAvLyBpZiBwcm9tcHQgdGFnIGlzIHNldCwgbm90aWZ5IHRoZSBzdG9yeVxuICBpZiAocGFzc2FnZSkge1xuICAgIGNvbnN0IHByb21wdHMgPSBwYXNzYWdlLnByZWZpeFRhZyhcInByb21wdFwiKTtcbiAgICBpZiAocHJvbXB0cy5sZW5ndGgpIHtcbiAgICAgIHBhc3NhZ2Uuc3RvcnkucHJvbXB0KHByb21wdHNbMF0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwYXNzYWdlLmhhc1RhZyhcIm9uZWxpbmVcIikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlyZWN0aXZlcyxcbiAgICAgIHRleHQ6IFtyZXN1bHRdLFxuICAgIH07XG4gIH1cblxuICAvLyBpZiB0aGlzIGlzIGEgbXVsdGlsaW5lIGl0ZW0sIHRyaW0sIHNwbGl0LCBhbmQgbWFyayBlYWNoIGl0ZW1cbiAgLy8gcmV0dXJuIHRoZSBhcnJheVxuICByZXN1bHQgPSByZXN1bHQudHJpbSgpO1xuICByZXR1cm4ge1xuICAgIGRpcmVjdGl2ZXMsXG4gICAgdGV4dDogcmVzdWx0LnNwbGl0KC9bXFxyXFxuXSsvZyksXG4gIH07XG59O1xuXG5jbGFzcyBQYXNzYWdlIHtcbiAgaWQgPSBudWxsO1xuICBuYW1lID0gbnVsbDtcbiAgdGFncyA9IG51bGw7XG4gIHRhZ0RpY3QgPSB7fTtcbiAgc291cmNlID0gbnVsbDtcbiAgbGlua3MgPSBbXTtcblxuICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgdGFncywgc291cmNlLCBzdG9yeSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudGFncyA9IHRhZ3M7XG4gICAgdGhpcy5zb3VyY2UgPSB1bmVzY2FwZShzb3VyY2UpO1xuICAgIHRoaXMuc3RvcnkgPSBzdG9yeTtcblxuICAgIHRoaXMudGFncy5mb3JFYWNoKHQgPT4gKHRoaXMudGFnRGljdFt0XSA9IDEpKTtcbiAgfVxuXG4gIGdldFNwZWFrZXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYWtlclRhZyA9IHRoaXMudGFncy5maW5kKHQgPT4gdC5pbmRleE9mKFwic3BlYWtlci1cIikgPT09IDApIHx8IFwiXCI7XG4gICAgaWYgKHNwZWFrZXJUYWcpIHJldHVybiBzcGVha2VyVGFnLnJlcGxhY2UoL15zcGVha2VyLS8sIFwiXCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIHByZWZpeFRhZyA9IChwZngsIGFzRGljdCkgPT5cbiAgICB0aGlzLnRhZ3NcbiAgICAgIC5maWx0ZXIodCA9PiB0LmluZGV4T2YoYCR7cGZ4fS1gKSA9PT0gMClcbiAgICAgIC5tYXAodCA9PiB0LnJlcGxhY2UoYCR7cGZ4fS1gLCBcIlwiKSlcbiAgICAgIC5yZWR1Y2UoXG4gICAgICAgIChhLCB0KSA9PiB7XG4gICAgICAgICAgaWYgKGFzRGljdClcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmEsXG4gICAgICAgICAgICAgIFt0XTogMSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gWy4uLmEsIHRdO1xuICAgICAgICB9LFxuICAgICAgICBhc0RpY3QgPyB7fSA6IFtdXG4gICAgICApO1xuXG4gIGhhc1RhZyA9IHQgPT4gdGhpcy50YWdEaWN0W3RdO1xuXG4gIC8vIHN0YXRpYyBhbmQgaW5zdGFuY2UgcmVuZGVyc1xuICBzdGF0aWMgcmVuZGVyID0gc3RyID0+XG4gICAgcmVuZGVyUGFzc2FnZShcbiAgICAgIG5ldyBQYXNzYWdlKG51bGwsIG51bGwsIG51bGwsIHN0ciwgZmluZFN0b3J5KHdpbmRvdyB8fCBudWxsKSlcbiAgICApO1xuICByZW5kZXIgPSAoKSA9PiByZW5kZXJQYXNzYWdlKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQYXNzYWdlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyBhbmQgSFRNTCBjaGFyYWN0ZXJzLiAqL1xudmFyIHJlVW5lc2NhcGVkSHRtbCA9IC9bJjw+XCInYF0vZyxcbiAgICByZUhhc1VuZXNjYXBlZEh0bWwgPSBSZWdFeHAocmVVbmVzY2FwZWRIdG1sLnNvdXJjZSk7XG5cbi8qKiBVc2VkIHRvIG1hcCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuICovXG52YXIgaHRtbEVzY2FwZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmIzM5OycsXG4gICdgJzogJyYjOTY7J1xufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eU9mKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCBieSBgXy5lc2NhcGVgIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAqL1xudmFyIGVzY2FwZUh0bWxDaGFyID0gYmFzZVByb3BlcnR5T2YoaHRtbEVzY2FwZXMpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGNoYXJhY3RlcnMgXCImXCIsIFwiPFwiLCBcIj5cIiwgJ1wiJywgXCInXCIsIGFuZCBcIlxcYFwiIGluIGBzdHJpbmdgIHRvXG4gKiB0aGVpciBjb3JyZXNwb25kaW5nIEhUTUwgZW50aXRpZXMuXG4gKlxuICogKipOb3RlOioqIE5vIG90aGVyIGNoYXJhY3RlcnMgYXJlIGVzY2FwZWQuIFRvIGVzY2FwZSBhZGRpdGlvbmFsXG4gKiBjaGFyYWN0ZXJzIHVzZSBhIHRoaXJkLXBhcnR5IGxpYnJhcnkgbGlrZSBbX2hlX10oaHR0cHM6Ly9tdGhzLmJlL2hlKS5cbiAqXG4gKiBUaG91Z2ggdGhlIFwiPlwiIGNoYXJhY3RlciBpcyBlc2NhcGVkIGZvciBzeW1tZXRyeSwgY2hhcmFjdGVycyBsaWtlXG4gKiBcIj5cIiBhbmQgXCIvXCIgZG9uJ3QgbmVlZCBlc2NhcGluZyBpbiBIVE1MIGFuZCBoYXZlIG5vIHNwZWNpYWwgbWVhbmluZ1xuICogdW5sZXNzIHRoZXkncmUgcGFydCBvZiBhIHRhZyBvciB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuIFNlZVxuICogW01hdGhpYXMgQnluZW5zJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2FtYmlndW91cy1hbXBlcnNhbmRzKVxuICogKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQmFja3RpY2tzIGFyZSBlc2NhcGVkIGJlY2F1c2UgaW4gSUUgPCA5LCB0aGV5IGNhbiBicmVhayBvdXQgb2ZcbiAqIGF0dHJpYnV0ZSB2YWx1ZXMgb3IgSFRNTCBjb21tZW50cy4gU2VlIFsjNTldKGh0dHBzOi8vaHRtbDVzZWMub3JnLyM1OSksXG4gKiBbIzEwMl0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwMiksIFsjMTA4XShodHRwczovL2h0bWw1c2VjLm9yZy8jMTA4KSwgYW5kXG4gKiBbIzEzM10oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEzMykgb2YgdGhlXG4gKiBbSFRNTDUgU2VjdXJpdHkgQ2hlYXRzaGVldF0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvKSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFdoZW4gd29ya2luZyB3aXRoIEhUTUwgeW91IHNob3VsZCBhbHdheXNcbiAqIFtxdW90ZSBhdHRyaWJ1dGUgdmFsdWVzXShodHRwOi8vd29ua28uY29tL3Bvc3QvaHRtbC1lc2NhcGluZykgdG8gcmVkdWNlXG4gKiBYU1MgdmVjdG9ycy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGUoJ2ZyZWQsIGJhcm5leSwgJiBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiBlc2NhcGUoc3RyaW5nKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzVW5lc2NhcGVkSHRtbC50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVVuZXNjYXBlZEh0bWwsIGVzY2FwZUh0bWxDaGFyKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZTtcbiIsImltcG9ydCBQYXNzYWdlIGZyb20gXCIuL1Bhc3NhZ2VcIjtcbmltcG9ydCBlc2NhcGUgZnJvbSBcImxvZGFzaC5lc2NhcGVcIjtcbmltcG9ydCB1bmVzY2FwZSBmcm9tIFwibG9kYXNoLnVuZXNjYXBlXCI7XG5cbmNvbnN0IHNlbGVjdFBhc3NhZ2VzID0gXCJ0dy1wYXNzYWdlZGF0YVwiO1xuY29uc3Qgc2VsZWN0Q3NzID0gJypbdHlwZT1cInRleHQvdHdpbmUtY3NzXCJdJztcbmNvbnN0IHNlbGVjdEpzID0gJypbdHlwZT1cInRleHQvdHdpbmUtamF2YXNjcmlwdFwiXSc7XG5jb25zdCBzZWxlY3RBY3RpdmVMaW5rID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbCBhW2RhdGEtcGFzc2FnZV1cIjtcbmNvbnN0IHNlbGVjdEFjdGl2ZUJ1dHRvbiA9IFwiI3VzZXItcmVzcG9uc2UtcGFuZWwgYnV0dG9uW2RhdGEtcGFzc2FnZV1cIjtcbmNvbnN0IHNlbGVjdEFjdGl2ZUlucHV0ID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbCBpbnB1dFwiO1xuY29uc3Qgc2VsZWN0QWN0aXZlID0gXCIuY2hhdC1wYW5lbCAuYWN0aXZlXCI7XG5jb25zdCBzZWxlY3RIaXN0b3J5ID0gXCIuY2hhdC1wYW5lbCAuaGlzdG9yeVwiO1xuY29uc3Qgc2VsZWN0UmVzcG9uc2VzID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbFwiO1xuY29uc3QgdHlwaW5nSW5kaWNhdG9yID0gXCIjYW5pbWF0aW9uLWNvbnRhaW5lclwiO1xuXG5jb25zdCBJU19OVU1FUklDID0gL15bXFxkXSskLztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBwcm92aWRlZCBzdHJpbmcgY29udGFpbnMgb25seSBudW1iZXJzXG4gKiBJbiB0aGUgY2FzZSBvZiBgcGlkYCB2YWx1ZXMgZm9yIHBhc3NhZ2VzLCB0aGlzIGlzIHRydWVcbiAqL1xuY29uc3QgaXNOdW1lcmljID0gZCA9PiBJU19OVU1FUklDLnRlc3QoZCk7XG5cbi8qKlxuICogRm9ybWF0IGEgdXNlciBwYXNzYWdlIChzdWNoIGFzIGEgcmVzcG9uc2UpXG4gKi9cbmNvbnN0IFVTRVJfUEFTU0FHRV9UTVBMID0gKHsgaWQsIHRleHQgfSkgPT4gYFxuICA8ZGl2IGNsYXNzPVwiY2hhdC1wYXNzYWdlLXJlc2V0XCI+XG4gICAgPGRpdiBjbGFzcz1cImNoYXQtcGFzc2FnZS13cmFwcGVyXCIgZGF0YS1zcGVha2VyPVwieW91XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2hhdC1wYXNzYWdlIHBoaXN0b3J5XCIgZGF0YS1zcGVha2VyPVwieW91XCIgZGF0YS11cGFzc2FnZT1cIiR7aWR9XCI+XG4gICAgICAgICR7dGV4dH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbi8qKlxuICogRm9ybWF0IGEgbWVzc2FnZSBmcm9tIGEgbm9uLXVzZXJcbiAqL1xuY29uc3QgT1RIRVJfUEFTU0FHRV9UTVBMID0gKHsgc3BlYWtlciwgdGFncywgdGV4dCB9KSA9PiBgXG4gIDxkaXYgY2xhc3M9XCJjaGF0LXBhc3NhZ2UtcmVzZXRcIj5cbiAgICA8ZGl2IGRhdGEtc3BlYWtlcj1cIiR7c3BlYWtlcn1cIiBjbGFzcz1cImNoYXQtcGFzc2FnZS13cmFwcGVyICR7dGFncy5qb2luKFxuICBcIiBcIlxuKX1cIj5cbiAgICAgIDxkaXYgZGF0YS1zcGVha2VyPVwiJHtzcGVha2VyfVwiIGNsYXNzPVwiY2hhdC1wYXNzYWdlXCI+XG4gICAgICAgICR7dGV4dH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbmNvbnN0IERJUkVDVElWRVNfVE1QTCA9IGRpcmVjdGl2ZXMgPT4gYFxuICA8ZGl2IGNsYXNzPVwiZGlyZWN0aXZlc1wiPlxuICAgICR7ZGlyZWN0aXZlc1xuICAgICAgLm1hcChcbiAgICAgICAgKHsgbmFtZSwgY29udGVudCB9KSA9PlxuICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiZGlyZWN0aXZlXCIgbmFtZT1cIiR7bmFtZX1cIj4ke2NvbnRlbnQudHJpbSgpfTwvZGl2PmBcbiAgICAgIClcbiAgICAgIC5qb2luKFwiXCIpfVxuICA8L2Rpdj5cbmA7XG5cbi8qKlxuICogRm9yY2VzIGEgZGVsYXkgdmlhIHByb21pc2VzIGluIG9yZGVyIHRvIHNwcmVhZCBvdXQgbWVzc2FnZXNcbiAqL1xuY29uc3QgZGVsYXkgPSBhc3luYyAodCA9IDApID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0KSk7XG5cbi8vIEZpbmQgb25lL21hbnkgbm9kZXMgd2l0aGluIGEgY29udGV4dC4gV2UgWy4uLmZpbmRBbGxdIHRvIGVuc3VyZSB3ZSdyZSBjYXN0IGFzIGFuIGFycmF5XG4vLyBub3QgYXMgYSBub2RlIGxpc3RcbmNvbnN0IGZpbmQgPSAoY3R4LCBzKSA9PiBjdHgucXVlcnlTZWxlY3RvcihzKTtcbmNvbnN0IGZpbmRBbGwgPSAoY3R4LCBzKSA9PiBbLi4uY3R4LnF1ZXJ5U2VsZWN0b3JBbGwocyldIHx8IFtdO1xuXG4vKipcbiAqIFN0YW5kYXJkIFR3aW5lIEZvcm1hdCBTdG9yeSBPYmplY3RcbiAqL1xuY2xhc3MgU3Rvcnkge1xuICB2ZXJzaW9uID0gMjsgLy8gVHdpbmUgdjJcblxuICBkb2N1bWVudCA9IG51bGw7XG4gIHN0b3J5ID0gbnVsbDtcbiAgbmFtZSA9IFwiXCI7XG4gIHN0YXJ0c0F0ID0gMDtcbiAgY3VycmVudCA9IDA7XG4gIGhpc3RvcnkgPSBbXTtcbiAgcGFzc2FnZXMgPSB7fTtcbiAgc2hvd1Byb21wdCA9IGZhbHNlO1xuICBlcnJvck1lc3NhZ2UgPSBcIlxcdTI2YTAgJXNcIjtcblxuICBkaXJlY3RpdmVzID0ge307XG4gIGVsZW1lbnRzID0ge307XG5cbiAgdXNlclNjcmlwdHMgPSBbXTtcbiAgdXNlclN0eWxlcyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHdpbiwgc3JjKSB7XG4gICAgdGhpcy53aW5kb3cgPSB3aW47XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KFxuICAgICAgICBcIkJvdHNjcmlwdGVuIEluamVjdGVkIENvbnRlbnRcIlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIH1cblxuICAgIHRoaXMuc3RvcnkgPSBmaW5kKHRoaXMuZG9jdW1lbnQsIFwidHctc3RvcnlkYXRhXCIpO1xuXG4gICAgLy8gZWxlbWVudHNcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xuICAgICAgYWN0aXZlOiBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdEFjdGl2ZSksXG4gICAgICBoaXN0b3J5OiBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdEhpc3RvcnkpLFxuICAgIH07XG5cbiAgICAvLyBwcm9wZXJ0aWVzIG9mIHN0b3J5IG5vZGVcbiAgICB0aGlzLm5hbWUgPSB0aGlzLnN0b3J5LmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgXCJcIjtcbiAgICB0aGlzLnN0YXJ0c0F0ID0gdGhpcy5zdG9yeS5nZXRBdHRyaWJ1dGUoXCJzdGFydG5vZGVcIikgfHwgMDtcblxuICAgIGZpbmRBbGwodGhpcy5zdG9yeSwgc2VsZWN0UGFzc2FnZXMpLmZvckVhY2gocCA9PiB7XG4gICAgICBjb25zdCBpZCA9IHBhcnNlSW50KHAuZ2V0QXR0cmlidXRlKFwicGlkXCIpKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBwLmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgICBjb25zdCB0YWdzID0gKHAuZ2V0QXR0cmlidXRlKFwidGFnc1wiKSB8fCBcIlwiKS5zcGxpdCgvXFxzKy9nKTtcbiAgICAgIGNvbnN0IHBhc3NhZ2UgPSBwLmlubmVySFRNTCB8fCBcIlwiO1xuXG4gICAgICB0aGlzLnBhc3NhZ2VzW2lkXSA9IG5ldyBQYXNzYWdlKGlkLCBuYW1lLCB0YWdzLCBwYXNzYWdlLCB0aGlzKTtcbiAgICB9KTtcblxuICAgIGZpbmQodGhpcy5kb2N1bWVudCwgXCJ0aXRsZVwiKS5pbm5lckhUTUwgPSB0aGlzLm5hbWU7XG5cbiAgICB0aGlzLnVzZXJTY3JpcHRzID0gKGZpbmRBbGwodGhpcy5kb2N1bWVudCwgc2VsZWN0SnMpIHx8IFtdKS5tYXAoXG4gICAgICBlbCA9PiBlbC5pbm5lckhUTUxcbiAgICApO1xuICAgIHRoaXMudXNlclN0eWxlcyA9IChmaW5kQWxsKHRoaXMuZG9jdW1lbnQsIHNlbGVjdENzcykgfHwgW10pLm1hcChcbiAgICAgIGVsID0+IGVsLmlubmVySFRNTFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBzdG9yeSBieSBzZXR0aW5nIHVwIGxpc3RlbmVycyBhbmQgdGhlbiBhZHZhbmNpbmdcbiAgICogdG8gdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHN0YWNrXG4gICAqL1xuICBzdGFydCA9ICgpID0+IHtcbiAgICAvLyBhY3RpdmF0ZSB1c2Vyc2NyaXB0cyBhbmQgc3R5bGVzXG4gICAgdGhpcy51c2VyU3R5bGVzLmZvckVhY2gocyA9PiB7XG4gICAgICBjb25zdCB0ID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICB0LmlubmVySFRNTCA9IHM7XG4gICAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodCk7XG4gICAgfSk7XG4gICAgdGhpcy51c2VyU2NyaXB0cy5mb3JFYWNoKHMgPT4ge1xuICAgICAgLy8gZXZhbCBpcyBldmlsLCBidXQgdGhpcyBpcyBzaW1wbHkgaG93IFR3aW5lIHdvcmtzXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICBnbG9iYWxFdmFsKHMpO1xuICAgIH0pO1xuXG4gICAgLy8gd2hlbiB5b3UgY2xpY2sgb24gYVtkYXRhLXBhc3NhZ2VdIChyZXNwb25zZSBsaW5rKS4uLlxuICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0Lm1hdGNoZXMoc2VsZWN0QWN0aXZlTGluaykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFkdmFuY2UoXG4gICAgICAgIHRoaXMuZmluZFBhc3NhZ2UoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXNzYWdlXCIpKSxcbiAgICAgICAgZS50YXJnZXQuaW5uZXJIVE1MXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gd2hlbiB5b3UgY2xpY2sgb24gYnV0dG9uW2RhdGEtcGFzc2FnZV0gKHJlc3BvbnNlIGlucHV0KS4uLlxuICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0Lm1hdGNoZXMoc2VsZWN0QWN0aXZlQnV0dG9uKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGNhcHR1cmUgYW5kIGRpc2FibGUgc2hvd1Byb21wdCBmZWF0dXJlXG4gICAgICBjb25zdCB2YWx1ZSA9IGZpbmQodGhpcy5kb2N1bWVudCwgc2VsZWN0QWN0aXZlSW5wdXQpLnZhbHVlO1xuICAgICAgdGhpcy5zaG93UHJvbXB0ID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuYWR2YW5jZShcbiAgICAgICAgdGhpcy5maW5kUGFzc2FnZShlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhc3NhZ2VcIikpLFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWR2YW5jZSh0aGlzLmZpbmRQYXNzYWdlKHRoaXMuc3RhcnRzQXQpKTtcbiAgfTtcblxuICAvKipcbiAgICogRmluZCBhIHBhc3NhZ2UgYmFzZWQgb24gaXRzIGlkIG9yIG5hbWVcbiAgICovXG4gIGZpbmRQYXNzYWdlID0gaWRPck5hbWUgPT4ge1xuICAgIGlkT3JOYW1lID0gYCR7aWRPck5hbWV9YC50cmltKCk7XG4gICAgaWYgKGlzTnVtZXJpYyhpZE9yTmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhc3NhZ2VzW2lkT3JOYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaGFuZGxlIHBhc3NhZ2VzIHdpdGggJyBhbmQgXCIgKGNhbid0IHVzZSBhIGNzcyBzZWxlY3RvciBjb25zaXN0ZW50bHkpXG4gICAgICBjb25zdCBwID0gZmluZEFsbCh0aGlzLnN0b3J5LCBcInR3LXBhc3NhZ2VkYXRhXCIpLmZpbHRlcihcbiAgICAgICAgcCA9PiB1bmVzY2FwZShwLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpLnRyaW0oKSA9PT0gaWRPck5hbWVcbiAgICAgIClbMF07XG4gICAgICBpZiAoIXApIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMucGFzc2FnZXNbcC5nZXRBdHRyaWJ1dGUoXCJwaWRcIildO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQWR2YW5jZSB0aGUgc3RvcnkgdG8gdGhlIHBhc3NhZ2Ugc3BlY2lmaWVkLCBvcHRpb25hbGx5IGFkZGluZyB1c2VyVGV4dFxuICAgKi9cbiAgYWR2YW5jZSA9IGFzeW5jIChwYXNzYWdlLCB1c2VyVGV4dCA9IG51bGwpID0+IHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaChwYXNzYWdlLmlkKTtcbiAgICBjb25zdCBsYXN0ID0gdGhpcy5jdXJyZW50O1xuXG4gICAgLy8gLmFjdGl2ZSBpcyBjYXB0dXJlZCAmIGNsZWFyZWRcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuZWxlbWVudHMuYWN0aXZlLmlubmVySFRNTDtcbiAgICB0aGlzLmVsZW1lbnRzLmFjdGl2ZS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgLy8gd2hhdGV2ZXIgd2FzIGluIGFjdGl2ZSBpcyBtb3ZlZCB1cCBpbnRvIGhpc3RvcnlcbiAgICB0aGlzLmVsZW1lbnRzLmhpc3RvcnkuaW5uZXJIVE1MICs9IGV4aXN0aW5nO1xuXG4gICAgLy8gaWYgdGhlcmUgaXMgdXNlclRleHQsIGl0IGlzIGFkZGVkIHRvIC5oaXN0b3J5XG4gICAgaWYgKHVzZXJUZXh0KSB7XG4gICAgICB0aGlzLnJlbmRlclVzZXJNZXNzYWdlKFxuICAgICAgICBsYXN0LFxuICAgICAgICB1c2VyVGV4dCxcbiAgICAgICAgcyA9PiAodGhpcy5lbGVtZW50cy5oaXN0b3J5LmlubmVySFRNTCArPSBzKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgbmV3IHBhc3NhZ2UgaXMgcmVuZGVyZWQgYW5kIHBsYWNlZCBpbiAuYWN0aXZlXG4gICAgLy8gYWZ0ZXIgYWxsIHJlbmRlcnMsIHVzZXIgb3B0aW9ucyBhcmUgZGlzcGxheWVkXG4gICAgYXdhaXQgdGhpcy5yZW5kZXJQYXNzYWdlKFxuICAgICAgcGFzc2FnZSxcbiAgICAgIHMgPT4gKHRoaXMuZWxlbWVudHMuYWN0aXZlLmlubmVySFRNTCArPSBzKVxuICAgICk7XG5cbiAgICBpZiAoIXBhc3NhZ2UuaGFzVGFnKFwid2FpdFwiKSAmJiBwYXNzYWdlLmxpbmtzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gYXV0byBhZHZhbmNlIGlmIHRoZSB3YWl0IHRhZyBpcyBub3Qgc2V0IGFuZCB0aGVyZSBpcyBleGFjdGx5XG4gICAgICAvLyAxIGxpbmsgZm91bmQgaW4gb3VyIHBzc2FnZS5cbiAgICAgIHRoaXMuYWR2YW5jZSh0aGlzLmZpbmRQYXNzYWdlKHBhc3NhZ2UubGlua3NbMF0udGFyZ2V0KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJDaG9pY2VzKHBhc3NhZ2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGV4dCBhcyBpZiBpdCBjYW1lIGZyb20gdGhlIHVzZXJcbiAgICovXG4gIHJlbmRlclVzZXJNZXNzYWdlID0gYXN5bmMgKHBpZCwgdGV4dCwgcmVuZGVyZXIpID0+IHtcbiAgICBhd2FpdCByZW5kZXJlcihcbiAgICAgIFVTRVJfUEFTU0FHRV9UTVBMKHtcbiAgICAgICAgaWQ6IHBpZCxcbiAgICAgICAgdGV4dCxcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgYSBUd2luZSBwYXNzYWdlIG9iamVjdFxuICAgKi9cbiAgcmVuZGVyUGFzc2FnZSA9IGFzeW5jIChwYXNzYWdlLCByZW5kZXJlcikgPT4ge1xuICAgIGNvbnN0IHNwZWFrZXIgPSBwYXNzYWdlLmdldFNwZWFrZXIoKTtcbiAgICBsZXQgc3RhdGVtZW50cyA9IHBhc3NhZ2UucmVuZGVyKCk7XG4gICAgY29uc29sZS5sb2coc3RhdGVtZW50cy5kaXJlY3RpdmVzKTtcblxuICAgIGF3YWl0IHJlbmRlcmVyKERJUkVDVElWRVNfVE1QTChzdGF0ZW1lbnRzLmRpcmVjdGl2ZXMpKTtcblxuICAgIGxldCBuZXh0ID0gc3RhdGVtZW50cy50ZXh0LnNoaWZ0KCk7XG4gICAgdGhpcy5zaG93VHlwaW5nKCk7XG4gICAgd2hpbGUgKG5leHQpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBPVEhFUl9QQVNTQUdFX1RNUEwoe1xuICAgICAgICBzcGVha2VyLFxuICAgICAgICB0YWdzOiBwYXNzYWdlLnRhZ3MsXG4gICAgICAgIHRleHQ6IG5leHQsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IGRlbGF5KHRoaXMuY2FsY3VsYXRlRGVsYXkobmV4dCkpOyAvLyB0b2RvXG4gICAgICBhd2FpdCByZW5kZXJlcihjb250ZW50KTtcbiAgICAgIG5leHQgPSBzdGF0ZW1lbnRzLnRleHQuc2hpZnQoKTtcbiAgICB9XG4gICAgdGhpcy5oaWRlVHlwaW5nKCk7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIHJvdWdoIGZ1bmN0aW9uIGZvciBkZXRlcm1pbmluZyBhIHdhaXRpbmcgcGVyaW9kIGJhc2VkIG9uIHN0cmluZyBsZW5ndGhcbiAgICovXG4gIGNhbGN1bGF0ZURlbGF5ID0gdHh0ID0+IHtcbiAgICBjb25zdCB0eXBpbmdEZWxheVJhdGlvID0gMC4zO1xuICAgIGNvbnN0IHJhdGUgPSAyMDsgLy8gbXNcbiAgICByZXR1cm4gdHh0Lmxlbmd0aCAqIHJhdGUgKiB0eXBpbmdEZWxheVJhdGlvO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93cyB0aGUgdHlwaW5nIGluZGljYXRvclxuICAgKi9cbiAgc2hvd1R5cGluZyA9ICgpID0+IHtcbiAgICBmaW5kKHRoaXMuZG9jdW1lbnQsIHR5cGluZ0luZGljYXRvcikuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgdHlwaW5nIGluZGljYXRvclxuICAgKi9cbiAgaGlkZVR5cGluZyA9ICgpID0+IHtcbiAgICBmaW5kKHRoaXMuZG9jdW1lbnQsIHR5cGluZ0luZGljYXRvcikuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdGhlIGRvY3VtZW50IGFzIGZhciBhcyBwb3NzaWJsZSAoYmFzZWQgb24gaGlzdG9yeSBjb250YWluZXIncyBoZWlnaHQpXG4gICAqL1xuICBzY3JvbGxUb0JvdHRvbSA9ICgpID0+IHtcbiAgICBjb25zdCBoaXN0ID0gZmluZCh0aGlzLmRvY3VtZW50LCBcIiNwaGlzdG9yeVwiKTtcbiAgICBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50LnNjcm9sbFRvcCA9IGhpc3Qub2Zmc2V0SGVpZ2h0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGNob2ljZXMgcGFuZWxcbiAgICovXG4gIHJlbW92ZUNob2ljZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgcGFuZWwgPSBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdFJlc3BvbnNlcyk7XG4gICAgcGFuZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgfTtcblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgY2hvaWNlcyBwYW5lbCB3aXRoIGEgc2V0IG9mIG9wdGlvbnMgYmFzZWQgb24gcGFzc2FnZSBsaW5rc1xuICAgKi9cbiAgcmVuZGVyQ2hvaWNlcyA9IHBhc3NhZ2UgPT4ge1xuICAgIHRoaXMucmVtb3ZlQ2hvaWNlcygpO1xuICAgIGNvbnN0IHBhbmVsID0gZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RSZXNwb25zZXMpO1xuICAgIHBhc3NhZ2UubGlua3MuZm9yRWFjaChsID0+IHtcbiAgICAgIHBhbmVsLmlubmVySFRNTCArPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGNsYXNzPVwidXNlci1yZXNwb25zZVwiIGRhdGEtcGFzc2FnZT1cIiR7ZXNjYXBlKFxuICAgICAgICBsLnRhcmdldFxuICAgICAgKX1cIj4ke2wuZGlzcGxheX08L2E+YDtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY3VzdG9tIGRpcmVjdGl2ZSBmb3IgdGhpcyBzdG9yeVxuICAgKiBTaWduYXR1cmUgb2YgKGRpcmVjdGl2ZUNvbnRlbnQsIG91dHB1dFRleHQsIHN0b3J5LCBwYXNzYWdlLCBuZXh0KVxuICAgKi9cbiAgZGlyZWN0aXZlID0gKGlkLCBjYikgPT4ge1xuICAgIGlmICghdGhpcy5kaXJlY3RpdmVzW2lkXSkge1xuICAgICAgdGhpcy5kaXJlY3RpdmVzW2lkXSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmRpcmVjdGl2ZXNbaWRdLnB1c2goY2IpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBTdG9yeTtcbiIsImltcG9ydCBTdG9yeSBmcm9tIFwiLi9TdG9yeVwiO1xuXG4od2luID0+IHtcbiAgaWYgKHR5cGVvZiB3aW4gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW4uZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHdpbi5nbG9iYWxFdmFsID0gZXZhbDtcbiAgICAgIHdpbi5zdG9yeSA9IG5ldyBTdG9yeSh3aW4pO1xuICAgICAgd2luLnN0b3J5LnN0YXJ0KCk7XG4gICAgICBpZiAod2luLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2hvd19kaXJlY3RpdmVzXCIpLmNoZWNrZWQpIHtcbiAgICAgICAgd2luLmRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInNob3ctZGlyZWN0aXZlc1wiKTtcbiAgICAgIH1cbiAgICAgIGlmICh3aW4uZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9vZmluZ1wiKS5jaGVja2VkKSB7XG4gICAgICAgIHdpbi5kb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJwcm9vZlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbi5kb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJydW5cIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW4uZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI3Nob3dfZGlyZWN0aXZlc1wiKVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZSA9PiB7XG4gICAgICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgd2luLmRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcInNob3ctZGlyZWN0aXZlc1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwic2hvdy1kaXJlY3RpdmVzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHdpbi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb29maW5nXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicHJvb2ZcIik7XG4gICAgICAgIHdpbi5kb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJydW5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwicnVuXCIpO1xuICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwicHJvb2ZcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwidHctcGFzc2FnZWRhdGFbcGlkPSdcIiArXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInR3LXN0b3J5ZGF0YVwiKS5nZXRBdHRyaWJ1dGUoXCJzdGFydG5vZGVcIikgK1xuICAgICAgICAgIFwiJ11cIlxuICAgICAgKVxuICAgICAgLmNsYXNzTGlzdC5hZGQoXCJzdGFydFwiKTtcbiAgfVxufSkod2luZG93IHx8IHVuZGVmaW5lZCk7XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIiwicmVxdWlyZSQkMCIsImdsb2JhbCIsIlN5bWJvbCIsIlRPS0VOX0VTQ0FQRURfT0NUTyIsIkJMT0NLX0RJUkVDVElWRSIsIklOTElORV9ESVJFQ1RJVkUiLCJleHRyYWN0RGlyZWN0aXZlcyIsInMiLCJkaXJlY3RpdmVzIiwicmVwbGFjZSIsIm1hdGNoIiwiZGlyIiwiY29udGVudCIsInB1c2giLCJuYW1lIiwidHJpbSIsIkxJTktfUEFUVEVSTiIsImV4dHJhY3RMaW5rcyIsInN0ciIsImxpbmtzIiwib3JpZ2luYWwiLCJ0IiwiZGlzcGxheSIsInRhcmdldCIsImJhckluZGV4IiwiaW5kZXhPZiIsInJpZ2h0QXJySW5kZXgiLCJsZWZ0QXJySW5kZXgiLCJzdWJzdHIiLCJ1cGRhdGVkIiwiQkxPQ0tfQ09NTUVOVCIsIklOTElORV9DT01NRU5UIiwic3RyaXBDb21tZW50cyIsImZpbmRTdG9yeSIsIndpbiIsInN0b3J5Iiwic3RhdGUiLCJyZW5kZXJQYXNzYWdlIiwicGFzc2FnZSIsInNvdXJjZSIsInJlc3VsdCIsImxpbmtEYXRhIiwiZm9yRWFjaCIsImQiLCJydW4iLCJnZXRTcGVha2VyIiwidGV4dCIsInByb21wdHMiLCJwcmVmaXhUYWciLCJsZW5ndGgiLCJwcm9tcHQiLCJoYXNUYWciLCJzcGxpdCIsIlBhc3NhZ2UiLCJpZCIsInRhZ3MiLCJzcGVha2VyVGFnIiwiZmluZCIsInBmeCIsImFzRGljdCIsImZpbHRlciIsIm1hcCIsInJlZHVjZSIsImEiLCJ0YWdEaWN0IiwidW5lc2NhcGUiLCJ3aW5kb3ciLCJJTkZJTklUWSIsInN5bWJvbFRhZyIsImZyZWVHbG9iYWwiLCJmcmVlU2VsZiIsInJvb3QiLCJiYXNlUHJvcGVydHlPZiIsIm9iamVjdFByb3RvIiwib2JqZWN0VG9TdHJpbmciLCJzeW1ib2xQcm90byIsInN5bWJvbFRvU3RyaW5nIiwiYmFzZVRvU3RyaW5nIiwiaXNTeW1ib2wiLCJpc09iamVjdExpa2UiLCJ0b1N0cmluZyIsInNlbGVjdFBhc3NhZ2VzIiwic2VsZWN0Q3NzIiwic2VsZWN0SnMiLCJzZWxlY3RBY3RpdmVMaW5rIiwic2VsZWN0QWN0aXZlQnV0dG9uIiwic2VsZWN0QWN0aXZlSW5wdXQiLCJzZWxlY3RBY3RpdmUiLCJzZWxlY3RIaXN0b3J5Iiwic2VsZWN0UmVzcG9uc2VzIiwidHlwaW5nSW5kaWNhdG9yIiwiSVNfTlVNRVJJQyIsImlzTnVtZXJpYyIsInRlc3QiLCJVU0VSX1BBU1NBR0VfVE1QTCIsIk9USEVSX1BBU1NBR0VfVE1QTCIsInNwZWFrZXIiLCJqb2luIiwiRElSRUNUSVZFU19UTVBMIiwiZGVsYXkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJjdHgiLCJxdWVyeVNlbGVjdG9yIiwiZmluZEFsbCIsIl90b0NvbnN1bWFibGVBcnJheSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJTdG9yeSIsInNyYyIsInVzZXJTdHlsZXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJ1c2VyU2NyaXB0cyIsImdsb2JhbEV2YWwiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIm1hdGNoZXMiLCJhZHZhbmNlIiwiZmluZFBhc3NhZ2UiLCJnZXRBdHRyaWJ1dGUiLCJ2YWx1ZSIsInNob3dQcm9tcHQiLCJzdGFydHNBdCIsImlkT3JOYW1lIiwicGFzc2FnZXMiLCJwIiwidXNlclRleHQiLCJoaXN0b3J5IiwibGFzdCIsImN1cnJlbnQiLCJleGlzdGluZyIsImVsZW1lbnRzIiwiYWN0aXZlIiwicmVuZGVyVXNlck1lc3NhZ2UiLCJyZW5kZXJDaG9pY2VzIiwicGlkIiwicmVuZGVyZXIiLCJzY3JvbGxUb0JvdHRvbSIsInN0YXRlbWVudHMiLCJyZW5kZXIiLCJjb25zb2xlIiwibG9nIiwibmV4dCIsInNoaWZ0Iiwic2hvd1R5cGluZyIsImNhbGN1bGF0ZURlbGF5IiwiaGlkZVR5cGluZyIsInR4dCIsInR5cGluZ0RlbGF5UmF0aW8iLCJyYXRlIiwic3R5bGUiLCJ2aXNpYmlsaXR5IiwiaGlzdCIsInNjcm9sbGluZ0VsZW1lbnQiLCJzY3JvbGxUb3AiLCJvZmZzZXRIZWlnaHQiLCJwYW5lbCIsInJlbW92ZUNob2ljZXMiLCJsIiwiZXNjYXBlIiwiY2IiLCJpbXBsZW1lbnRhdGlvbiIsImNyZWF0ZUhUTUxEb2N1bWVudCIsInBhcnNlSW50IiwiZWwiLCJldmVudCIsImV2YWwiLCJzdGFydCIsImNoZWNrZWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7O0VBQUEsU0FBUyxlQUFlLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTtJQUM5QyxJQUFJLEVBQUUsUUFBUSxZQUFZLFdBQVcsQ0FBQyxFQUFFO01BQ3RDLE1BQU0sSUFBSSxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUMxRDtHQUNGOztFQUVELGtCQUFjLEdBQUcsZUFBZTs7RUNOaEMsU0FBUyxl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
