MultiSignalRelay = require "cronus/multi_signal_relay"

SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"
PollingSubmitter = require "hoarder/submitter/submitters/polling_submitter"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# a class to handle submitting forms
#
class FormSubmitter

  @create: (pollingUrl, pollFrequency=1000)->
    new @([ new SimpleSubmitter(), new PollingSubmitter(pollingUrl, pollFrequency)])

  constructor: (@submitters)->
    successSignals = (submitter.submittedWithSuccess for submitter in @submitters)
    errorSignals = (submitter.submittedWithError for submitter in @submitters)

    @submittedWithSuccess = new MultiSignalRelay(successSignals)
    @submittedWithError = new MultiSignalRelay(errorSignals)

  submit: (form, type)->
    for submitter in @submitters
      if submitter.canSubmit(type)
        submitter.submit form 
        break

return FormSubmitter