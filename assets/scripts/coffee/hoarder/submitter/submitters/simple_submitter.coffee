require "lib/jquery"

Signal = require "cronus/signal"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# handles submitting a form and waiting for a response
#
class SimpleSubmitter
  constructor: ->
    @submittedWithSuccess = new Signal()
    @submittedWithError = new Signal()

  canSubmit: (form)-> form.type is "simple"

  submitForm: (form)->
    $.ajax
      url: form.action
      type: form.method
      data: form.serialize()
      success: (data)=>
        @submitSuccess(form, data)
      error: (xhr, text)=> @submitError(form, xhr, text)

  submitSuccess: (form, data)-> @submittedWithSuccess.dispatch(form, data)

  submitError: (form, xhr, text)-> @submittedWithError.dispatch(form, text)

return SimpleSubmitter