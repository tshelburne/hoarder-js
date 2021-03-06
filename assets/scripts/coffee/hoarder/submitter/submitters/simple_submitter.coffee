require 'lib/reqwest'

BaseSubmitter = require 'hoarder/submitter/submitters/base_submitter'

class SimpleSubmitter extends BaseSubmitter

  constructor: ->
    super()
    @type = 'simple'

  submit: (form)->
    reqwest(
      url: form.action()
      type: 'json'
      method: form.method()
      data: form.serialize()
      success: (data)=> @submittedWithSuccess.dispatch(form, data)
      error: (xhr)=> @submittedWithError.dispatch(form, xhr)
    )

return SimpleSubmitter