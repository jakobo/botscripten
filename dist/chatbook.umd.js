(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

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

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var TOKEN_ESCAPED_OCTO = "__TOKEN_ESCAPED_BACKSLASH_OCTO__";
  var BLOCK_DIRECTIVE = /^###@([\S]+)([\s\S]*?)###/gm;
  var INLINE_DIRECTIVE = /^#@([\S]+)(.*)/g;
  var BLOCK_COMMENT = /###[\s\S]*?###/gm;
  var INLINE_COMMENT = /^#.*$/g;
  var IS_EXTERNAL_URL = /^\w+:\/\/\/?\w/i;
  var LINK_PATTERN = /\[\[(.*?)\]\]/g;

  var findStory = function findStory(win) {
    if (win && win.story) {
      return win.story;
    }

    return {
      state: {}
    };
  };

  var escapeOctos = function escapeOctos(s) {
    return s.replace("\\#", TOKEN_ESCAPED_OCTO);
  };

  var restoreOctos = function restoreOctos(s) {
    return s.replace(TOKEN_ESCAPED_OCTO, "#");
  };

  var stripComments = function stripComments(s) {
    return s.replace(BLOCK_COMMENT, "").replace(INLINE_COMMENT, "");
  };

  var extractDirectives = function extractDirectives(s) {
    var directives = [];
    s.replace(BLOCK_DIRECTIVE, function (match, dir, content) {
      directives.push({
        name: "@".concat(dir),
        content: content.trim()
      });
      return "";
    });
    s.replace(INLINE_DIRECTIVE, function (match, dir, content) {
      directives.push({
        name: "@".concat(dir),
        content: content.trim()
      });
      return "";
    });
    return directives;
  };

  var renderPassage = function renderPassage(passage) {
    var source = passage.source;
    var result = source;
    result = escapeOctos(result);
    var directives = extractDirectives(result);
    result = stripComments(result);
    result = restoreOctos(result); // strip remaining comments

    result = result.replace("\\#", TOKEN_ESCAPED_OCTO).replace(BLOCK_COMMENT, "").replace(INLINE_COMMENT, "").replace(TOKEN_ESCAPED_OCTO, "#").trim();

    if (passage) {
      // remove links if set previously
      passage.links = [];
    } // [[links]]


    result = result.replace(LINK_PATTERN, function (match, t) {
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
      } // render an external link & stop?


      if (IS_EXTERNAL_URL.test(target)) {
        return '<a href="' + target + '" target="_blank">' + display + "</a>";
      } // handle passage


      if (passage) {
        passage.links.push({
          display: display,
          target: target
        });
      }

      return ""; // render nothing if it's a twee link
    }); // before handling any tags, handle any/all directives

    directives.forEach(function (d) {
      if (!passage.story.directives[d.name]) return;
      passage.story.directives[d.name].forEach(function (run) {
        result = run(d.content, result, passage, passage.story);
      });
    }); // if system tag, return an empty render set

    if (passage.hasTag("system")) {
      return [];
    } // if prompt tag is set, notify the story


    if (passage) {
      var prompts = passage.prefixTag("prompt");

      if (prompts.length) {
        passage.story.prompt(prompts[0]);
      }
    } // if this is a multiline item, trim, split, and mark each item
    // return the array


    if (passage.hasTag("multiline")) {
      result = result.trim();
      return result.split(/[\r\n]+/g);
    } // else returns an array of 1


    return [result];
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

      var systemTag = _this.hasTag("system");

      if (speakerTag) return speakerTag.replace(/^speaker-/, "");
      if (systemTag) return "system";
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
  /**
   * Forces a delay via promises in order to spread out messages
   */


  var delay =
  /*#__PURE__*/
  function () {
    var _ref3 = asyncToGenerator(
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
      return _ref3.apply(this, arguments);
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
          return p.getAttribute("name") === idOrName;
        })[0];
        if (!p) return null;
        return _this.passages[p.getAttribute("pid")];
      }
    });

    defineProperty(this, "advance",
    /*#__PURE__*/
    function () {
      var _ref4 = asyncToGenerator(
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
                if (!passage.hasTag("auto")) {
                  _context2.next = 12;
                  break;
                }

                // auto advance if the auto tag is set, skipping anything that
                // could pause our operation
                _this.advance(_this.findPassage(passage.links[0].target));

                return _context2.abrupt("return");

              case 12:
                // if prompt is set from the current node, enable freetext
                if (_this.showPrompt) {
                  _this.renderTextInput(passage);
                } else {
                  _this.renderChoices(passage);
                }

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }());

    defineProperty(this, "renderUserMessage",
    /*#__PURE__*/
    function () {
      var _ref5 = asyncToGenerator(
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
        return _ref5.apply(this, arguments);
      };
    }());

    defineProperty(this, "renderPassage",
    /*#__PURE__*/
    function () {
      var _ref6 = asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee4(passage, renderer) {
        var speaker, statements, next, content;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                speaker = passage.getSpeaker();
                statements = passage.render();
                next = statements.shift();

                _this.showTyping();

              case 4:
                if (!next) {
                  _context4.next = 13;
                  break;
                }

                content = OTHER_PASSAGE_TMPL({
                  speaker: speaker,
                  tags: passage.tags,
                  text: next
                });
                _context4.next = 8;
                return delay(_this.calculateDelay(next));

              case 8:
                _context4.next = 10;
                return renderer(content);

              case 10:
                next = statements.shift();
                _context4.next = 4;
                break;

              case 13:
                _this.hideTyping();

                _this.scrollToBottom();

                return _context4.abrupt("return", Promise.resolve());

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x5, _x6) {
        return _ref6.apply(this, arguments);
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

    defineProperty(this, "renderTextInput", function (passage) {
      _this.removeChoices();

      var panel = find(_this.document, selectResponses);
      panel.innerHTML = "<input type=\"text\" id=\"user-input\" placeholder=\"".concat(_this.showPrompt.placeholder, "\" /><button data-passage=\"").concat(lodash_escape(passage.links[0].target), "\">&gt;</button>");
    });

    defineProperty(this, "prompt", function (saveAs, placeholder) {
      return _this.showPrompt = {
        saveAs: saveAs,
        placeholder: placeholder
      };
    });

    defineProperty(this, "directive", function (id, cb) {
      if (!_this.directives[id]) {
        _this.directives[id] = [];
      }

      _this.directives[id].push(cb);
    });

    this.window = win;

    if (src) {
      this.document = document.implementation.createHTMLDocument("Chatbook Injected Content");
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
        window.globalEval = eval;
        window.story = new Story(win);
        window.story.start();
      });
    }
  })(window || undefined);

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdGJvb2sudW1kLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRob3V0SG9sZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9ub25JdGVyYWJsZVNwcmVhZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoLnVuZXNjYXBlL2luZGV4LmpzIiwiLi4vc3JjL3R3aW5lL1Bhc3NhZ2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoLmVzY2FwZS9pbmRleC5qcyIsIi4uL3NyYy90d2luZS9TdG9yeS5qcyIsIi4uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9kZWZpbmVQcm9wZXJ0eTsiLCJmdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgYXJyMltpXSA9IGFycltpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheVdpdGhvdXRIb2xlczsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHtcbiAgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZXIpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaXRlcmFibGVUb0FycmF5OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9ub25JdGVyYWJsZVNwcmVhZDsiLCJ2YXIgYXJyYXlXaXRob3V0SG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhvdXRIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL2l0ZXJhYmxlVG9BcnJheVwiKTtcblxudmFyIG5vbkl0ZXJhYmxlU3ByZWFkID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVTcHJlYWRcIik7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIGFycmF5V2l0aG91dEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5KGFycikgfHwgbm9uSXRlcmFibGVTcHJlYWQoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdG9Db25zdW1hYmxlQXJyYXk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykge1xuICB0cnkge1xuICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGluZm8uZG9uZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXG4gICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7XG4gICAgICB9XG5cbiAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FzeW5jVG9HZW5lcmF0b3I7IiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyBhbmQgSFRNTCBjaGFyYWN0ZXJzLiAqL1xudmFyIHJlRXNjYXBlZEh0bWwgPSAvJig/OmFtcHxsdHxndHxxdW90fCMzOXwjOTYpOy9nLFxuICAgIHJlSGFzRXNjYXBlZEh0bWwgPSBSZWdFeHAocmVFc2NhcGVkSHRtbC5zb3VyY2UpO1xuXG4vKiogVXNlZCB0byBtYXAgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLiAqL1xudmFyIGh0bWxVbmVzY2FwZXMgPSB7XG4gICcmYW1wOyc6ICcmJyxcbiAgJyZsdDsnOiAnPCcsXG4gICcmZ3Q7JzogJz4nLFxuICAnJnF1b3Q7JzogJ1wiJyxcbiAgJyYjMzk7JzogXCInXCIsXG4gICcmIzk2Oyc6ICdgJ1xufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eU9mKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCBieSBgXy51bmVzY2FwZWAgdG8gY29udmVydCBIVE1MIGVudGl0aWVzIHRvIGNoYXJhY3RlcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaHIgVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIHVuZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIGNoYXJhY3Rlci5cbiAqL1xudmFyIHVuZXNjYXBlSHRtbENoYXIgPSBiYXNlUHJvcGVydHlPZihodG1sVW5lc2NhcGVzKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnRvU3RyaW5nIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBpbnZlcnNlIG9mIGBfLmVzY2FwZWA7IHRoaXMgbWV0aG9kIGNvbnZlcnRzIHRoZSBIVE1MIGVudGl0aWVzXG4gKiBgJmFtcDtgLCBgJmx0O2AsIGAmZ3Q7YCwgYCZxdW90O2AsIGAmIzM5O2AsIGFuZCBgJiM5NjtgIGluIGBzdHJpbmdgIHRvXG4gKiB0aGVpciBjb3JyZXNwb25kaW5nIGNoYXJhY3RlcnMuXG4gKlxuICogKipOb3RlOioqIE5vIG90aGVyIEhUTUwgZW50aXRpZXMgYXJlIHVuZXNjYXBlZC4gVG8gdW5lc2NhcGUgYWRkaXRpb25hbFxuICogSFRNTCBlbnRpdGllcyB1c2UgYSB0aGlyZC1wYXJ0eSBsaWJyYXJ5IGxpa2UgW19oZV9dKGh0dHBzOi8vbXRocy5iZS9oZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjYuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gdW5lc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB1bmVzY2FwZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnVuZXNjYXBlKCdmcmVkLCBiYXJuZXksICZhbXA7IHBlYmJsZXMnKTtcbiAqIC8vID0+ICdmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gdW5lc2NhcGUoc3RyaW5nKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzRXNjYXBlZEh0bWwudGVzdChzdHJpbmcpKVxuICAgID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVkSHRtbCwgdW5lc2NhcGVIdG1sQ2hhcilcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1bmVzY2FwZTtcbiIsImltcG9ydCB1bmVzY2FwZSBmcm9tIFwibG9kYXNoLnVuZXNjYXBlXCI7XG5cbmNvbnN0IFRPS0VOX0VTQ0FQRURfT0NUTyA9IFwiX19UT0tFTl9FU0NBUEVEX0JBQ0tTTEFTSF9PQ1RPX19cIjtcblxuY29uc3QgQkxPQ0tfRElSRUNUSVZFID0gL14jIyNAKFtcXFNdKykoW1xcc1xcU10qPykjIyMvZ207XG5jb25zdCBJTkxJTkVfRElSRUNUSVZFID0gL14jQChbXFxTXSspKC4qKS9nO1xuXG5jb25zdCBCTE9DS19DT01NRU5UID0gLyMjI1tcXHNcXFNdKj8jIyMvZ207XG5jb25zdCBJTkxJTkVfQ09NTUVOVCA9IC9eIy4qJC9nO1xuXG5jb25zdCBJU19FWFRFUk5BTF9VUkwgPSAvXlxcdys6XFwvXFwvXFwvP1xcdy9pO1xuY29uc3QgTElOS19QQVRURVJOID0gL1xcW1xcWyguKj8pXFxdXFxdL2c7XG5cbmNvbnN0IGZpbmRTdG9yeSA9IHdpbiA9PiB7XG4gIGlmICh3aW4gJiYgd2luLnN0b3J5KSB7XG4gICAgcmV0dXJuIHdpbi5zdG9yeTtcbiAgfVxuICByZXR1cm4geyBzdGF0ZToge30gfTtcbn07XG5cbmNvbnN0IGVzY2FwZU9jdG9zID0gcyA9PiBzLnJlcGxhY2UoXCJcXFxcI1wiLCBUT0tFTl9FU0NBUEVEX09DVE8pO1xuY29uc3QgcmVzdG9yZU9jdG9zID0gcyA9PiBzLnJlcGxhY2UoVE9LRU5fRVNDQVBFRF9PQ1RPLCBcIiNcIik7XG5cbmNvbnN0IHN0cmlwQ29tbWVudHMgPSBzID0+XG4gIHMucmVwbGFjZShCTE9DS19DT01NRU5ULCBcIlwiKS5yZXBsYWNlKElOTElORV9DT01NRU5ULCBcIlwiKTtcblxuY29uc3QgZXh0cmFjdERpcmVjdGl2ZXMgPSBzID0+IHtcbiAgY29uc3QgZGlyZWN0aXZlcyA9IFtdO1xuICBzLnJlcGxhY2UoQkxPQ0tfRElSRUNUSVZFLCAobWF0Y2gsIGRpciwgY29udGVudCkgPT4ge1xuICAgIGRpcmVjdGl2ZXMucHVzaCh7IG5hbWU6IGBAJHtkaXJ9YCwgY29udGVudDogY29udGVudC50cmltKCkgfSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0pO1xuICBzLnJlcGxhY2UoSU5MSU5FX0RJUkVDVElWRSwgKG1hdGNoLCBkaXIsIGNvbnRlbnQpID0+IHtcbiAgICBkaXJlY3RpdmVzLnB1c2goeyBuYW1lOiBgQCR7ZGlyfWAsIGNvbnRlbnQ6IGNvbnRlbnQudHJpbSgpIH0pO1xuICAgIHJldHVybiBcIlwiO1xuICB9KTtcblxuICByZXR1cm4gZGlyZWN0aXZlcztcbn07XG5cbmNvbnN0IHJlbmRlclBhc3NhZ2UgPSBwYXNzYWdlID0+IHtcbiAgY29uc3Qgc291cmNlID0gcGFzc2FnZS5zb3VyY2U7XG5cbiAgbGV0IHJlc3VsdCA9IHNvdXJjZTtcblxuICByZXN1bHQgPSBlc2NhcGVPY3RvcyhyZXN1bHQpO1xuICBjb25zdCBkaXJlY3RpdmVzID0gZXh0cmFjdERpcmVjdGl2ZXMocmVzdWx0KTtcbiAgcmVzdWx0ID0gc3RyaXBDb21tZW50cyhyZXN1bHQpO1xuICByZXN1bHQgPSByZXN0b3JlT2N0b3MocmVzdWx0KTtcblxuICAvLyBzdHJpcCByZW1haW5pbmcgY29tbWVudHNcbiAgcmVzdWx0ID0gcmVzdWx0XG4gICAgLnJlcGxhY2UoXCJcXFxcI1wiLCBUT0tFTl9FU0NBUEVEX09DVE8pXG4gICAgLnJlcGxhY2UoQkxPQ0tfQ09NTUVOVCwgXCJcIilcbiAgICAucmVwbGFjZShJTkxJTkVfQ09NTUVOVCwgXCJcIilcbiAgICAucmVwbGFjZShUT0tFTl9FU0NBUEVEX09DVE8sIFwiI1wiKVxuICAgIC50cmltKCk7XG5cbiAgaWYgKHBhc3NhZ2UpIHtcbiAgICAvLyByZW1vdmUgbGlua3MgaWYgc2V0IHByZXZpb3VzbHlcbiAgICBwYXNzYWdlLmxpbmtzID0gW107XG4gIH1cblxuICAvLyBbW2xpbmtzXV1cbiAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoTElOS19QQVRURVJOLCAobWF0Y2gsIHQpID0+IHtcbiAgICBsZXQgZGlzcGxheSA9IHQ7XG4gICAgbGV0IHRhcmdldCA9IHQ7XG5cbiAgICAvLyBkaXNwbGF5fHRhcmdldCBmb3JtYXRcbiAgICBjb25zdCBiYXJJbmRleCA9IHQuaW5kZXhPZihcInxcIik7XG4gICAgY29uc3QgcmlnaHRBcnJJbmRleCA9IHQuaW5kZXhPZihcIi0+XCIpO1xuICAgIGNvbnN0IGxlZnRBcnJJbmRleCA9IHQuaW5kZXhPZihcIjwtXCIpO1xuXG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICBjYXNlIGJhckluZGV4ID49IDA6XG4gICAgICAgIGRpc3BsYXkgPSB0LnN1YnN0cigwLCBiYXJJbmRleCk7XG4gICAgICAgIHRhcmdldCA9IHQuc3Vic3RyKGJhckluZGV4ICsgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSByaWdodEFyckluZGV4ID49IDA6XG4gICAgICAgIGRpc3BsYXkgPSB0LnN1YnN0cigwLCByaWdodEFyckluZGV4KTtcbiAgICAgICAgdGFyZ2V0ID0gdC5zdWJzdHIocmlnaHRBcnJJbmRleCArIDIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgbGVmdEFyckluZGV4ID49IDA6XG4gICAgICAgIGRpc3BsYXkgPSB0LnN1YnN0cihsZWZ0QXJySW5kZXggKyAyKTtcbiAgICAgICAgdGFyZ2V0ID0gdC5zdWJzdHIoMCwgbGVmdEFyckluZGV4KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIGFuIGV4dGVybmFsIGxpbmsgJiBzdG9wP1xuICAgIGlmIChJU19FWFRFUk5BTF9VUkwudGVzdCh0YXJnZXQpKSB7XG4gICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgdGFyZ2V0ICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicgKyBkaXNwbGF5ICsgXCI8L2E+XCI7XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIHBhc3NhZ2VcbiAgICBpZiAocGFzc2FnZSkge1xuICAgICAgcGFzc2FnZS5saW5rcy5wdXNoKHtcbiAgICAgICAgZGlzcGxheSxcbiAgICAgICAgdGFyZ2V0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjsgLy8gcmVuZGVyIG5vdGhpbmcgaWYgaXQncyBhIHR3ZWUgbGlua1xuICB9KTtcblxuICAvLyBiZWZvcmUgaGFuZGxpbmcgYW55IHRhZ3MsIGhhbmRsZSBhbnkvYWxsIGRpcmVjdGl2ZXNcbiAgZGlyZWN0aXZlcy5mb3JFYWNoKGQgPT4ge1xuICAgIGlmICghcGFzc2FnZS5zdG9yeS5kaXJlY3RpdmVzW2QubmFtZV0pIHJldHVybjtcbiAgICBwYXNzYWdlLnN0b3J5LmRpcmVjdGl2ZXNbZC5uYW1lXS5mb3JFYWNoKHJ1biA9PiB7XG4gICAgICByZXN1bHQgPSBydW4oZC5jb250ZW50LCByZXN1bHQsIHBhc3NhZ2UsIHBhc3NhZ2Uuc3RvcnkpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBpZiBzeXN0ZW0gdGFnLCByZXR1cm4gYW4gZW1wdHkgcmVuZGVyIHNldFxuICBpZiAocGFzc2FnZS5oYXNUYWcoXCJzeXN0ZW1cIikpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBpZiBwcm9tcHQgdGFnIGlzIHNldCwgbm90aWZ5IHRoZSBzdG9yeVxuICBpZiAocGFzc2FnZSkge1xuICAgIGNvbnN0IHByb21wdHMgPSBwYXNzYWdlLnByZWZpeFRhZyhcInByb21wdFwiKTtcbiAgICBpZiAocHJvbXB0cy5sZW5ndGgpIHtcbiAgICAgIHBhc3NhZ2Uuc3RvcnkucHJvbXB0KHByb21wdHNbMF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoaXMgaXMgYSBtdWx0aWxpbmUgaXRlbSwgdHJpbSwgc3BsaXQsIGFuZCBtYXJrIGVhY2ggaXRlbVxuICAvLyByZXR1cm4gdGhlIGFycmF5XG4gIGlmIChwYXNzYWdlLmhhc1RhZyhcIm11bHRpbGluZVwiKSkge1xuICAgIHJlc3VsdCA9IHJlc3VsdC50cmltKCk7XG4gICAgcmV0dXJuIHJlc3VsdC5zcGxpdCgvW1xcclxcbl0rL2cpO1xuICB9XG5cbiAgLy8gZWxzZSByZXR1cm5zIGFuIGFycmF5IG9mIDFcbiAgcmV0dXJuIFtyZXN1bHRdO1xufTtcblxuY2xhc3MgUGFzc2FnZSB7XG4gIGlkID0gbnVsbDtcbiAgbmFtZSA9IG51bGw7XG4gIHRhZ3MgPSBudWxsO1xuICB0YWdEaWN0ID0ge307XG4gIHNvdXJjZSA9IG51bGw7XG4gIGxpbmtzID0gW107XG5cbiAgY29uc3RydWN0b3IoaWQsIG5hbWUsIHRhZ3MsIHNvdXJjZSwgc3RvcnkpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnRhZ3MgPSB0YWdzO1xuICAgIHRoaXMuc291cmNlID0gdW5lc2NhcGUoc291cmNlKTtcbiAgICB0aGlzLnN0b3J5ID0gc3Rvcnk7XG5cbiAgICB0aGlzLnRhZ3MuZm9yRWFjaCh0ID0+ICh0aGlzLnRhZ0RpY3RbdF0gPSAxKSk7XG4gIH1cblxuICBnZXRTcGVha2VyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNwZWFrZXJUYWcgPSB0aGlzLnRhZ3MuZmluZCh0ID0+IHQuaW5kZXhPZihcInNwZWFrZXItXCIpID09PSAwKSB8fCBcIlwiO1xuICAgIGNvbnN0IHN5c3RlbVRhZyA9IHRoaXMuaGFzVGFnKFwic3lzdGVtXCIpO1xuICAgIGlmIChzcGVha2VyVGFnKSByZXR1cm4gc3BlYWtlclRhZy5yZXBsYWNlKC9ec3BlYWtlci0vLCBcIlwiKTtcbiAgICBpZiAoc3lzdGVtVGFnKSByZXR1cm4gXCJzeXN0ZW1cIjtcbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBwcmVmaXhUYWcgPSAocGZ4LCBhc0RpY3QpID0+XG4gICAgdGhpcy50YWdzXG4gICAgICAuZmlsdGVyKHQgPT4gdC5pbmRleE9mKGAke3BmeH0tYCkgPT09IDApXG4gICAgICAubWFwKHQgPT4gdC5yZXBsYWNlKGAke3BmeH0tYCwgXCJcIikpXG4gICAgICAucmVkdWNlKFxuICAgICAgICAoYSwgdCkgPT4ge1xuICAgICAgICAgIGlmIChhc0RpY3QpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5hLFxuICAgICAgICAgICAgICBbdF06IDFcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gWy4uLmEsIHRdO1xuICAgICAgICB9LFxuICAgICAgICBhc0RpY3QgPyB7fSA6IFtdXG4gICAgICApO1xuXG4gIGhhc1RhZyA9IHQgPT4gdGhpcy50YWdEaWN0W3RdO1xuXG4gIC8vIHN0YXRpYyBhbmQgaW5zdGFuY2UgcmVuZGVyc1xuICBzdGF0aWMgcmVuZGVyID0gc3RyID0+XG4gICAgcmVuZGVyUGFzc2FnZShcbiAgICAgIG5ldyBQYXNzYWdlKG51bGwsIG51bGwsIG51bGwsIHN0ciwgZmluZFN0b3J5KHdpbmRvdyB8fCBudWxsKSlcbiAgICApO1xuICByZW5kZXIgPSAoKSA9PiByZW5kZXJQYXNzYWdlKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQYXNzYWdlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyBhbmQgSFRNTCBjaGFyYWN0ZXJzLiAqL1xudmFyIHJlVW5lc2NhcGVkSHRtbCA9IC9bJjw+XCInYF0vZyxcbiAgICByZUhhc1VuZXNjYXBlZEh0bWwgPSBSZWdFeHAocmVVbmVzY2FwZWRIdG1sLnNvdXJjZSk7XG5cbi8qKiBVc2VkIHRvIG1hcCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuICovXG52YXIgaHRtbEVzY2FwZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmIzM5OycsXG4gICdgJzogJyYjOTY7J1xufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eU9mKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCBieSBgXy5lc2NhcGVgIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAqL1xudmFyIGVzY2FwZUh0bWxDaGFyID0gYmFzZVByb3BlcnR5T2YoaHRtbEVzY2FwZXMpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGNoYXJhY3RlcnMgXCImXCIsIFwiPFwiLCBcIj5cIiwgJ1wiJywgXCInXCIsIGFuZCBcIlxcYFwiIGluIGBzdHJpbmdgIHRvXG4gKiB0aGVpciBjb3JyZXNwb25kaW5nIEhUTUwgZW50aXRpZXMuXG4gKlxuICogKipOb3RlOioqIE5vIG90aGVyIGNoYXJhY3RlcnMgYXJlIGVzY2FwZWQuIFRvIGVzY2FwZSBhZGRpdGlvbmFsXG4gKiBjaGFyYWN0ZXJzIHVzZSBhIHRoaXJkLXBhcnR5IGxpYnJhcnkgbGlrZSBbX2hlX10oaHR0cHM6Ly9tdGhzLmJlL2hlKS5cbiAqXG4gKiBUaG91Z2ggdGhlIFwiPlwiIGNoYXJhY3RlciBpcyBlc2NhcGVkIGZvciBzeW1tZXRyeSwgY2hhcmFjdGVycyBsaWtlXG4gKiBcIj5cIiBhbmQgXCIvXCIgZG9uJ3QgbmVlZCBlc2NhcGluZyBpbiBIVE1MIGFuZCBoYXZlIG5vIHNwZWNpYWwgbWVhbmluZ1xuICogdW5sZXNzIHRoZXkncmUgcGFydCBvZiBhIHRhZyBvciB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuIFNlZVxuICogW01hdGhpYXMgQnluZW5zJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2FtYmlndW91cy1hbXBlcnNhbmRzKVxuICogKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQmFja3RpY2tzIGFyZSBlc2NhcGVkIGJlY2F1c2UgaW4gSUUgPCA5LCB0aGV5IGNhbiBicmVhayBvdXQgb2ZcbiAqIGF0dHJpYnV0ZSB2YWx1ZXMgb3IgSFRNTCBjb21tZW50cy4gU2VlIFsjNTldKGh0dHBzOi8vaHRtbDVzZWMub3JnLyM1OSksXG4gKiBbIzEwMl0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwMiksIFsjMTA4XShodHRwczovL2h0bWw1c2VjLm9yZy8jMTA4KSwgYW5kXG4gKiBbIzEzM10oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEzMykgb2YgdGhlXG4gKiBbSFRNTDUgU2VjdXJpdHkgQ2hlYXRzaGVldF0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvKSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFdoZW4gd29ya2luZyB3aXRoIEhUTUwgeW91IHNob3VsZCBhbHdheXNcbiAqIFtxdW90ZSBhdHRyaWJ1dGUgdmFsdWVzXShodHRwOi8vd29ua28uY29tL3Bvc3QvaHRtbC1lc2NhcGluZykgdG8gcmVkdWNlXG4gKiBYU1MgdmVjdG9ycy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGUoJ2ZyZWQsIGJhcm5leSwgJiBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiBlc2NhcGUoc3RyaW5nKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiAoc3RyaW5nICYmIHJlSGFzVW5lc2NhcGVkSHRtbC50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVVuZXNjYXBlZEh0bWwsIGVzY2FwZUh0bWxDaGFyKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZTtcbiIsImltcG9ydCBQYXNzYWdlIGZyb20gXCIuL1Bhc3NhZ2VcIjtcbmltcG9ydCBlc2NhcGUgZnJvbSBcImxvZGFzaC5lc2NhcGVcIjtcblxuY29uc3Qgc2VsZWN0UGFzc2FnZXMgPSBcInR3LXBhc3NhZ2VkYXRhXCI7XG5jb25zdCBzZWxlY3RDc3MgPSAnKlt0eXBlPVwidGV4dC90d2luZS1jc3NcIl0nO1xuY29uc3Qgc2VsZWN0SnMgPSAnKlt0eXBlPVwidGV4dC90d2luZS1qYXZhc2NyaXB0XCJdJztcbmNvbnN0IHNlbGVjdEFjdGl2ZUxpbmsgPSBcIiN1c2VyLXJlc3BvbnNlLXBhbmVsIGFbZGF0YS1wYXNzYWdlXVwiO1xuY29uc3Qgc2VsZWN0QWN0aXZlQnV0dG9uID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbCBidXR0b25bZGF0YS1wYXNzYWdlXVwiO1xuY29uc3Qgc2VsZWN0QWN0aXZlSW5wdXQgPSBcIiN1c2VyLXJlc3BvbnNlLXBhbmVsIGlucHV0XCI7XG5jb25zdCBzZWxlY3RBY3RpdmUgPSBcIi5jaGF0LXBhbmVsIC5hY3RpdmVcIjtcbmNvbnN0IHNlbGVjdEhpc3RvcnkgPSBcIi5jaGF0LXBhbmVsIC5oaXN0b3J5XCI7XG5jb25zdCBzZWxlY3RSZXNwb25zZXMgPSBcIiN1c2VyLXJlc3BvbnNlLXBhbmVsXCI7XG5jb25zdCB0eXBpbmdJbmRpY2F0b3IgPSBcIiNhbmltYXRpb24tY29udGFpbmVyXCI7XG5cbmNvbnN0IElTX05VTUVSSUMgPSAvXltcXGRdKyQvO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHByb3ZpZGVkIHN0cmluZyBjb250YWlucyBvbmx5IG51bWJlcnNcbiAqIEluIHRoZSBjYXNlIG9mIGBwaWRgIHZhbHVlcyBmb3IgcGFzc2FnZXMsIHRoaXMgaXMgdHJ1ZVxuICovXG5jb25zdCBpc051bWVyaWMgPSBkID0+IElTX05VTUVSSUMudGVzdChkKTtcblxuLyoqXG4gKiBGb3JtYXQgYSB1c2VyIHBhc3NhZ2UgKHN1Y2ggYXMgYSByZXNwb25zZSlcbiAqL1xuY29uc3QgVVNFUl9QQVNTQUdFX1RNUEwgPSAoeyBpZCwgdGV4dCB9KSA9PiBgXG4gIDxkaXYgY2xhc3M9XCJjaGF0LXBhc3NhZ2Utd3JhcHBlclwiIGRhdGEtc3BlYWtlcj1cInlvdVwiPlxuICAgIDxkaXYgY2xhc3M9XCJjaGF0LXBhc3NhZ2UgcGhpc3RvcnlcIiBkYXRhLXNwZWFrZXI9XCJ5b3VcIiBkYXRhLXVwYXNzYWdlPVwiJHtpZH1cIj5cbiAgICAgICR7dGV4dH1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG4vKipcbiAqIEZvcm1hdCBhIG1lc3NhZ2UgZnJvbSBhIG5vbi11c2VyXG4gKi9cbmNvbnN0IE9USEVSX1BBU1NBR0VfVE1QTCA9ICh7IHNwZWFrZXIsIHRhZ3MsIHRleHQgfSkgPT4gYFxuICA8ZGl2IGRhdGEtc3BlYWtlcj1cIiR7c3BlYWtlcn1cIiBjbGFzcz1cImNoYXQtcGFzc2FnZS13cmFwcGVyICR7dGFncy5qb2luKFwiIFwiKX1cIj5cbiAgICA8ZGl2IGRhdGEtc3BlYWtlcj1cIiR7c3BlYWtlcn1cIiBjbGFzcz1cImNoYXQtcGFzc2FnZVwiPlxuICAgICAgJHt0ZXh0fVxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbi8qKlxuICogRm9yY2VzIGEgZGVsYXkgdmlhIHByb21pc2VzIGluIG9yZGVyIHRvIHNwcmVhZCBvdXQgbWVzc2FnZXNcbiAqL1xuY29uc3QgZGVsYXkgPSBhc3luYyAodCA9IDApID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0KSk7XG5cbi8vIEZpbmQgb25lL21hbnkgbm9kZXMgd2l0aGluIGEgY29udGV4dC4gV2UgWy4uLmZpbmRBbGxdIHRvIGVuc3VyZSB3ZSdyZSBjYXN0IGFzIGFuIGFycmF5XG4vLyBub3QgYXMgYSBub2RlIGxpc3RcbmNvbnN0IGZpbmQgPSAoY3R4LCBzKSA9PiBjdHgucXVlcnlTZWxlY3RvcihzKTtcbmNvbnN0IGZpbmRBbGwgPSAoY3R4LCBzKSA9PiBbLi4uY3R4LnF1ZXJ5U2VsZWN0b3JBbGwocyldIHx8IFtdO1xuXG4vKipcbiAqIFN0YW5kYXJkIFR3aW5lIEZvcm1hdCBTdG9yeSBPYmplY3RcbiAqL1xuY2xhc3MgU3Rvcnkge1xuICB2ZXJzaW9uID0gMjsgLy8gVHdpbmUgdjJcblxuICBkb2N1bWVudCA9IG51bGw7XG4gIHN0b3J5ID0gbnVsbDtcbiAgbmFtZSA9IFwiXCI7XG4gIHN0YXJ0c0F0ID0gMDtcbiAgY3VycmVudCA9IDA7XG4gIGhpc3RvcnkgPSBbXTtcbiAgcGFzc2FnZXMgPSB7fTtcbiAgc2hvd1Byb21wdCA9IGZhbHNlO1xuICBlcnJvck1lc3NhZ2UgPSBcIlxcdTI2YTAgJXNcIjtcblxuICBkaXJlY3RpdmVzID0ge307XG4gIGVsZW1lbnRzID0ge307XG5cbiAgdXNlclNjcmlwdHMgPSBbXTtcbiAgdXNlclN0eWxlcyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHdpbiwgc3JjKSB7XG4gICAgdGhpcy53aW5kb3cgPSB3aW47XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KFxuICAgICAgICBcIkNoYXRib29rIEluamVjdGVkIENvbnRlbnRcIlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIH1cblxuICAgIHRoaXMuc3RvcnkgPSBmaW5kKHRoaXMuZG9jdW1lbnQsIFwidHctc3RvcnlkYXRhXCIpO1xuXG4gICAgLy8gZWxlbWVudHNcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xuICAgICAgYWN0aXZlOiBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdEFjdGl2ZSksXG4gICAgICBoaXN0b3J5OiBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdEhpc3RvcnkpXG4gICAgfTtcblxuICAgIC8vIHByb3BlcnRpZXMgb2Ygc3Rvcnkgbm9kZVxuICAgIHRoaXMubmFtZSA9IHRoaXMuc3RvcnkuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBcIlwiO1xuICAgIHRoaXMuc3RhcnRzQXQgPSB0aGlzLnN0b3J5LmdldEF0dHJpYnV0ZShcInN0YXJ0bm9kZVwiKSB8fCAwO1xuXG4gICAgZmluZEFsbCh0aGlzLnN0b3J5LCBzZWxlY3RQYXNzYWdlcykuZm9yRWFjaChwID0+IHtcbiAgICAgIGNvbnN0IGlkID0gcGFyc2VJbnQocC5nZXRBdHRyaWJ1dGUoXCJwaWRcIikpO1xuICAgICAgY29uc3QgbmFtZSA9IHAuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgIGNvbnN0IHRhZ3MgPSAocC5nZXRBdHRyaWJ1dGUoXCJ0YWdzXCIpIHx8IFwiXCIpLnNwbGl0KC9cXHMrL2cpO1xuICAgICAgY29uc3QgcGFzc2FnZSA9IHAuaW5uZXJIVE1MIHx8IFwiXCI7XG5cbiAgICAgIHRoaXMucGFzc2FnZXNbaWRdID0gbmV3IFBhc3NhZ2UoaWQsIG5hbWUsIHRhZ3MsIHBhc3NhZ2UsIHRoaXMpO1xuICAgIH0pO1xuXG4gICAgZmluZCh0aGlzLmRvY3VtZW50LCBcInRpdGxlXCIpLmlubmVySFRNTCA9IHRoaXMubmFtZTtcbiAgICBmaW5kKHRoaXMuZG9jdW1lbnQsIFwiI3B0aXRsZVwiKS5pbm5lckhUTUwgPSB0aGlzLm5hbWU7XG5cbiAgICB0aGlzLnVzZXJTY3JpcHRzID0gKGZpbmRBbGwodGhpcy5kb2N1bWVudCwgc2VsZWN0SnMpIHx8IFtdKS5tYXAoXG4gICAgICBlbCA9PiBlbC5pbm5lckhUTUxcbiAgICApO1xuICAgIHRoaXMudXNlclN0eWxlcyA9IChmaW5kQWxsKHRoaXMuZG9jdW1lbnQsIHNlbGVjdENzcykgfHwgW10pLm1hcChcbiAgICAgIGVsID0+IGVsLmlubmVySFRNTFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBzdG9yeSBieSBzZXR0aW5nIHVwIGxpc3RlbmVycyBhbmQgdGhlbiBhZHZhbmNpbmdcbiAgICogdG8gdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHN0YWNrXG4gICAqL1xuICBzdGFydCA9ICgpID0+IHtcbiAgICAvLyBhY3RpdmF0ZSB1c2Vyc2NyaXB0cyBhbmQgc3R5bGVzXG4gICAgdGhpcy51c2VyU3R5bGVzLmZvckVhY2gocyA9PiB7XG4gICAgICBjb25zdCB0ID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICB0LmlubmVySFRNTCA9IHM7XG4gICAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodCk7XG4gICAgfSk7XG4gICAgdGhpcy51c2VyU2NyaXB0cy5mb3JFYWNoKHMgPT4ge1xuICAgICAgLy8gZXZhbCBpcyBldmlsLCBidXQgdGhpcyBpcyBzaW1wbHkgaG93IFR3aW5lIHdvcmtzXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICBnbG9iYWxFdmFsKHMpO1xuICAgIH0pO1xuXG4gICAgLy8gd2hlbiB5b3UgY2xpY2sgb24gYVtkYXRhLXBhc3NhZ2VdIChyZXNwb25zZSBsaW5rKS4uLlxuICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0Lm1hdGNoZXMoc2VsZWN0QWN0aXZlTGluaykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFkdmFuY2UoXG4gICAgICAgIHRoaXMuZmluZFBhc3NhZ2UoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXNzYWdlXCIpKSxcbiAgICAgICAgZS50YXJnZXQuaW5uZXJIVE1MXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gd2hlbiB5b3UgY2xpY2sgb24gYnV0dG9uW2RhdGEtcGFzc2FnZV0gKHJlc3BvbnNlIGlucHV0KS4uLlxuICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0Lm1hdGNoZXMoc2VsZWN0QWN0aXZlQnV0dG9uKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGNhcHR1cmUgYW5kIGRpc2FibGUgc2hvd1Byb21wdCBmZWF0dXJlXG4gICAgICBjb25zdCB2YWx1ZSA9IGZpbmQodGhpcy5kb2N1bWVudCwgc2VsZWN0QWN0aXZlSW5wdXQpLnZhbHVlO1xuICAgICAgdGhpcy5zaG93UHJvbXB0ID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuYWR2YW5jZShcbiAgICAgICAgdGhpcy5maW5kUGFzc2FnZShlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhc3NhZ2VcIikpLFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWR2YW5jZSh0aGlzLmZpbmRQYXNzYWdlKHRoaXMuc3RhcnRzQXQpKTtcbiAgfTtcblxuICAvKipcbiAgICogRmluZCBhIHBhc3NhZ2UgYmFzZWQgb24gaXRzIGlkIG9yIG5hbWVcbiAgICovXG4gIGZpbmRQYXNzYWdlID0gaWRPck5hbWUgPT4ge1xuICAgIGlmIChpc051bWVyaWMoaWRPck5hbWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXNzYWdlc1tpZE9yTmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhhbmRsZSBwYXNzYWdlcyB3aXRoICcgYW5kIFwiIChjYW4ndCB1c2UgYSBjc3Mgc2VsZWN0b3IgY29uc2lzdGVudGx5KVxuICAgICAgY29uc3QgcCA9IGZpbmRBbGwodGhpcy5zdG9yeSwgXCJ0dy1wYXNzYWdlZGF0YVwiKS5maWx0ZXIoXG4gICAgICAgIHAgPT4gcC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpID09PSBpZE9yTmFtZVxuICAgICAgKVswXTtcbiAgICAgIGlmICghcCkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5wYXNzYWdlc1twLmdldEF0dHJpYnV0ZShcInBpZFwiKV07XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBBZHZhbmNlIHRoZSBzdG9yeSB0byB0aGUgcGFzc2FnZSBzcGVjaWZpZWQsIG9wdGlvbmFsbHkgYWRkaW5nIHVzZXJUZXh0XG4gICAqL1xuICBhZHZhbmNlID0gYXN5bmMgKHBhc3NhZ2UsIHVzZXJUZXh0ID0gbnVsbCkgPT4ge1xuICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhc3NhZ2UuaWQpO1xuICAgIGNvbnN0IGxhc3QgPSB0aGlzLmN1cnJlbnQ7XG5cbiAgICAvLyAuYWN0aXZlIGlzIGNhcHR1cmVkICYgY2xlYXJlZFxuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5lbGVtZW50cy5hY3RpdmUuaW5uZXJIVE1MO1xuICAgIHRoaXMuZWxlbWVudHMuYWN0aXZlLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvLyB3aGF0ZXZlciB3YXMgaW4gYWN0aXZlIGlzIG1vdmVkIHVwIGludG8gaGlzdG9yeVxuICAgIHRoaXMuZWxlbWVudHMuaGlzdG9yeS5pbm5lckhUTUwgKz0gZXhpc3Rpbmc7XG5cbiAgICAvLyBpZiB0aGVyZSBpcyB1c2VyVGV4dCwgaXQgaXMgYWRkZWQgdG8gLmhpc3RvcnlcbiAgICBpZiAodXNlclRleHQpIHtcbiAgICAgIHRoaXMucmVuZGVyVXNlck1lc3NhZ2UoXG4gICAgICAgIGxhc3QsXG4gICAgICAgIHVzZXJUZXh0LFxuICAgICAgICBzID0+ICh0aGlzLmVsZW1lbnRzLmhpc3RvcnkuaW5uZXJIVE1MICs9IHMpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFRoZSBuZXcgcGFzc2FnZSBpcyByZW5kZXJlZCBhbmQgcGxhY2VkIGluIC5hY3RpdmVcbiAgICAvLyBhZnRlciBhbGwgcmVuZGVycywgdXNlciBvcHRpb25zIGFyZSBkaXNwbGF5ZWRcbiAgICBhd2FpdCB0aGlzLnJlbmRlclBhc3NhZ2UoXG4gICAgICBwYXNzYWdlLFxuICAgICAgcyA9PiAodGhpcy5lbGVtZW50cy5hY3RpdmUuaW5uZXJIVE1MICs9IHMpXG4gICAgKTtcbiAgICBpZiAocGFzc2FnZS5oYXNUYWcoXCJhdXRvXCIpKSB7XG4gICAgICAvLyBhdXRvIGFkdmFuY2UgaWYgdGhlIGF1dG8gdGFnIGlzIHNldCwgc2tpcHBpbmcgYW55dGhpbmcgdGhhdFxuICAgICAgLy8gY291bGQgcGF1c2Ugb3VyIG9wZXJhdGlvblxuICAgICAgdGhpcy5hZHZhbmNlKHRoaXMuZmluZFBhc3NhZ2UocGFzc2FnZS5saW5rc1swXS50YXJnZXQpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZiBwcm9tcHQgaXMgc2V0IGZyb20gdGhlIGN1cnJlbnQgbm9kZSwgZW5hYmxlIGZyZWV0ZXh0XG4gICAgaWYgKHRoaXMuc2hvd1Byb21wdCkge1xuICAgICAgdGhpcy5yZW5kZXJUZXh0SW5wdXQocGFzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyQ2hvaWNlcyhwYXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0ZXh0IGFzIGlmIGl0IGNhbWUgZnJvbSB0aGUgdXNlclxuICAgKi9cbiAgcmVuZGVyVXNlck1lc3NhZ2UgPSBhc3luYyAocGlkLCB0ZXh0LCByZW5kZXJlcikgPT4ge1xuICAgIGF3YWl0IHJlbmRlcmVyKFxuICAgICAgVVNFUl9QQVNTQUdFX1RNUEwoe1xuICAgICAgICBwaWQsXG4gICAgICAgIHRleHRcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgYSBUd2luZStDaGF0Ym9vayBwYXNzYWdlIG9iamVjdFxuICAgKi9cbiAgcmVuZGVyUGFzc2FnZSA9IGFzeW5jIChwYXNzYWdlLCByZW5kZXJlcikgPT4ge1xuICAgIGNvbnN0IHNwZWFrZXIgPSBwYXNzYWdlLmdldFNwZWFrZXIoKTtcbiAgICBsZXQgc3RhdGVtZW50cyA9IHBhc3NhZ2UucmVuZGVyKCk7XG4gICAgbGV0IG5leHQgPSBzdGF0ZW1lbnRzLnNoaWZ0KCk7XG4gICAgdGhpcy5zaG93VHlwaW5nKCk7XG4gICAgd2hpbGUgKG5leHQpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBPVEhFUl9QQVNTQUdFX1RNUEwoe1xuICAgICAgICBzcGVha2VyLFxuICAgICAgICB0YWdzOiBwYXNzYWdlLnRhZ3MsXG4gICAgICAgIHRleHQ6IG5leHRcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgZGVsYXkodGhpcy5jYWxjdWxhdGVEZWxheShuZXh0KSk7IC8vIHRvZG9cbiAgICAgIGF3YWl0IHJlbmRlcmVyKGNvbnRlbnQpO1xuICAgICAgbmV4dCA9IHN0YXRlbWVudHMuc2hpZnQoKTtcbiAgICB9XG4gICAgdGhpcy5oaWRlVHlwaW5nKCk7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBIHJvdWdoIGZ1bmN0aW9uIGZvciBkZXRlcm1pbmluZyBhIHdhaXRpbmcgcGVyaW9kIGJhc2VkIG9uIHN0cmluZyBsZW5ndGhcbiAgICovXG4gIGNhbGN1bGF0ZURlbGF5ID0gdHh0ID0+IHtcbiAgICBjb25zdCB0eXBpbmdEZWxheVJhdGlvID0gMC4zO1xuICAgIGNvbnN0IHJhdGUgPSAyMDsgLy8gbXNcbiAgICByZXR1cm4gdHh0Lmxlbmd0aCAqIHJhdGUgKiB0eXBpbmdEZWxheVJhdGlvO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93cyB0aGUgdHlwaW5nIGluZGljYXRvclxuICAgKi9cbiAgc2hvd1R5cGluZyA9ICgpID0+IHtcbiAgICBmaW5kKHRoaXMuZG9jdW1lbnQsIHR5cGluZ0luZGljYXRvcikuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgdHlwaW5nIGluZGljYXRvclxuICAgKi9cbiAgaGlkZVR5cGluZyA9ICgpID0+IHtcbiAgICBmaW5kKHRoaXMuZG9jdW1lbnQsIHR5cGluZ0luZGljYXRvcikuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdGhlIGRvY3VtZW50IGFzIGZhciBhcyBwb3NzaWJsZSAoYmFzZWQgb24gaGlzdG9yeSBjb250YWluZXIncyBoZWlnaHQpXG4gICAqL1xuICBzY3JvbGxUb0JvdHRvbSA9ICgpID0+IHtcbiAgICBjb25zdCBoaXN0ID0gZmluZCh0aGlzLmRvY3VtZW50LCBcIiNwaGlzdG9yeVwiKTtcbiAgICBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50LnNjcm9sbFRvcCA9IGhpc3Qub2Zmc2V0SGVpZ2h0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGNob2ljZXMgcGFuZWxcbiAgICovXG4gIHJlbW92ZUNob2ljZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgcGFuZWwgPSBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdFJlc3BvbnNlcyk7XG4gICAgcGFuZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgfTtcblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgY2hvaWNlcyBwYW5lbCB3aXRoIGEgc2V0IG9mIG9wdGlvbnMgYmFzZWQgb24gcGFzc2FnZSBsaW5rc1xuICAgKi9cbiAgcmVuZGVyQ2hvaWNlcyA9IHBhc3NhZ2UgPT4ge1xuICAgIHRoaXMucmVtb3ZlQ2hvaWNlcygpO1xuICAgIGNvbnN0IHBhbmVsID0gZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RSZXNwb25zZXMpO1xuICAgIHBhc3NhZ2UubGlua3MuZm9yRWFjaChsID0+IHtcbiAgICAgIHBhbmVsLmlubmVySFRNTCArPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGNsYXNzPVwidXNlci1yZXNwb25zZVwiIGRhdGEtcGFzc2FnZT1cIiR7ZXNjYXBlKFxuICAgICAgICBsLnRhcmdldFxuICAgICAgKX1cIj4ke2wuZGlzcGxheX08L2E+YDtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmVuZGVycyBhIGZyZWUtdGV4dCBpbnB1dCBiYXNlZCBvbiBzaG93UHJvbXB0IHNldHRpbmdzXG4gICAqL1xuICByZW5kZXJUZXh0SW5wdXQgPSBwYXNzYWdlID0+IHtcbiAgICB0aGlzLnJlbW92ZUNob2ljZXMoKTtcbiAgICBjb25zdCBwYW5lbCA9IGZpbmQodGhpcy5kb2N1bWVudCwgc2VsZWN0UmVzcG9uc2VzKTtcbiAgICBwYW5lbC5pbm5lckhUTUwgPSBgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ1c2VyLWlucHV0XCIgcGxhY2Vob2xkZXI9XCIke1xuICAgICAgdGhpcy5zaG93UHJvbXB0LnBsYWNlaG9sZGVyXG4gICAgfVwiIC8+PGJ1dHRvbiBkYXRhLXBhc3NhZ2U9XCIke2VzY2FwZShcbiAgICAgIHBhc3NhZ2UubGlua3NbMF0udGFyZ2V0XG4gICAgKX1cIj4mZ3Q7PC9idXR0b24+YDtcbiAgfTtcblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgdGV4dC1pbnB1dCBpbnN0ZWFkIG9mIHN0YW5kYXJkIGNob2ljZXNcbiAgICovXG4gIHByb21wdCA9IChzYXZlQXMsIHBsYWNlaG9sZGVyKSA9PiAodGhpcy5zaG93UHJvbXB0ID0geyBzYXZlQXMsIHBsYWNlaG9sZGVyIH0pO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjdXN0b20gZGlyZWN0aXZlIGZvciB0aGlzIHN0b3J5XG4gICAqIFNpZ25hdHVyZSBvZiAoZGlyZWN0aXZlQ29udGVudCwgb3V0cHV0VGV4dCwgc3RvcnksIHBhc3NhZ2UsIG5leHQpXG4gICAqL1xuICBkaXJlY3RpdmUgPSAoaWQsIGNiKSA9PiB7XG4gICAgaWYgKCF0aGlzLmRpcmVjdGl2ZXNbaWRdKSB7XG4gICAgICB0aGlzLmRpcmVjdGl2ZXNbaWRdID0gW107XG4gICAgfVxuICAgIHRoaXMuZGlyZWN0aXZlc1tpZF0ucHVzaChjYik7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0b3J5O1xuIiwiaW1wb3J0IFN0b3J5IGZyb20gXCIuL3R3aW5lL1N0b3J5XCI7XG5cbih3aW4gPT4ge1xuICBpZiAodHlwZW9mIHdpbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbi5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgd2luZG93Lmdsb2JhbEV2YWwgPSBldmFsO1xuICAgICAgd2luZG93LnN0b3J5ID0gbmV3IFN0b3J5KHdpbik7XG4gICAgICB3aW5kb3cuc3Rvcnkuc3RhcnQoKTtcbiAgICB9KTtcbiAgfVxufSkod2luZG93IHx8IHVuZGVmaW5lZCk7XG4iXSwibmFtZXMiOlsidW5kZWZpbmVkIiwicmVxdWlyZSQkMCIsImdsb2JhbCIsIlN5bWJvbCIsIlRPS0VOX0VTQ0FQRURfT0NUTyIsIkJMT0NLX0RJUkVDVElWRSIsIklOTElORV9ESVJFQ1RJVkUiLCJCTE9DS19DT01NRU5UIiwiSU5MSU5FX0NPTU1FTlQiLCJJU19FWFRFUk5BTF9VUkwiLCJMSU5LX1BBVFRFUk4iLCJmaW5kU3RvcnkiLCJ3aW4iLCJzdG9yeSIsInN0YXRlIiwiZXNjYXBlT2N0b3MiLCJzIiwicmVwbGFjZSIsInJlc3RvcmVPY3RvcyIsInN0cmlwQ29tbWVudHMiLCJleHRyYWN0RGlyZWN0aXZlcyIsImRpcmVjdGl2ZXMiLCJtYXRjaCIsImRpciIsImNvbnRlbnQiLCJwdXNoIiwibmFtZSIsInRyaW0iLCJyZW5kZXJQYXNzYWdlIiwicGFzc2FnZSIsInNvdXJjZSIsInJlc3VsdCIsImxpbmtzIiwidCIsImRpc3BsYXkiLCJ0YXJnZXQiLCJiYXJJbmRleCIsImluZGV4T2YiLCJyaWdodEFyckluZGV4IiwibGVmdEFyckluZGV4Iiwic3Vic3RyIiwidGVzdCIsImZvckVhY2giLCJkIiwicnVuIiwiaGFzVGFnIiwicHJvbXB0cyIsInByZWZpeFRhZyIsImxlbmd0aCIsInByb21wdCIsInNwbGl0IiwiUGFzc2FnZSIsImlkIiwidGFncyIsInNwZWFrZXJUYWciLCJmaW5kIiwic3lzdGVtVGFnIiwicGZ4IiwiYXNEaWN0IiwiZmlsdGVyIiwibWFwIiwicmVkdWNlIiwiYSIsInRhZ0RpY3QiLCJ1bmVzY2FwZSIsInN0ciIsIndpbmRvdyIsIklORklOSVRZIiwic3ltYm9sVGFnIiwiZnJlZUdsb2JhbCIsImZyZWVTZWxmIiwicm9vdCIsImJhc2VQcm9wZXJ0eU9mIiwib2JqZWN0UHJvdG8iLCJvYmplY3RUb1N0cmluZyIsInN5bWJvbFByb3RvIiwic3ltYm9sVG9TdHJpbmciLCJiYXNlVG9TdHJpbmciLCJpc1N5bWJvbCIsImlzT2JqZWN0TGlrZSIsInRvU3RyaW5nIiwic2VsZWN0UGFzc2FnZXMiLCJzZWxlY3RDc3MiLCJzZWxlY3RKcyIsInNlbGVjdEFjdGl2ZUxpbmsiLCJzZWxlY3RBY3RpdmVCdXR0b24iLCJzZWxlY3RBY3RpdmVJbnB1dCIsInNlbGVjdEFjdGl2ZSIsInNlbGVjdEhpc3RvcnkiLCJzZWxlY3RSZXNwb25zZXMiLCJ0eXBpbmdJbmRpY2F0b3IiLCJJU19OVU1FUklDIiwiaXNOdW1lcmljIiwiVVNFUl9QQVNTQUdFX1RNUEwiLCJ0ZXh0IiwiT1RIRVJfUEFTU0FHRV9UTVBMIiwic3BlYWtlciIsImpvaW4iLCJkZWxheSIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsImN0eCIsInF1ZXJ5U2VsZWN0b3IiLCJmaW5kQWxsIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwicXVlcnlTZWxlY3RvckFsbCIsIlN0b3J5Iiwic3JjIiwidXNlclN0eWxlcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInVzZXJTY3JpcHRzIiwiZ2xvYmFsRXZhbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibWF0Y2hlcyIsImFkdmFuY2UiLCJmaW5kUGFzc2FnZSIsImdldEF0dHJpYnV0ZSIsInZhbHVlIiwic2hvd1Byb21wdCIsInN0YXJ0c0F0IiwiaWRPck5hbWUiLCJwYXNzYWdlcyIsInAiLCJ1c2VyVGV4dCIsImhpc3RvcnkiLCJsYXN0IiwiY3VycmVudCIsImV4aXN0aW5nIiwiZWxlbWVudHMiLCJhY3RpdmUiLCJyZW5kZXJVc2VyTWVzc2FnZSIsInJlbmRlclRleHRJbnB1dCIsInJlbmRlckNob2ljZXMiLCJwaWQiLCJyZW5kZXJlciIsInNjcm9sbFRvQm90dG9tIiwiZ2V0U3BlYWtlciIsInN0YXRlbWVudHMiLCJyZW5kZXIiLCJuZXh0Iiwic2hpZnQiLCJzaG93VHlwaW5nIiwiY2FsY3VsYXRlRGVsYXkiLCJoaWRlVHlwaW5nIiwidHh0IiwidHlwaW5nRGVsYXlSYXRpbyIsInJhdGUiLCJzdHlsZSIsInZpc2liaWxpdHkiLCJoaXN0Iiwic2Nyb2xsaW5nRWxlbWVudCIsInNjcm9sbFRvcCIsIm9mZnNldEhlaWdodCIsInBhbmVsIiwicmVtb3ZlQ2hvaWNlcyIsImwiLCJlc2NhcGUiLCJwbGFjZWhvbGRlciIsInNhdmVBcyIsImNiIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJwYXJzZUludCIsImVsIiwiZXZlbnQiLCJldmFsIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7Ozs7O0VBQUEsU0FBUyxlQUFlLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTtJQUM5QyxJQUFJLEVBQUUsUUFBUSxZQUFZLFdBQVcsQ0FBQyxFQUFFO01BQ3RDLE1BQU0sSUFBSSxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUMxRDtHQUNGOztFQUVELGtCQUFjLEdBQUcsZUFBZTs7RUNOaEMsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7SUFDeEMsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO01BQ2QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO1FBQzlCLEtBQUssRUFBRSxLQUFLO1FBQ1osVUFBVSxFQUFFLElBQUk7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsUUFBUSxFQUFFLElBQUk7T0FDZixDQUFDLENBQUM7S0FDSixNQUFNO01BQ0wsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUNsQjs7SUFFRCxPQUFPLEdBQUcsQ0FBQztHQUNaOztFQUVELGtCQUFjLEdBQUcsZUFBZTs7RUNmaEMsU0FBUyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUU7SUFDL0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNs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
