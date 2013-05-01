MultiSignalRelay = require "cronus/multi_signal_relay"

SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"
PollingSubmitter = require "hoarder/submitter/submitters/polling_submitter"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# a class to handle submitting forms
#
class FormSubmitter
  constructor: (@submitters)->
    successSignals = []
    errorSignals = []
    for submitter in @submitters
      successSignals.push submitter.submittedWithSuccess
      errorSignals.push submitter.submittedWithError

    @submittedWithSuccess = new MultiSignalRelay(successSignals)
    @submittedWithError = new MultiSignalRelay(errorSignals)

  @default: (pollingUrl)->
    new @([ new SimpleSubmitter(), new PollingSubmitter(pollingUrl, 1000)])

  submitForm: (form)->
    for submitter in @submitters
      submitter.submitForm(form) if submitter.canSubmit(form)

return FormSubmitter