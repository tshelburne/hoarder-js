Signal = require "cronus/signal"
SignalRelay = require "cronus/signal_relay"

FormSubmitter = require 'hoarder/submitter/form_submitter'
FormValidator = require 'hoarder/validator/form_validator'

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# abstracts submitting and validating forms from the validator and submitter
#
class FormManager
  constructor: (@formSubmitter, @formValidator)->
    @validatedWithErrors = new Signal()
    @submittedWithSuccess = new SignalRelay(@formSubmitter.submittedWithSuccess)
    @submittedWithError = new SignalRelay(@formSubmitter.submittedWithError)

  @default: (pollingUrl="")->
    new @(FormSubmitter.default(pollingUrl), FormValidator.default())

  validateForm: (form)->
    @formValidator.validateForm(form)

  submitForm: (form)->
    errors = @validateForm(form)

    if (errors.length > 0)
      @validatedWithErrors.dispatch(errors)
    else
      @formSubmitter.submitForm(form)

return FormManager