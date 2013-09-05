
(function() {
  var modules = window.modules || [];
  var formCache = null;
  var formFunc = function() {
    return (function() {
  var Form, FormSerializer;

  FormSerializer = require('hoarder/form/form_serializer');

  Form = (function() {
    var createElement;

    function Form(formElement) {
      this.formElement = formElement;
      this.addedElements = [];
    }

    Form.prototype.elements = function() {
      var index, _i, _ref, _ref1, _ref2, _results;

      _results = [];
      for (index = _i = 0, _ref = this.formElement.length; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
        if ((_ref1 = (_ref2 = this.formElement[index]) != null ? _ref2.nodeName : void 0) === 'INPUT' || _ref1 === 'SELECT' || _ref1 === 'TEXTAREA') {
          _results.push(this.formElement[index]);
        }
      }
      return _results;
    };

    Form.prototype.action = function() {
      return this.formElement.action;
    };

    Form.prototype.method = function() {
      return this.formElement.method;
    };

    Form.prototype.checkValidity = function() {
      return this.formElement.checkValidity();
    };

    Form.prototype.addElement = function(name, value) {
      var element;

      if (this.hasElement(name)) {
        throw new Error("'" + name + "' already exists as an element on the form.");
      }
      element = createElement(name, value);
      this.formElement.appendChild(element);
      this.addedElements.push(element);
      return element;
    };

    Form.prototype.addElements = function(elements) {
      var e, element, errors, _i, _len;

      errors = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        try {
          this.addElement(element.name, element.value);
        } catch (_error) {
          e = _error;
          errors.push(e);
        }
      }
      if (errors.length) {
        throw errors[0];
      }
    };

    Form.prototype.hasElement = function(name) {
      return this.getElement(name) != null;
    };

    Form.prototype.getElement = function(name) {
      if (this.formElement[name] instanceof HTMLElement) {
        return this.formElement[name];
      }
    };

    Form.prototype.updateAddedElement = function(name, value) {
      if (this.formElement[name] != null) {
        return this.formElement[name].value = value;
      } else {
        return this.addElement(name, value);
      }
    };

    Form.prototype.clearAddedElements = function() {
      var element, _i, _len, _ref;

      _ref = this.addedElements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        this.formElement.removeChild(element);
      }
      return this.addedElements = [];
    };

    Form.prototype.serialize = function() {
      return FormSerializer.toString(this);
    };

    createElement = function(name, value) {
      var element;

      element = document.createElement("input");
      element.type = "hidden";
      element.name = name;
      element.value = value;
      return element;
    };

    return Form;

  })();

  return Form;

}).call(this);

  };
  modules.hoarder__form__form = function() {
    if (formCache === null) {
      formCache = formFunc();
    }
    return formCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var form_serializerCache = null;
  var form_serializerFunc = function() {
    return (function() {
  var Serializer;

  Serializer = (function() {
    var isCheckable, isComplicated, isFile, isMultiSelect, removeNulls, serializeElement;

    function Serializer() {}

    Serializer.toString = function(form) {
      var element;

      return removeNulls((function() {
        var _i, _len, _ref, _results;

        _ref = form.elements();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results.push(serializeElement(element));
        }
        return _results;
      })()).join("&");
    };

    serializeElement = function(element) {
      var option;

      if (!isComplicated(element)) {
        return "" + element.name + "=" + (encodeURIComponent(element.value));
      }
      if (isCheckable(element) && element.checked) {
        return "" + element.name + "=" + (encodeURIComponent(element.value));
      }
      if (isMultiSelect(element)) {
        return ((function() {
          var _i, _len, _ref, _results;

          _ref = element.options;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            option = _ref[_i];
            if (option.selected) {
              _results.push("" + element.name + "=" + (encodeURIComponent(option.value)));
            }
          }
          return _results;
        })()).join("&");
      }
      return null;
    };

    isComplicated = function(element) {
      return isCheckable(element) || isMultiSelect(element) || isFile(element);
    };

    isCheckable = function(element) {
      var _ref;

      return element.nodeName === "INPUT" && ((_ref = element.type) === "checkbox" || _ref === "radio");
    };

    isMultiSelect = function(element) {
      return element.nodeName === "SELECT" && element.type === "select-multiple";
    };

    isFile = function(element) {
      return element.nodeName === "INPUT" && element.type === "file";
    };

    removeNulls = function(array) {
      return array.filter(function(e) {
        return e;
      });
    };

    return Serializer;

  })();

  return Serializer;

}).call(this);

  };
  modules.hoarder__form__form_serializer = function() {
    if (form_serializerCache === null) {
      form_serializerCache = form_serializerFunc();
    }
    return form_serializerCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var form_managerCache = null;
  var form_managerFunc = function() {
    return (function() {
  var Form, FormManager, FormSubmitter, FormValidator, Signal, SignalRelay;

  require('patches/event_listeners');

  require('lib/H5F');

  Signal = require("cronus/signal");

  SignalRelay = require("cronus/signal_relay");

  Form = require('hoarder/form/form');

  FormSubmitter = require('hoarder/submitter/form_submitter');

  FormValidator = require('hoarder/validator/form_validator');

  FormManager = (function() {
    var getForm, setupHoarderForm, submit;

    FormManager.create = function(pollingUrl, pollFrequency) {
      if (pollingUrl == null) {
        pollingUrl = "";
      }
      if (pollFrequency == null) {
        pollFrequency = 1000;
      }
      return new this(FormSubmitter.create(pollingUrl, pollFrequency), FormValidator.create());
    };

    function FormManager(formSubmitter, formValidator) {
      this.formSubmitter = formSubmitter;
      this.formValidator = formValidator;
      this.validatedWithErrors = new Signal();
      this.submittedWithSuccess = new SignalRelay(this.formSubmitter.submittedWithSuccess);
      this.submittedWithError = new SignalRelay(this.formSubmitter.submittedWithError);
      this._forms = [];
      this._listeners = {};
    }

    FormManager.prototype.manage = function(formId, type) {
      var form;

      if (type == null) {
        type = 'simple';
      }
      if (getForm.call(this, formId) != null) {
        throw new Error("'" + formId + "' is already a managed form.");
      }
      form = setupHoarderForm.call(this, formId, type);
      this._forms.push(form);
      return form;
    };

    FormManager.prototype.release = function(formId) {
      var form;

      form = getForm.call(this, formId);
      form.formElement.removeEventListener('submit', this._listeners[formId]);
      delete this._listeners[formId];
      return this._forms.splice(this._forms.indexOf(form), 1);
    };

    getForm = function(formId) {
      var form, _i, _len, _ref;

      _ref = this._forms;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        form = _ref[_i];
        if (form.formElement.id === formId) {
          return form;
        }
      }
    };

    submit = function(form, type) {
      if (this.formValidator.validateForm(form)) {
        return this.formSubmitter.submit(form, type);
      } else {
        return this.validatedWithErrors.dispatch(form);
      }
    };

    setupHoarderForm = function(formId, type) {
      var form, formElement,
        _this = this;

      formElement = document.getElementById(formId);
      H5F.setup(formElement);
      form = new Form(formElement);
      formElement.addEventListener('submit', this._listeners[formId] = function(event) {
        event.preventDefault();
        return submit.call(_this, form, type);
      });
      return form;
    };

    return FormManager;

  })();

  return FormManager;

}).call(this);

  };
  modules.hoarder__form_manager = function() {
    if (form_managerCache === null) {
      form_managerCache = form_managerFunc();
    }
    return form_managerCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var form_submitterCache = null;
  var form_submitterFunc = function() {
    return (function() {
  var FormSubmitter, MultiSignalRelay, PollingSubmitter, SimpleSubmitter;

  MultiSignalRelay = require("cronus/multi_signal_relay");

  SimpleSubmitter = require("hoarder/submitter/submitters/simple_submitter");

  PollingSubmitter = require("hoarder/submitter/submitters/polling_submitter");

  FormSubmitter = (function() {
    FormSubmitter.create = function(pollingUrl, pollFrequency) {
      if (pollFrequency == null) {
        pollFrequency = 1000;
      }
      return new this([new SimpleSubmitter(), new PollingSubmitter(pollingUrl, pollFrequency)]);
    };

    function FormSubmitter(submitters) {
      var errorSignals, submitter, successSignals;

      this.submitters = submitters;
      successSignals = (function() {
        var _i, _len, _ref, _results;

        _ref = this.submitters;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          submitter = _ref[_i];
          _results.push(submitter.submittedWithSuccess);
        }
        return _results;
      }).call(this);
      errorSignals = (function() {
        var _i, _len, _ref, _results;

        _ref = this.submitters;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          submitter = _ref[_i];
          _results.push(submitter.submittedWithError);
        }
        return _results;
      }).call(this);
      this.submittedWithSuccess = new MultiSignalRelay(successSignals);
      this.submittedWithError = new MultiSignalRelay(errorSignals);
    }

    FormSubmitter.prototype.submit = function(form, type) {
      var submitter, _i, _len, _ref, _results;

      _ref = this.submitters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        submitter = _ref[_i];
        if (submitter.canSubmit(type)) {
          submitter.submit(form);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return FormSubmitter;

  })();

  return FormSubmitter;

}).call(this);

  };
  modules.hoarder__submitter__form_submitter = function() {
    if (form_submitterCache === null) {
      form_submitterCache = form_submitterFunc();
    }
    return form_submitterCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var base_submitterCache = null;
  var base_submitterFunc = function() {
    return (function() {
  var BaseSubmitter, Signal;

  Signal = require('cronus/signal');

  BaseSubmitter = (function() {
    function BaseSubmitter() {
      this.submittedWithSuccess = new Signal();
      this.submittedWithError = new Signal();
    }

    BaseSubmitter.prototype.canSubmit = function(type) {
      return type === this.type;
    };

    return BaseSubmitter;

  })();

  return BaseSubmitter;

}).call(this);

  };
  modules.hoarder__submitter__submitters__base_submitter = function() {
    if (base_submitterCache === null) {
      base_submitterCache = base_submitterFunc();
    }
    return base_submitterCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var polling_submitterCache = null;
  var polling_submitterFunc = function() {
    return (function() {
  var BaseSubmitter, PollingSubmitter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('lib/reqwest');

  BaseSubmitter = require("hoarder/submitter/submitters/base_submitter");

  PollingSubmitter = (function(_super) {
    var pollSuccess;

    __extends(PollingSubmitter, _super);

    function PollingSubmitter(pollUrl, pollFrequency) {
      this.pollUrl = pollUrl;
      this.pollFrequency = pollFrequency;
      this.poll = __bind(this.poll, this);
      PollingSubmitter.__super__.constructor.call(this);
      this.type = 'polling';
    }

    PollingSubmitter.prototype.submit = function(form) {
      var _this = this;

      return reqwest({
        url: form.action(),
        method: form.method(),
        data: form.serialize(),
        success: function(data) {
          return _this.poll(form, data.processId);
        },
        error: function(xhr, text) {
          return _this.submittedWithError.dispatch(form, text);
        }
      });
    };

    PollingSubmitter.prototype.poll = function(form, processId) {
      var _this = this;

      return reqwest({
        url: this.pollUrl,
        method: "POST",
        data: "processId=" + processId,
        success: function(data) {
          return pollSuccess.call(_this, form, processId, data);
        },
        error: function(xhr, text) {
          return _this.submittedWithError.dispatch(form, text);
        }
      });
    };

    pollSuccess = function(form, processId, data) {
      var _this = this;

      if (data.processCompleted) {
        return this.submittedWithSuccess.dispatch(form, data.processData);
      } else {
        return setTimeout(function() {
          return _this.poll(form, data.processId);
        }, this.pollFrequency);
      }
    };

    return PollingSubmitter;

  })(BaseSubmitter);

  return PollingSubmitter;

}).call(this);

  };
  modules.hoarder__submitter__submitters__polling_submitter = function() {
    if (polling_submitterCache === null) {
      polling_submitterCache = polling_submitterFunc();
    }
    return polling_submitterCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var simple_submitterCache = null;
  var simple_submitterFunc = function() {
    return (function() {
  var BaseSubmitter, SimpleSubmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('lib/reqwest');

  BaseSubmitter = require('hoarder/submitter/submitters/base_submitter');

  SimpleSubmitter = (function(_super) {
    __extends(SimpleSubmitter, _super);

    function SimpleSubmitter() {
      SimpleSubmitter.__super__.constructor.call(this);
      this.type = 'simple';
    }

    SimpleSubmitter.prototype.submit = function(form) {
      var _this = this;

      return reqwest({
        url: form.action(),
        method: form.method(),
        data: form.serialize(),
        success: function(data) {
          return _this.submittedWithSuccess.dispatch(form, data);
        },
        error: function(xhr, text) {
          return _this.submittedWithError.dispatch(form, text);
        }
      });
    };

    return SimpleSubmitter;

  })(BaseSubmitter);

  return SimpleSubmitter;

}).call(this);

  };
  modules.hoarder__submitter__submitters__simple_submitter = function() {
    if (simple_submitterCache === null) {
      simple_submitterCache = simple_submitterFunc();
    }
    return simple_submitterCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var base_constraintCache = null;
  var base_constraintFunc = function() {
    return (function() {
  var BaseConstraint;

  BaseConstraint = (function() {
    function BaseConstraint() {
      this.type = null;
    }

    BaseConstraint.prototype.canHandle = function(type) {
      return type === this.type;
    };

    BaseConstraint.prototype.handle = function(element, type) {
      if (!this.rulePasses(element)) {
        return element.setCustomValidity(this.errorMessage(element));
      }
    };

    return BaseConstraint;

  })();

  return BaseConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__base_constraint = function() {
    if (base_constraintCache === null) {
      base_constraintCache = base_constraintFunc();
    }
    return base_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var credit_card_constraintCache = null;
  var credit_card_constraintFunc = function() {
    return (function() {
  var BaseConstraint, CreditCardConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require('hoarder/validator/constraints/base_constraint');

  CreditCardConstraint = (function(_super) {
    __extends(CreditCardConstraint, _super);

    function CreditCardConstraint() {
      this.type = "creditcard";
    }

    CreditCardConstraint.prototype.rulePasses = function(element) {
      return element.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
    };

    CreditCardConstraint.prototype.errorMessage = function() {
      return "Please enter a valid credit card number.";
    };

    return CreditCardConstraint;

  })(BaseConstraint);

  return CreditCardConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__credit_card_constraint = function() {
    if (credit_card_constraintCache === null) {
      credit_card_constraintCache = credit_card_constraintFunc();
    }
    return credit_card_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var form_validatorCache = null;
  var form_validatorFunc = function() {
    return (function() {
  var CreditCardConstraint, FormValidator;

  CreditCardConstraint = require("hoarder/validator/constraints/credit_card_constraint");

  FormValidator = (function() {
    var clearValidationErrorsOn, isValid, markValidityAs;

    FormValidator.libraryConstraints = [new CreditCardConstraint()];

    FormValidator.create = function() {
      return new this(FormValidator.libraryConstraints);
    };

    function FormValidator(constraints) {
      this.constraints = constraints;
    }

    FormValidator.prototype.validateForm = function(form) {
      var element, _i, _len, _ref;

      _ref = form.elements();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        this.validateElement(element);
      }
      return form.checkValidity();
    };

    FormValidator.prototype.validateElement = function(element) {
      var constraint, type, _i, _len, _ref;

      clearValidationErrorsOn(element);
      type = element.getAttribute("type");
      _ref = this.constraints;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        constraint = _ref[_i];
        if (constraint.canHandle(type)) {
          constraint.handle(element, type);
        }
        if (!isValid(element)) {
          break;
        }
      }
      return isValid(element);
    };

    clearValidationErrorsOn = function(element) {
      return markValidityAs(element, "");
    };

    markValidityAs = function(element, message) {
      return element.setCustomValidity(message);
    };

    isValid = function(element) {
      return element.validity.valid;
    };

    return FormValidator;

  })();

  return FormValidator;

}).call(this);

  };
  modules.hoarder__validator__form_validator = function() {
    if (form_validatorCache === null) {
      form_validatorCache = form_validatorFunc();
    }
    return form_validatorCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var H5FCache = null;
  var H5FFunc = function() {
    /*! H5F
* https://github.com/ryanseddon/H5F/
* Copyright (c) Ryan Seddon | Licensed MIT */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.H5F = factory();
    }
}(this, function () {

    var d = document,
        field = d.createElement("input"),
        emailPatt = /^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        urlPatt = /[a-z][\-\.+a-z]*:\/\//i,
        nodes = /^(input|select|textarea)$/i,
        isSubmit, bypassSubmit, usrPatt, curEvt, args,
        // Methods
        setup, validation, validity, checkField, bypassChecks, checkValidity, setCustomValidity, support, pattern, placeholder, range, required, valueMissing, listen, unlisten, preventActions, getTarget, addClass, removeClass, isHostMethod, isSiblingChecked;
    
    setup = function(form, settings) {
        var isCollection = !form.nodeType || false;
        
        var opts = {
            validClass : "valid",
            invalidClass : "error",
            requiredClass : "required",
            placeholderClass : "placeholder"
        };

        if(typeof settings === "object") {
            for (var i in opts) {
                if(typeof settings[i] === "undefined") { settings[i] = opts[i]; }
            }
        }
        
        args = settings || opts;
        
        if(isCollection) {
            for(var k=0,len=form.length;k<len;k++) {
                validation(form[k]);
            }
        } else {
            validation(form);
        }
    };
    
    validation = function(form) {
        var f = form.elements,
            flen = f.length,
            isRequired,
            noValidate = !!(form.attributes["novalidate"]);
        
        listen(form,"invalid",checkField,true);
        listen(form,"blur",checkField,true);
        listen(form,"input",checkField,true);
        listen(form,"keyup",checkField,true);
        listen(form,"focus",checkField,true);
        listen(form,"change",checkField,true);
        listen(form,"click",bypassChecks,true);
        
        listen(form,"submit",function(e){
            isSubmit = true;
            if(!bypassSubmit) {
                if(!noValidate && !form.checkValidity()) {
                    preventActions(e);
                }
            }
        },false);
        
        if(!support()) {
            form.checkValidity = function() { return checkValidity(form); };
            
            while(flen--) {
                isRequired = !!(f[flen].attributes["required"]);
                // Firefox includes fieldsets inside elements nodelist so we filter it out.
                if(f[flen].nodeName.toLowerCase() !== "fieldset") {
                    validity(f[flen]); // Add validity object to field
                }
            }
        }
    };
    validity = function(el) {
        var elem = el,
            missing = valueMissing(elem),
            attrs = {
                type: elem.getAttribute("type"),
                pattern: elem.getAttribute("pattern"),
                placeholder: elem.getAttribute("placeholder")
            },
            isType = /^(email|url)$/i,
            evt = /^(input|keyup)$/i,
            fType = ((isType.test(attrs.type)) ? attrs.type : ((attrs.pattern) ? attrs.pattern : false)),
            patt = pattern(elem,fType),
            step = range(elem,"step"),
            min = range(elem,"min"),
            max = range(elem,"max"),
            customError = !( elem.validationMessage === "" || elem.validationMessage === undefined );
        
        elem.checkValidity = function() { return checkValidity.call(this,elem); };
        elem.setCustomValidity = function(msg) { setCustomValidity.call(elem,msg); };
        
        elem.validity = {
            valueMissing: missing,
            patternMismatch: patt,
            rangeUnderflow: min,
            rangeOverflow: max,
            stepMismatch: step,
            customError: customError,
            valid: (!missing && !patt && !step && !min && !max && !customError)
        };
        
        if(attrs.placeholder && !evt.test(curEvt)) { placeholder(elem); }
    };
    checkField = function(e) {
        var el = getTarget(e) || e, // checkValidity method passes element not event
            events = /^(input|keyup|focusin|focus|change)$/i,
            ignoredTypes = /^(submit|image|button|reset)$/i,
            specialTypes = /^(checkbox|radio)$/i,
            checkForm = true;
        
        if(nodes.test(el.nodeName) && !(ignoredTypes.test(el.type) || ignoredTypes.test(el.nodeName))) {
            curEvt = e.type;

            if(!support()) {
                validity(el);
            }

            if(el.validity.valid && (el.value !== "" || specialTypes.test(el.type)) || (el.value !== el.getAttribute("placeholder") && el.validity.valid)) {
                removeClass(el,[args.invalidClass,args.requiredClass]);
                addClass(el,args.validClass);
            } else if(!events.test(curEvt)) {
                if(el.validity.valueMissing) {
                    removeClass(el,[args.invalidClass,args.validClass]);
                    addClass(el,args.requiredClass);
                } else if(!el.validity.valid) {
                    removeClass(el,[args.validClass,args.requiredClass]);
                    addClass(el,args.invalidClass);
                }
            } else if(el.validity.valueMissing) {
                removeClass(el,[args.requiredClass,args.invalidClass,args.validClass]);
            }
            if(curEvt === "input" && checkForm) {
                // If input is triggered remove the keyup event
                unlisten(el.form,"keyup",checkField,true);
                checkForm = false;
            }
        }
    };
    checkValidity = function(el) {
        var f, ff, isRequired, hasPattern, invalid = false;
        
        if(el.nodeName.toLowerCase() === "form") {
            f = el.elements;
            
            for(var i = 0,len = f.length;i < len;i++) {
                ff = f[i];
                
                isRequired = !!(ff.attributes["required"]);
                hasPattern = !!(ff.attributes["pattern"]);
                
                if(ff.nodeName.toLowerCase() !== "fieldset" && (isRequired || hasPattern && isRequired)) {
                    checkField(ff);
                    if(!ff.validity.valid && !invalid) {
                        if(isSubmit) { // If it's not a submit event the field shouldn't be focused
                            ff.focus();
                        }
                        invalid = true;
                    }
                }
            }
            return !invalid;
        } else {
            checkField(el);
            return el.validity.valid;
        }
    };
    setCustomValidity = function(msg) {
        var el = this;
            
        el.validationMessage = msg;
    };
    
    bypassChecks = function(e) {
        // handle formnovalidate attribute
        var el = getTarget(e);

        if(el.attributes["formnovalidate"] && el.type === "submit") {
            bypassSubmit = true;
        }
    };

    support = function() {
        return (isHostMethod(field,"validity") && isHostMethod(field,"checkValidity"));
    };

    // Create helper methods to emulate attributes in older browsers
    pattern = function(el, type) {
        if(type === "email") {
            return !emailPatt.test(el.value);
        } else if(type === "url") {
            return !urlPatt.test(el.value);
        } else if(!type) {
            return false;
        } else {
            var placeholder = el.getAttribute("placeholder"),
                val = el.value;
            
            usrPatt = new RegExp('^(?:' + type + ')$');
            
            if(val === placeholder) {
                return false;
            } else if(val === "") {
                return false;
            } else {
                return !usrPatt.test(el.value);
            }
        }
    };
    placeholder = function(el) {
        var attrs = { placeholder: el.getAttribute("placeholder") },
            focus = /^(focus|focusin|submit)$/i,
            node = /^(input|textarea)$/i,
            ignoredType = /^password$/i,
            isNative = !!("placeholder" in field);
        
        if(!isNative && node.test(el.nodeName) && !ignoredType.test(el.type)) {
            if(el.value === "" && !focus.test(curEvt)) {
                el.value = attrs.placeholder;
                listen(el.form,'submit', function () {
                  curEvt = 'submit';
                  placeholder(el);
                }, true);
                addClass(el,args.placeholderClass);
            } else if(el.value === attrs.placeholder && focus.test(curEvt)) {
                el.value = "";
                removeClass(el,args.placeholderClass);
            }
        }
    };
    range = function(el, type) {
        // Emulate min, max and step
        var min = parseInt(el.getAttribute("min"),10) || 0,
            max = parseInt(el.getAttribute("max"),10) || false,
            step = parseInt(el.getAttribute("step"),10) || 1,
            val = parseInt(el.value,10),
            mismatch = (val-min)%step;
        
        if(!valueMissing(el) && !isNaN(val)) {
            if(type === "step") {
                return (el.getAttribute("step")) ? (mismatch !== 0) : false;
            } else if(type === "min") {
                return (el.getAttribute("min")) ? (val < min) : false;
            } else if(type === "max") {
                return (el.getAttribute("max")) ? (val > max) : false;
            }
        } else if(el.getAttribute("type") === "number") {
            return true;
        } else {
            return false;
        }
    };
    required = function(el) {
        var required = !!(el.attributes["required"]);
        
        return (required) ? valueMissing(el) : false;
    };
    valueMissing = function(el) {
        var placeholder = el.getAttribute("placeholder"),
            specialTypes = /^(checkbox|radio)$/i,
            isRequired = !!(el.attributes["required"]);
        return !!(isRequired && (el.value === "" || el.value === placeholder || (specialTypes.test(el.type) && !isSiblingChecked(el))));
    };
    
    /* Util methods */
    listen = function (node,type,fn,capture) {
        if(isHostMethod(window,"addEventListener")) {
            /* FF & Other Browsers */
            node.addEventListener( type, fn, capture );
        } else if(isHostMethod(window,"attachEvent") && typeof window.event !== "undefined") {
            /* Internet Explorer way */
            if(type === "blur") {
                type = "focusout";
            } else if(type === "focus") {
                type = "focusin";
            }
            node.attachEvent( "on" + type, fn );
        }
    };
    unlisten = function (node,type,fn,capture) {
        if(isHostMethod(window,"removeEventListener")) {
            /* FF & Other Browsers */
            node.removeEventListener( type, fn, capture );
        } else if(isHostMethod(window,"detachEvent") && typeof window.event !== "undefined") {
            /* Internet Explorer way */
            node.detachEvent( "on" + type, fn );
        }
    };
    preventActions = function (evt) {
        evt = evt || window.event;
        
        if(evt.stopPropagation && evt.preventDefault) {
            evt.stopPropagation();
            evt.preventDefault();
        } else {
            evt.cancelBubble = true;
            evt.returnValue = false;
        }
    };
    getTarget = function (evt) {
        evt = evt || window.event;
        return evt.target || evt.srcElement;
    };
    addClass = function (e,c) {
        var re;
        if (!e.className) {
            e.className = c;
        }
        else {
            re = new RegExp('(^|\\s)' + c + '(\\s|$)');
            if (!re.test(e.className)) { e.className += ' ' + c; }
        }
    };
    removeClass = function (e,c) {
        var re, m, arr = (typeof c === "object") ? c.length : 1, len = arr;
        if (e.className) {
            if (e.className === c) {
                e.className = '';
            } else {
                while(arr--) {
                    re = new RegExp('(^|\\s)' + ((len > 1) ? c[arr] : c) + '(\\s|$)');
                    m = e.className.match(re);
                    if (m && m.length === 3) { e.className = e.className.replace(re, (m[1] && m[2])?' ':''); }
                }
            }
        }
    };
    isHostMethod = function(o, m) {
        var t = typeof o[m], reFeaturedMethod = new RegExp('^function|object$', 'i');
        return !!((reFeaturedMethod.test(t) && o[m]) || t === 'unknown');
    };
    /* Checking if one of the radio siblings is checked */
    isSiblingChecked = function(el) {
        var siblings = document.getElementsByName(el.name);
        for(var i=0; i<siblings.length; i++){
            if(siblings[i].checked){
                return true;
            }
        }
        return false;
    };

    // Since all methods are only used internally no need to expose globally
    return {
        setup: setup
    };

}));

  };
  modules.lib__H5F = function() {
    if (H5FCache === null) {
      H5FCache = H5FFunc();
    }
    return H5FCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var reqwestCache = null;
  var reqwestFunc = function() {
    /*!
  * Reqwest! A general purpose XHR connection manager
  * (c) Dustin Diaz 2013
  * https://github.com/ded/reqwest
  * license MIT
  */
!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , twoHundo = /^20\d$/
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          contentType: 'application/x-www-form-urlencoded'
        , requestedWith: xmlHttpRequest
        , accept: {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , xml:  'application/xml, text/xml'
            , html: 'text/html'
            , text: 'text/plain'
            , json: 'application/json, text/javascript'
            , js:   'application/javascript, text/javascript'
          }
      }

    , xhr = win[xmlHttpRequest]
        ? function () {
            return new XMLHttpRequest()
          }
        : function () {
            return new ActiveXObject('Microsoft.XMLHTTP')
          }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (twoHundo.test(r.request.status))
          success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o.headers || {}
      , h

    headers.Accept = headers.Accept
      || defaultHeaders.accept[o.type]
      || defaultHeaders.accept['*']

    // breaks cross-origin requests with legacy browsers
    if (!o.crossOrigin && !headers[requestedWith]) headers[requestedWith] = defaultHeaders.requestedWith
    if (!headers[contentType]) headers[contentType] = o.contentType || defaultHeaders.contentType
    for (h in headers)
      headers.hasOwnProperty(h) && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o.withCredentials !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o.withCredentials
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o.jsonpCallback || 'callback' // the 'callback' key
      , cbval = o.jsonpCallbackName || reqwest.getcallbackPrefix(reqId)
      // , cbval = o.jsonpCallbackName || ('reqwest_' + reqId) // the 'callback' value
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      //
      // if this hack is used in IE10 jsonp callback are never called
      script.event = 'onclick'
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o.method || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o.url
      // convert non-string objects to query-string form unless o.processData is false
      , data = (o.processData !== false && o.data && typeof o.data !== 'string')
        ? reqwest.toQueryString(o.data)
        : (o.data || null)
      , http

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o.type == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o.type == 'jsonp') return handleJsonp(o, fn, err, url)

    http = xhr()
    http.open(method, url, o.async === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    http.onreadystatechange = handleReadyState(this, fn, err)
    o.before && o.before(http)
    http.send(data)
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(url) {
    var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/)
    return m ? m[1] : 'js'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o.url
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this
      , type = o.type || setType(this.url)

    fn = fn || function () {}

    if (o.timeout) {
      this.timeout = setTimeout(function () {
        self.abort()
      }, o.timeout)
    }

    if (o.success) {
      this._fulfillmentHandlers.push(function () {
        o.success.apply(o, arguments)
      })
    }

    if (o.error) {
      this._errorHandlers.push(function () {
        o.error.apply(o, arguments)
      })
    }

    if (o.complete) {
      this._completeHandlers.push(function () {
        o.complete.apply(o, arguments)
      })
    }

    function complete (resp) {
      o.timeout && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      while (self._fulfillmentHandlers.length > 0) {
        self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function error(resp, msg, t) {
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o.disabled)
            cb(n, normalize(o.attributes.value && o.attributes.value.specified ? o.value : o.text))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i].name, o[i].value)
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o.type && (o.method = o.type) && delete o.type
      o.dataType && (o.type = o.dataType)
      o.jsonpCallback && (o.jsonpCallbackName = o.jsonpCallback) && delete o.jsonpCallback
      o.jsonp && (o.jsonpCallback = o.jsonp)
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

  };
  modules.lib__reqwest = function() {
    if (reqwestCache === null) {
      reqwestCache = reqwestFunc();
    }
    return reqwestCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var event_listenersCache = null;
  var event_listenersFunc = function() {
    // this only brings addEventListener into IE8

(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (listener.handleEvent) {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();
  };
  modules.patches__event_listeners = function() {
    if (event_listenersCache === null) {
      event_listenersCache = event_listenersFunc();
    }
    return event_listenersCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  window.require = function(path) {
    var transformedPath = path.replace(/\//g, '__');
    if (transformedPath.indexOf('__') === -1) {
      transformedPath = '__' + transformedPath;
    }
    var factory = modules[transformedPath];
    if (factory === null) {
      return null;
    } else {
      return modules[transformedPath]();
    }
  };
})();

(function() {
  var modules = window.modules || [];
  var multi_signal_relayCache = null;
  var multi_signal_relayFunc = function() {
    return (function() {
  var MultiSignalRelay, Signal,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Signal = require("cronus/signal");

  MultiSignalRelay = (function(_super) {
    __extends(MultiSignalRelay, _super);

    function MultiSignalRelay(signals) {
      var signal, _i, _len;

      MultiSignalRelay.__super__.constructor.call(this);
      for (_i = 0, _len = signals.length; _i < _len; _i++) {
        signal = signals[_i];
        signal.add(this.dispatch);
      }
    }

    MultiSignalRelay.prototype.applyListeners = function(rest) {
      var listener, _i, _len, _ref, _results;

      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(listener.apply(listener, rest));
      }
      return _results;
    };

    return MultiSignalRelay;

  })(Signal);

  return MultiSignalRelay;

}).call(this);

  };
  modules.cronus__multi_signal_relay = function() {
    if (multi_signal_relayCache === null) {
      multi_signal_relayCache = multi_signal_relayFunc();
    }
    return multi_signal_relayCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var signalCache = null;
  var signalFunc = function() {
    return (function() {
  var Signal,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Signal = (function() {
    function Signal() {
      this.dispatch = __bind(this.dispatch, this);      this.isApplyingListeners = false;
      this.listeners = [];
      this.onceListeners = [];
      this.removeCache = [];
    }

    Signal.prototype.add = function(listener) {
      return this.listeners.push(listener);
    };

    Signal.prototype.addOnce = function(listener) {
      this.onceListeners.push(listener);
      return this.add(listener);
    };

    Signal.prototype.remove = function(listener) {
      if (this.isApplyingListeners) {
        return this.removeCache.push(listener);
      } else {
        if (this.listeners.indexOf(listener) !== -1) {
          return this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
      }
    };

    Signal.prototype.removeAll = function() {
      return this.listeners = [];
    };

    Signal.prototype.numListeners = function() {
      return this.listeners.length;
    };

    Signal.prototype.dispatch = function() {
      var rest;

      rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.isApplyingListeners = true;
      this.applyListeners(rest);
      this.removeOnceListeners();
      this.isApplyingListeners = false;
      return this.clearRemoveCache();
    };

    Signal.prototype.applyListeners = function(rest) {
      var listener, _i, _len, _ref, _results;

      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(listener.apply(listener, rest));
      }
      return _results;
    };

    Signal.prototype.removeOnceListeners = function() {
      var listener, _i, _len, _ref;

      _ref = this.onceListeners;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        this.remove(listener);
      }
      return this.onceListeners = [];
    };

    Signal.prototype.clearRemoveCache = function() {
      var listener, _i, _len, _ref;

      _ref = this.removeCache;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        this.remove(listener);
      }
      return this.removeCache = [];
    };

    return Signal;

  })();

  return Signal;

}).call(this);

  };
  modules.cronus__signal = function() {
    if (signalCache === null) {
      signalCache = signalFunc();
    }
    return signalCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var signal_relayCache = null;
  var signal_relayFunc = function() {
    return (function() {
  var Signal, SignalRelay,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Signal = require("cronus/signal");

  SignalRelay = (function(_super) {
    __extends(SignalRelay, _super);

    function SignalRelay(signal) {
      SignalRelay.__super__.constructor.call(this);
      signal.add(this.dispatch);
    }

    SignalRelay.prototype.applyListeners = function(rest) {
      var listener, _i, _len, _ref, _results;

      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(listener.apply(listener, rest));
      }
      return _results;
    };

    return SignalRelay;

  })(Signal);

  return SignalRelay;

}).call(this);

  };
  modules.cronus__signal_relay = function() {
    if (signal_relayCache === null) {
      signal_relayCache = signal_relayFunc();
    }
    return signal_relayCache;
  };
  window.modules = modules;
})();
