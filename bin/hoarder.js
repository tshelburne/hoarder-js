
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

  Signal = require("cronus/signal");

  SignalRelay = require("cronus/signal_relay");

  Form = require('hoarder/form/form');

  FormSubmitter = require('hoarder/submitter/form_submitter');

  FormValidator = require('hoarder/validator/form_validator');

  FormManager = (function() {
    var getForm, submit;

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
      var form, formElement,
        _this = this;

      if (type == null) {
        type = 'simple';
      }
      if (getForm.call(this, formId) != null) {
        throw new Error("'" + formId + "' is already a managed form.");
      }
      formElement = document.getElementById(formId);
      form = new Form(formElement);
      formElement.addEventListener('submit', this._listeners[formId] = function(event) {
        event.preventDefault();
        return submit.call(_this, form, type);
      });
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
        url: form.action,
        type: form.method,
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
        type: "POST",
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
        url: form.action,
        type: form.method,
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
  var alpha_constraintCache = null;
  var alpha_constraintFunc = function() {
    return (function() {
  var AlphaConstraint, BaseConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require('hoarder/validator/constraints/base_constraint');

  AlphaConstraint = (function(_super) {
    __extends(AlphaConstraint, _super);

    function AlphaConstraint() {
      this.type = "alpha";
    }

    AlphaConstraint.prototype.rulePasses = function(element) {
      return element.value.match(/^[A-Za-z\s]*$/);
    };

    AlphaConstraint.prototype.errorMessage = function() {
      return "This field only accepts numbers and characters (0-9, A-Z, a-z).";
    };

    return AlphaConstraint;

  })(BaseConstraint);

  return AlphaConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__alpha_constraint = function() {
    if (alpha_constraintCache === null) {
      alpha_constraintCache = alpha_constraintFunc();
    }
    return alpha_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var alphanumeric_constraintCache = null;
  var alphanumeric_constraintFunc = function() {
    return (function() {
  var AlphanumericConstraint, BaseConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require('hoarder/validator/constraints/base_constraint');

  AlphanumericConstraint = (function(_super) {
    __extends(AlphanumericConstraint, _super);

    function AlphanumericConstraint() {
      this.type = "alphanumeric";
    }

    AlphanumericConstraint.prototype.rulePasses = function(element) {
      return element.value.match(/^[A-Za-z0-9\s]*$/);
    };

    AlphanumericConstraint.prototype.errorMessage = function() {
      return "This field only accepts numbers and characters (0-9, A-Z, a-z).";
    };

    return AlphanumericConstraint;

  })(BaseConstraint);

  return AlphanumericConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__alphanumeric_constraint = function() {
    if (alphanumeric_constraintCache === null) {
      alphanumeric_constraintCache = alphanumeric_constraintFunc();
    }
    return alphanumeric_constraintCache;
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

    BaseConstraint.prototype.canHandle = function(rule) {
      return rule.type === this.type;
    };

    BaseConstraint.prototype.handle = function(element, rule) {
      if (!this.rulePasses(element, rule)) {
        return element.setCustomValidity(this.errorMessage(rule, element));
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
      this.type = "creditCard";
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
  var email_constraintCache = null;
  var email_constraintFunc = function() {
    return (function() {
  var BaseConstraint, EmailConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require('hoarder/validator/constraints/base_constraint');

  EmailConstraint = (function(_super) {
    __extends(EmailConstraint, _super);

    function EmailConstraint() {
      this.type = "email";
    }

    EmailConstraint.prototype.rulePasses = function(element) {
      return element.value.match(/^([a-zA-Z0-9_-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/i);
    };

    EmailConstraint.prototype.errorMessage = function() {
      return "Please enter a valid email address.";
    };

    return EmailConstraint;

  })(BaseConstraint);

  return EmailConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__email_constraint = function() {
    if (email_constraintCache === null) {
      email_constraintCache = email_constraintFunc();
    }
    return email_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var max_length_constraintCache = null;
  var max_length_constraintFunc = function() {
    return (function() {
  var BaseConstraint, MaxLengthConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require("hoarder/validator/constraints/base_constraint");

  MaxLengthConstraint = (function(_super) {
    __extends(MaxLengthConstraint, _super);

    function MaxLengthConstraint() {
      this.type = "maxLength";
    }

    MaxLengthConstraint.prototype.rulePasses = function(element, rule) {
      return element.value.length <= rule.context;
    };

    MaxLengthConstraint.prototype.errorMessage = function(rule) {
      return "The maximum length of this field is " + rule.context + ".";
    };

    return MaxLengthConstraint;

  })(BaseConstraint);

  return MaxLengthConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__max_length_constraint = function() {
    if (max_length_constraintCache === null) {
      max_length_constraintCache = max_length_constraintFunc();
    }
    return max_length_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var min_length_constraintCache = null;
  var min_length_constraintFunc = function() {
    return (function() {
  var BaseConstraint, MinLengthConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require("hoarder/validator/constraints/base_constraint");

  MinLengthConstraint = (function(_super) {
    __extends(MinLengthConstraint, _super);

    function MinLengthConstraint() {
      this.type = "minLength";
    }

    MinLengthConstraint.prototype.rulePasses = function(element, rule) {
      return element.value.length >= rule.context;
    };

    MinLengthConstraint.prototype.errorMessage = function(rule) {
      return "The minimum length of this field is " + rule.context + ".";
    };

    return MinLengthConstraint;

  })(BaseConstraint);

  return MinLengthConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__min_length_constraint = function() {
    if (min_length_constraintCache === null) {
      min_length_constraintCache = min_length_constraintFunc();
    }
    return min_length_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var numeric_constraintCache = null;
  var numeric_constraintFunc = function() {
    return (function() {
  var BaseConstraint, NumericConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require("hoarder/validator/constraints/base_constraint");

  NumericConstraint = (function(_super) {
    __extends(NumericConstraint, _super);

    function NumericConstraint() {
      this.type = "numeric";
    }

    NumericConstraint.prototype.rulePasses = function(element) {
      return element.value.match(/^[0-9]*$/);
    };

    NumericConstraint.prototype.errorMessage = function() {
      return "This field only accepts numbers (0-9).";
    };

    return NumericConstraint;

  })(BaseConstraint);

  return NumericConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__numeric_constraint = function() {
    if (numeric_constraintCache === null) {
      numeric_constraintCache = numeric_constraintFunc();
    }
    return numeric_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var phone_constraintCache = null;
  var phone_constraintFunc = function() {
    return (function() {
  var BaseConstraint, PhoneConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require('hoarder/validator/constraints/base_constraint');

  PhoneConstraint = (function(_super) {
    __extends(PhoneConstraint, _super);

    function PhoneConstraint() {
      this.type = "phone";
    }

    PhoneConstraint.prototype.rulePasses = function(element) {
      return element.value.match(/^\d?[.(\-]?\d\d\d[.)\-]?\d\d\d[.\-]?\d\d\d\d$/);
    };

    PhoneConstraint.prototype.errorMessage = function() {
      return "Please enter a valid phone number.";
    };

    return PhoneConstraint;

  })(BaseConstraint);

  return PhoneConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__phone_constraint = function() {
    if (phone_constraintCache === null) {
      phone_constraintCache = phone_constraintFunc();
    }
    return phone_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var required_constraintCache = null;
  var required_constraintFunc = function() {
    return (function() {
  var BaseConstraint, RequiredConstraint,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseConstraint = require('hoarder/validator/constraints/base_constraint');

  RequiredConstraint = (function(_super) {
    __extends(RequiredConstraint, _super);

    function RequiredConstraint() {
      this.type = "required";
    }

    RequiredConstraint.prototype.rulePasses = function(element) {
      return (element.value != null) && element.value !== "";
    };

    RequiredConstraint.prototype.errorMessage = function() {
      return "This field is required.";
    };

    return RequiredConstraint;

  })(BaseConstraint);

  return RequiredConstraint;

}).call(this);

  };
  modules.hoarder__validator__constraints__required_constraint = function() {
    if (required_constraintCache === null) {
      required_constraintCache = required_constraintFunc();
    }
    return required_constraintCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var form_validatorCache = null;
  var form_validatorFunc = function() {
    return (function() {
  var AlphaConstraint, AlphanumericConstraint, CreditCardConstraint, EmailConstraint, FormValidator, MaxLengthConstraint, MinLengthConstraint, NumericConstraint, PhoneConstraint, RequiredConstraint, ValidationRule;

  ValidationRule = require('hoarder/validator/rules/validation_rule');

  AlphaConstraint = require("hoarder/validator/constraints/alpha_constraint");

  AlphanumericConstraint = require("hoarder/validator/constraints/alphanumeric_constraint");

  CreditCardConstraint = require("hoarder/validator/constraints/credit_card_constraint");

  EmailConstraint = require("hoarder/validator/constraints/email_constraint");

  MaxLengthConstraint = require("hoarder/validator/constraints/max_length_constraint");

  MinLengthConstraint = require("hoarder/validator/constraints/min_length_constraint");

  NumericConstraint = require("hoarder/validator/constraints/numeric_constraint");

  PhoneConstraint = require("hoarder/validator/constraints/phone_constraint");

  RequiredConstraint = require("hoarder/validator/constraints/required_constraint");

  FormValidator = (function() {
    var isValid, validationStringsFrom;

    FormValidator.libraryConstraints = [new AlphaConstraint(), new AlphanumericConstraint(), new CreditCardConstraint(), new EmailConstraint(), new MaxLengthConstraint(), new MinLengthConstraint(), new NumericConstraint(), new PhoneConstraint(), new RequiredConstraint()];

    FormValidator.create = function() {
      return new this(FormValidator.libraryConstraints);
    };

    function FormValidator(constraints) {
      this.constraints = constraints;
    }

    FormValidator.prototype.validateForm = function(form) {
      var element, isValid, _i, _len, _ref;

      isValid = true;
      _ref = form.elements();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (!this.validateElement(element)) {
          isValid = false;
        }
      }
      return isValid;
    };

    FormValidator.prototype.validateElement = function(element) {
      var constraint, rule, ruleString, _i, _j, _len, _len1, _ref, _ref1;

      _ref = validationStringsFrom(element);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ruleString = _ref[_i];
        rule = ValidationRule.fromString(ruleString);
        _ref1 = this.constraints;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          constraint = _ref1[_j];
          if (constraint.canHandle(rule)) {
            constraint.handle(element, rule);
          }
          if (!isValid(element)) {
            break;
          }
        }
        if (!isValid(element)) {
          break;
        }
      }
      return isValid(element);
    };

    validationStringsFrom = function(element) {
      var ruleString, validationAttribute, _i, _len, _ref, _results;

      validationAttribute = element.getAttribute("data-validation");
      if (validationAttribute == null) {
        return [];
      }
      _ref = validationAttribute.split(',');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ruleString = _ref[_i];
        _results.push(ruleString.trim());
      }
      return _results;
    };

    isValid = function(element) {
      return !element.validity.customError;
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
  var validation_ruleCache = null;
  var validation_ruleFunc = function() {
    return (function() {
  var ValidationRule;

  ValidationRule = (function() {
    function ValidationRule(type, context) {
      this.type = type;
      this.context = context != null ? context : null;
    }

    ValidationRule.fromString = function(ruleString) {
      var context, ruleParts;

      ruleParts = ruleString.split('=');
      context = ruleParts[1] != null ? ruleParts[1] : null;
      return new this(ruleParts[0], context);
    };

    return ValidationRule;

  })();

  return ValidationRule;

}).call(this);

  };
  modules.hoarder__validator__rules__validation_rule = function() {
    if (validation_ruleCache === null) {
      validation_ruleCache = validation_ruleFunc();
    }
    return validation_ruleCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var bonzoCache = null;
  var bonzoFunc = function() {
    /*!
  * Bonzo: DOM Utility (c) Dustin Diaz 2012
  * https://github.com/ded/bonzo
  * License MIT
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bonzo', this, function() {
  var win = window
    , doc = win.document
    , html = doc.documentElement
    , parentNode = 'parentNode'
    , specialAttributes = /^(checked|value|selected|disabled)$/i
      // tags that we have trouble inserting *into*
    , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
    , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
    , table = ['<table>', '</table>', 1]
    , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
    , option = ['<select>', '</select>', 1]
    , noscope = ['_', '', 0, 1]
    , tagMap = { // tags that we have trouble *inserting*
          thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
        , tr: ['<table><tbody>', '</tbody></table>', 2]
        , th: td , td: td
        , col: ['<table><colgroup>', '</colgroup></table>', 2]
        , fieldset: ['<form>', '</form>', 1]
        , legend: ['<form><fieldset>', '</fieldset></form>', 2]
        , option: option, optgroup: option
        , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
      }
    , stateAttributes = /^(checked|selected|disabled)$/
    , ie = /msie/i.test(navigator.userAgent)
    , hasClass, addClass, removeClass
    , uidMap = {}
    , uuids = 0
    , digit = /^-?[\d\.]+$/
    , dattr = /^data-(.+)$/
    , px = 'px'
    , setAttribute = 'setAttribute'
    , getAttribute = 'getAttribute'
    , byTag = 'getElementsByTagName'
    , features = function() {
        var e = doc.createElement('p')
        e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
        return {
          hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
        , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
        , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
        , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
        , transform: function () {
            var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
            for (i = 0; i < props.length; i++) {
              if (props[i] in e.style) return props[i]
            }
          }()
        , classList: 'classList' in e
        , opasity: function () {
            return typeof doc.createElement('a').style.opacity !== 'undefined'
          }()
        }
      }()
    , trimReplace = /(^\s*|\s*$)/g
    , whitespaceRegex = /\s+/
    , toString = String.prototype.toString
    , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
    , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
    , trim = String.prototype.trim ?
        function (s) {
          return s.trim()
        } :
        function (s) {
          return s.replace(trimReplace, '')
        }

    , getStyle = features.computedStyle
        ? function (el, property) {
            var value = null
              , computed = doc.defaultView.getComputedStyle(el, '')
            computed && (value = computed[property])
            return el.style[property] || value
          }
        : !(ie && html.currentStyle)
          ? function (el, property) {
              return el.style[property]
            }
          :
          /**
           * @param {Element} el
           * @param {string} property
           * @return {string|number}
           */
          function (el, property) {
            var val, value
            if (property == 'opacity' && !features.opasity) {
              val = 100
              try {
                val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
              } catch (e1) {
                try {
                  val = el['filters']('alpha').opacity
                } catch (e2) {}
              }
              return val / 100
            }
            value = el.currentStyle ? el.currentStyle[property] : null
            return el.style[property] || value
          }

  function isNode(node) {
    return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
  }


  function normalize(node, host, clone) {
    var i, l, ret
    if (typeof node == 'string') return bonzo.create(node)
    if (isNode(node)) node = [ node ]
    if (clone) {
      ret = [] // don't change original array
      for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
      return ret
    }
    return node
  }

  /**
   * @param {string} c a class name to test
   * @return {boolean}
   */
  function classReg(c) {
    return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @param {boolean=} opt_rev
   * @return {Bonzo|Array}
   */
  function each(ar, fn, opt_scope, opt_rev) {
    var ind, i = 0, l = ar.length
    for (; i < l; i++) {
      ind = opt_rev ? ar.length - i - 1 : i
      fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
    }
    return ar
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {Bonzo|Array}
   */
  function deepEach(ar, fn, opt_scope) {
    for (var i = 0, l = ar.length; i < l; i++) {
      if (isNode(ar[i])) {
        deepEach(ar[i].childNodes, fn, opt_scope)
        fn.call(opt_scope || ar[i], ar[i], i, ar)
      }
    }
    return ar
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function decamelize(s) {
    return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
  }


  /**
   * @param {Element} el
   * @return {*}
   */
  function data(el) {
    el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
    var uid = el[getAttribute]('data-node-uid')
    return uidMap[uid] || (uidMap[uid] = {})
  }


  /**
   * removes the data associated with an element
   * @param {Element} el
   */
  function clearData(el) {
    var uid = el[getAttribute]('data-node-uid')
    if (uid) delete uidMap[uid]
  }


  function dataValue(d) {
    var f
    try {
      return (d === null || d === undefined) ? undefined :
        d === 'true' ? true :
          d === 'false' ? false :
            d === 'null' ? null :
              (f = parseFloat(d)) == d ? f : d;
    } catch(e) {}
    return undefined
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {boolean} whether `some`thing was found
   */
  function some(ar, fn, opt_scope) {
    for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
    return false
  }


  /**
   * this could be a giant enum of CSS properties
   * but in favor of file size sans-closure deadcode optimizations
   * we're just asking for any ol string
   * then it gets transformed into the appropriate style property for JS access
   * @param {string} p
   * @return {string}
   */
  function styleProperty(p) {
      (p == 'transform' && (p = features.transform)) ||
        (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
        (p == 'float' && (p = features.cssFloat))
      return p ? camelize(p) : null
  }

  // this insert method is intense
  function insert(target, host, fn, rev) {
    var i = 0, self = host || this, r = []
      // target nodes could be a css selector if it's a string and a selector engine is present
      // otherwise, just use target
      , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
    // normalize each node in case it's still a string and we need to create nodes on the fly
    each(normalize(nodes), function (t, j) {
      each(self, function (el) {
        fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
      }, null, rev)
    }, this, rev)
    self.length = i
    each(r, function (e) {
      self[--i] = e
    }, null, !rev)
    return self
  }


  /**
   * sets an element to an explicit x/y position on the page
   * @param {Element} el
   * @param {?number} x
   * @param {?number} y
   */
  function xy(el, x, y) {
    var $el = bonzo(el)
      , style = $el.css('position')
      , offset = $el.offset()
      , rel = 'relative'
      , isRel = style == rel
      , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]

    if (style == 'static') {
      $el.css('position', rel)
      style = rel
    }

    isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
    isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)

    x != null && (el.style.left = x - offset.left + delta[0] + px)
    y != null && (el.style.top = y - offset.top + delta[1] + px)

  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  if (features.classList) {
    hasClass = function (el, c) {
      return el.classList.contains(c)
    }
    addClass = function (el, c) {
      el.classList.add(c)
    }
    removeClass = function (el, c) {
      el.classList.remove(c)
    }
  }
  else {
    hasClass = function (el, c) {
      return classReg(c).test(el.className)
    }
    addClass = function (el, c) {
      el.className = trim(el.className + ' ' + c)
    }
    removeClass = function (el, c) {
      el.className = trim(el.className.replace(classReg(c), ' '))
    }
  }


  /**
   * this allows method calling for setting values
   *
   * @example
   * bonzo(elements).css('color', function (el) {
   *   return el.getAttribute('data-original-color')
   * })
   *
   * @param {Element} el
   * @param {function (Element)|string}
   * @return {string}
   */
  function setter(el, v) {
    return typeof v == 'function' ? v(el) : v
  }

  function scroll(x, y, type) {
    var el = this[0]
    if (!el) return this
    if (x == null && y == null) {
      return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
    }
    if (isBody(el)) {
      win.scrollTo(x, y)
    } else {
      x != null && (el.scrollLeft = x)
      y != null && (el.scrollTop = y)
    }
    return this
  }

  /**
   * @constructor
   * @param {Array.<Element>|Element|Node|string} elements
   */
  function Bonzo(elements) {
    this.length = 0
    if (elements) {
      elements = typeof elements !== 'string' &&
        !elements.nodeType &&
        typeof elements.length !== 'undefined' ?
          elements :
          [elements]
      this.length = elements.length
      for (var i = 0; i < elements.length; i++) this[i] = elements[i]
    }
  }

  Bonzo.prototype = {

      /**
       * @param {number} index
       * @return {Element|Node}
       */
      get: function (index) {
        return this[index] || null
      }

      // itetators
      /**
       * @param {function(Element|Node)} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , each: function (fn, opt_scope) {
        return each(this, fn, opt_scope)
      }

      /**
       * @param {Function} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , deepEach: function (fn, opt_scope) {
        return deepEach(this, fn, opt_scope)
      }


      /**
       * @param {Function} fn
       * @param {Function=} opt_reject
       * @return {Array}
       */
    , map: function (fn, opt_reject) {
        var m = [], n, i
        for (i = 0; i < this.length; i++) {
          n = fn.call(this, this[i], i)
          opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
        }
        return m
      }

    // text and html inserters!

    /**
     * @param {string} h the HTML to insert
     * @param {boolean=} opt_text whether to set or get text content
     * @return {Bonzo|string}
     */
    , html: function (h, opt_text) {
        var method = opt_text
              ? html.textContent === undefined ? 'innerText' : 'textContent'
              : 'innerHTML'
          , that = this
          , append = function (el, i) {
              each(normalize(h, that, i), function (node) {
                el.appendChild(node)
              })
            }
          , updateElement = function (el, i) {
              try {
                if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                  return el[method] = h
                }
              } catch (e) {}
              append(el, i)
            }
        return typeof h != 'undefined'
          ? this.empty().each(updateElement)
          : this[0] ? this[0][method] : ''
      }

      /**
       * @param {string=} opt_text the text to set, otherwise this is a getter
       * @return {Bonzo|string}
       */
    , text: function (opt_text) {
        return this.html(opt_text, true)
      }

      // more related insertion methods

      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , append: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el.appendChild(i)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , prepend: function (node) {
        var that = this
        return this.each(function (el, i) {
          var first = el.firstChild
          each(normalize(node, that, i), function (i) {
            el.insertBefore(i, first)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , appendTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.appendChild(el)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , prependTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.insertBefore(el, t.firstChild)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , before: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , after: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el.nextSibling)
          }, null, 1)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertBefore: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t[parentNode].insertBefore(el, t)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertAfter: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          var sibling = t.nextSibling
          sibling ?
            t[parentNode].insertBefore(el, sibling) :
            t[parentNode].appendChild(el)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , replaceWith: function (node) {
        bonzo(normalize(node)).insertAfter(this)
        return this.remove()
      }

      /**
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , clone: function (opt_host) {
        var ret = [] // don't change original array
          , l, i
        for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
        return bonzo(ret)
      }

      // class management

      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , addClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          // we `each` here so you can do $el.addClass('foo bar')
          each(c, function (c) {
            if (c && !hasClass(el, setter(el, c)))
              addClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , removeClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c && hasClass(el, setter(el, c)))
              removeClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {boolean}
       */
    , hasClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return some(this, function (el) {
          return some(c, function (c) {
            return c && hasClass(el, c)
          })
        })
      }


      /**
       * @param {string} c classname to toggle
       * @param {boolean=} opt_condition whether to add or remove the class straight away
       * @return {Bonzo}
       */
    , toggleClass: function (c, opt_condition) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c) {
              typeof opt_condition !== 'undefined' ?
                opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
            }
          })
        })
      }

      // display togglers

      /**
       * @param {string=} opt_type useful to set back to anything other than an empty string
       * @return {Bonzo}
       */
    , show: function (opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : ''
        return this.each(function (el) {
          el.style.display = opt_type
        })
      }


      /**
       * @return {Bonzo}
       */
    , hide: function () {
        return this.each(function (el) {
          el.style.display = 'none'
        })
      }


      /**
       * @param {Function=} opt_callback
       * @param {string=} opt_type
       * @return {Bonzo}
       */
    , toggle: function (opt_callback, opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : '';
        typeof opt_callback != 'function' && (opt_callback = null)
        return this.each(function (el) {
          el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
          opt_callback && opt_callback.call(el)
        })
      }


      // DOM Walkers & getters

      /**
       * @return {Element|Node}
       */
    , first: function () {
        return bonzo(this.length ? this[0] : [])
      }


      /**
       * @return {Element|Node}
       */
    , last: function () {
        return bonzo(this.length ? this[this.length - 1] : [])
      }


      /**
       * @return {Element|Node}
       */
    , next: function () {
        return this.related('nextSibling')
      }


      /**
       * @return {Element|Node}
       */
    , previous: function () {
        return this.related('previousSibling')
      }


      /**
       * @return {Element|Node}
       */
    , parent: function() {
        return this.related(parentNode)
      }


      /**
       * @private
       * @param {string} method the directional DOM method
       * @return {Element|Node}
       */
    , related: function (method) {
        return bonzo(this.map(
          function (el) {
            el = el[method]
            while (el && el.nodeType !== 1) {
              el = el[method]
            }
            return el || 0
          },
          function (el) {
            return el
          }
        ))
      }


      /**
       * @return {Bonzo}
       */
    , focus: function () {
        this.length && this[0].focus()
        return this
      }


      /**
       * @return {Bonzo}
       */
    , blur: function () {
        this.length && this[0].blur()
        return this
      }

      // style getter setter & related methods

      /**
       * @param {Object|string} o
       * @param {string=} opt_v
       * @return {Bonzo|string}
       */
    , css: function (o, opt_v) {
        var p, iter = o
        // is this a request for just getting a style?
        if (opt_v === undefined && typeof o == 'string') {
          // repurpose 'v'
          opt_v = this[0]
          if (!opt_v) return null
          if (opt_v === doc || opt_v === win) {
            p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
            return o == 'width' ? p.width : o == 'height' ? p.height : ''
          }
          return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
        }

        if (typeof o == 'string') {
          iter = {}
          iter[o] = opt_v
        }

        if (ie && iter.opacity) {
          // oh this 'ol gamut
          iter.filter = 'alpha(opacity=' + (iter.opacity * 100) + ')'
          // give it layout
          iter.zoom = o.zoom || 1;
          delete iter.opacity;
        }

        function fn(el, p, v) {
          for (var k in iter) {
            if (iter.hasOwnProperty(k)) {
              v = iter[k];
              // change "5" to "5px" - unless you're line-height, which is allowed
              (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
              try { el.style[p] = setter(el, v) } catch(e) {}
            }
          }
        }
        return this.each(fn)
      }


      /**
       * @param {number=} opt_x
       * @param {number=} opt_y
       * @return {Bonzo|number}
       */
    , offset: function (opt_x, opt_y) {
        if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
          return this.each(function (el) {
            xy(el, opt_x.left, opt_x.top)
          })
        } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
          return this.each(function (el) {
            xy(el, opt_x, opt_y)
          })
        }
        if (!this[0]) return {
            top: 0
          , left: 0
          , height: 0
          , width: 0
        }
        var el = this[0]
          , de = el.ownerDocument.documentElement
          , bcr = el.getBoundingClientRect()
          , scroll = getWindowScroll()
          , width = el.offsetWidth
          , height = el.offsetHeight
          , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
          , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)

        return {
            top: top
          , left: left
          , height: height
          , width: width
        }
      }


      /**
       * @return {number}
       */
    , dim: function () {
        if (!this.length) return { height: 0, width: 0 }
        var el = this[0]
          , de = el.nodeType == 9 && el.documentElement // document
          , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
             // el isn't visible, can't be measured properly, so fix that
             function (t) {
               var s = {
                   position: el.style.position || ''
                 , visibility: el.style.visibility || ''
                 , display: el.style.display || ''
               }
               t.first().css({
                   position: 'absolute'
                 , visibility: 'hidden'
                 , display: 'block'
               })
               return s
            }(this) : null
          , width = de
              ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
              : el.offsetWidth
          , height = de
              ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
              : el.offsetHeight

        orig && this.first().css(orig)
        return {
            height: height
          , width: width
        }
      }

      // attributes are hard. go shopping

      /**
       * @param {string} k an attribute to get or set
       * @param {string=} opt_v the value to set
       * @return {Bonzo|string}
       */
    , attr: function (k, opt_v) {
        var el = this[0]
          , n

        if (typeof k != 'string' && !(k instanceof String)) {
          for (n in k) {
            k.hasOwnProperty(n) && this.attr(n, k[n])
          }
          return this
        }

        return typeof opt_v == 'undefined' ?
          !el ? null : specialAttributes.test(k) ?
            stateAttributes.test(k) && typeof el[k] == 'string' ?
              true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                el[getAttribute](k, 2) : el[getAttribute](k) :
          this.each(function (el) {
            specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
          })
      }


      /**
       * @param {string} k
       * @return {Bonzo}
       */
    , removeAttr: function (k) {
        return this.each(function (el) {
          stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
        })
      }


      /**
       * @param {string=} opt_s
       * @return {Bonzo|string}
       */
    , val: function (s) {
        return (typeof s == 'string') ?
          this.attr('value', s) :
          this.length ? this[0].value : null
      }

      // use with care and knowledge. this data() method uses data attributes on the DOM nodes
      // to do this differently costs a lot more code. c'est la vie
      /**
       * @param {string|Object=} opt_k the key for which to get or set data
       * @param {Object=} opt_v
       * @return {Bonzo|Object}
       */
    , data: function (opt_k, opt_v) {
        var el = this[0], o, m
        if (typeof opt_v === 'undefined') {
          if (!el) return null
          o = data(el)
          if (typeof opt_k === 'undefined') {
            each(el.attributes, function (a) {
              (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
            })
            return o
          } else {
            if (typeof o[opt_k] === 'undefined')
              o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
            return o[opt_k]
          }
        } else {
          return this.each(function (el) { data(el)[opt_k] = opt_v })
        }
      }

      // DOM detachment & related

      /**
       * @return {Bonzo}
       */
    , remove: function () {
        this.deepEach(clearData)
        return this.detach()
      }


      /**
       * @return {Bonzo}
       */
    , empty: function () {
        return this.each(function (el) {
          deepEach(el.childNodes, clearData)

          while (el.firstChild) {
            el.removeChild(el.firstChild)
          }
        })
      }


      /**
       * @return {Bonzo}
       */
    , detach: function () {
        return this.each(function (el) {
          el[parentNode] && el[parentNode].removeChild(el)
        })
      }

      // who uses a mouse anyway? oh right.

      /**
       * @param {number} y
       */
    , scrollTop: function (y) {
        return scroll.call(this, null, y, 'y')
      }


      /**
       * @param {number} x
       */
    , scrollLeft: function (x) {
        return scroll.call(this, x, null, 'x')
      }

  }


  function cloneNode(host, el) {
    var c = el.cloneNode(true)
      , cloneElems
      , elElems
      , i

    // check for existence of an event cloner
    // preferably https://github.com/fat/bean
    // otherwise Bonzo won't do this for you
    if (host.$ && typeof host.cloneEvents == 'function') {
      host.$(c).cloneEvents(el)

      // clone events from every child node
      cloneElems = host.$(c).find('*')
      elElems = host.$(el).find('*')

      for (i = 0; i < elElems.length; i++)
        host.$(cloneElems[i]).cloneEvents(elElems[i])
    }
    return c
  }

  function isBody(element) {
    return element === win || (/^(?:body|html)$/i).test(element.tagName)
  }

  function getWindowScroll() {
    return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
  }

  function createScriptFromHtml(html) {
    var scriptEl = document.createElement('script')
      , matches = html.match(simpleScriptTagRe)
    scriptEl.src = matches[1]
    return scriptEl
  }

  /**
   * @param {Array.<Element>|Element|Node|string} els
   * @return {Bonzo}
   */
  function bonzo(els) {
    return new Bonzo(els)
  }

  bonzo.setQueryEngine = function (q) {
    query = q;
    delete bonzo.setQueryEngine
  }

  bonzo.aug = function (o, target) {
    // for those standalone bonzo users. this love is for you.
    for (var k in o) {
      o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
    }
  }

  bonzo.create = function (node) {
    // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    return typeof node == 'string' && node !== '' ?
      function () {
        if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
        var tag = node.match(/^\s*<([^\s>]+)/)
          , el = doc.createElement('div')
          , els = []
          , p = tag ? tagMap[tag[1].toLowerCase()] : null
          , dep = p ? p[2] + 1 : 1
          , ns = p && p[3]
          , pn = parentNode
          , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)

        el.innerHTML = p ? (p[0] + node + p[1]) : node
        while (dep--) el = el.firstChild
        // for IE NoScope, we may insert cruft at the begining just to get it to work
        if (ns && el && el.nodeType !== 1) el = el.nextSibling
        do {
          // tbody special case for IE<8, creates tbody on any empty table
          // we don't want it if we're just after a <thead>, <caption>, etc.
          if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
            els.push(el)
          }
        } while (el = el.nextSibling)
        // IE < 9 gives us a parentNode which messes up insert() check for cloning
        // `dep` > 1 can also cause problems with the insert() check (must do this last)
        each(els, function(el) { el[pn] && el[pn].removeChild(el) })
        return els
      }() : isNode(node) ? [node.cloneNode(true)] : []
  }

  bonzo.doc = function () {
    var vp = bonzo.viewport()
    return {
        width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
      , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
    }
  }

  bonzo.firstChild = function (el) {
    for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
      if (c[i].nodeType === 1) e = c[j = i]
    }
    return e
  }

  bonzo.viewport = function () {
    return {
        width: ie ? html.clientWidth : self.innerWidth
      , height: ie ? html.clientHeight : self.innerHeight
    }
  }

  bonzo.isAncestor = 'compareDocumentPosition' in html ?
    function (container, element) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (container, element) {
      return container !== element && container.contains(element);
    } :
    function (container, element) {
      while (element = element[parentNode]) {
        if (element === container) {
          return true
        }
      }
      return false
    }

  return bonzo
}); // the only line we care about using a semi-colon. placed here for concatenation tools

  };
  modules.lib__bonzo = function() {
    if (bonzoCache === null) {
      bonzoCache = bonzoFunc();
    }
    return bonzoCache;
  };
  window.modules = modules;
})();

(function() {
  var modules = window.modules || [];
  var qweryCache = null;
  var qweryFunc = function() {
    /*!
  * @preserve Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz 2012
  * MIT License
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('qwery', this, function () {
  var doc = document
    , html = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , qSA = 'querySelectorAll'
    , useNativeQSA = 'useNativeQSA'
    , tagName = 'tagName'
    , nodeType = 'nodeType'
    , select // main select() method, assign later

    , id = /#([\w\-]+)/
    , clas = /\.[\w\-]+/g
    , idOnly = /^#([\w\-]+)$/
    , classOnly = /^\.([\w\-]+)$/
    , tagOnly = /^([\w\-]+)$/
    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
    , splittable = /(^|,)\s*[>~+]/
    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
    , splitters = /[\s\>\+\~]/
    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
    , tokenizr = new RegExp(splitters.source + splittersMore.source)
    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')

  var walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      }
    , '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode
      }
    , '~': function (node) {
        return node && node.previousSibling
      }
    , '+': function (node, contestant, p1, p2) {
        if (!node) return false
        return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
      }
    }

  function cache() {
    this.c = {}
  }
  cache.prototype = {
    g: function (k) {
      return this.c[k] || undefined
    }
  , s: function (k, v, r) {
      v = r ? new RegExp(v) : v
      return (this.c[k] = v)
    }
  }

  var classCache = new cache()
    , cleanCache = new cache()
    , attrCache = new cache()
    , tokenCache = new cache()

  function classRegex(c) {
    return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
  }

  // not quite as fast as inline loops in older browsers so don't use liberally
  function each(a, fn) {
    var i = 0, l = a.length
    for (; i < l; i++) fn(a[i])
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function arrayify(ar) {
    var i = 0, l = ar.length, r = []
    for (; i < l; i++) r[i] = ar[i]
    return r
  }

  function previous(n) {
    while (n = n.previousSibling) if (n[nodeType] == 1) break;
    return n
  }

  function q(query) {
    return query.match(chunker)
  }

  // called using `this` as element and arguments from regex group results.
  // given => div.hello[title="world"]:foo('bar')
  // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
    var i, m, k, o, classes
    if (this[nodeType] !== 1) return false
    if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
    if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
    if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
          return this
        }
      }
    }
    if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
      // select is for attrib equality
      return false
    }
    return this
  }

  function clean(s) {
    return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
  }

  function checkAttr(qualify, actual, val) {
    switch (qualify) {
    case '=':
      return actual == val
    case '^=':
      return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
    case '$=':
      return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
    case '*=':
      return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
    case '~=':
      return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
    case '|=':
      return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
    }
    return 0
  }

  // given a selector, first check for simple cases then collect all base candidate matches and filter
  function _qwery(selector, _root) {
    var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

    if (!tokens.length) return r

    token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
    if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
    if (!root) return r

    intr = q(token)
    // collect base candidates to filter
    els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
        while (root = root.nextSibling) {
          root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
        }
        return r
      }([]) :
      root[byTag](intr[1] || '*')
    // filter elements according to the right-most part of the selector
    for (i = 0, l = els.length; i < l; i++) {
      if (item = interpret.apply(els[i], intr)) r[r.length] = item
    }
    if (!tokens.length) return r

    // filter further according to the rest of the selector (the left side)
    each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
    return ret
  }

  // compare element to a selector
  function is(el, selector, root) {
    if (isNode(selector)) return el == selector
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

    var selectors = selector.split(','), tokens, dividedTokens
    while (selector = selectors.pop()) {
      tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      dividedTokens = selector.match(dividers)
      tokens = tokens.slice(0) // copy array
      if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
        return true
      }
    }
    return false
  }

  // given elements matching the right-most part of a selector, filter out any that don't match the rest
  function ancestorMatch(el, tokens, dividedTokens, root) {
    var cand
    // recursively work backwards through the tokens and up the dom, covering all options
    function crawl(e, i, p) {
      while (p = walker[dividedTokens[i]](p, e)) {
        if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
          if (i) {
            if (cand = crawl(p, i - 1, p)) return cand
          } else return p
        }
      }
    }
    return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
  }

  function isNode(el, t) {
    return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
  }

  function uniq(ar) {
    var a = [], i, j;
    o:
    for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
      a[a.length] = ar[i]
    }
    return a
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  function byId(root, id, el) {
    // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
    return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
  }

  function qwery(selector, _root) {
    var m, el, root = normalizeRoot(_root)

    // easy, fast cases that we can dispatch with simple DOM calls
    if (!root || !selector) return []
    if (selector === window || isNode(selector)) {
      return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)
    if (m = selector.match(easy)) {
      if (m[1]) return (el = byId(root, m[1])) ? [el] : []
      if (m[2]) return arrayify(root[byTag](m[2]))
      if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
    }

    return select(selector, root)
  }

  // where the root is not document and a relationship selector is first we have to
  // do some awkward adjustments to get it to work, even with qSA
  function collectSelector(root, collector) {
    return function (s) {
      var oid, nid
      if (splittable.test(s)) {
        if (root[nodeType] !== 9) {
          // make sure the el has an id, rewrite the query, set root to doc and run it
          if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
          s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
          collector(root.parentNode || root, s, true)
          oid || root.removeAttribute('id')
        }
        return;
      }
      s.length && collector(root, s, false)
    }
  }

  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
      container = container[nodeType] === 9 || container == window ? html : container
      return container !== element && container.contains(element)
    } :
    function (element, container) {
      while (element = element.parentNode) if (element === container) return 1
      return 0
    }
  , getAttr = function () {
      // detect buggy IE src/href getAttribute() call
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function (e, a) {
          return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function (e, a) { return e.getAttribute(a) }
    }()
  , hasByClass = !!doc[byClass]
    // has native qSA support
  , hasQSA = doc.querySelector && doc[qSA]
    // use native qSA
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
        if (root[nodeType] === 9 || !splittable.test(selector)) {
          // most work is done right here, defer to qSA
          return arrayify(root[qSA](selector))
        }
        // special case where we need the services of `collectSelector()`
        each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
          e = ctx[qSA](s)
          if (e.length == 1) result[result.length] = e.item(0)
          else if (e.length) result = result.concat(arrayify(e))
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch (ex) { }
      return selectNonNative(selector, root)
    }
    // no native selector support
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
        r = classRegex(m[2])
        items = root[byTag](m[1] || '*')
        for (i = 0, l = items.length; i < l; i++) {
          if (r.test(items[i].className)) result[result.length] = items[i]
        }
        return result
      }
      // more complex selector, get `_qwery()` to do the work for us
      each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
        r = _qwery(s, ctx)
        for (i = 0, l = r.length; i < l; i++) {
          if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
        }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
    }
  , configure = function (options) {
      // configNativeQSA: use fully-internal selector or native qSA where present
      if (typeof options[useNativeQSA] !== 'undefined')
        select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
    }

  configure({ useNativeQSA: true })

  qwery.configure = configure
  qwery.uniq = uniq
  qwery.is = is
  qwery.pseudos = {}

  return qwery
});

  };
  modules.lib__qwery = function() {
    if (qweryCache === null) {
      qweryCache = qweryFunc();
    }
    return qweryCache;
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
