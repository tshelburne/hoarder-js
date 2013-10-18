require 'lib/reqwest'

BaseSubmitter = require "hoarder/submitter/submitters/base_submitter"

class PollingSubmitter extends BaseSubmitter
  
  constructor: (@pollUrl, @pollFrequency)->
    super()
    @type = 'polling'

  submit: (form)->
    reqwest(
      url: form.action()
      type: 'json'
      method: form.method()
      data: form.serialize()
      success: (data)=> @poll(form, data.processId)
      error: (xhr)=> @submittedWithError.dispatch(form, xhr)
    )

  poll: (form, processId)=>  
    reqwest(
      url: @pollUrl
      type: 'json'
      method: "POST"
      data: "processId=#{processId}"
      success: (data)=> _pollSuccess.call @, form, processId, data
      error: (xhr)=> @submittedWithError.dispatch(form, xhr)
    )

  # private

  _pollSuccess = (form, processId, data)->
    if data.processCompleted
      @submittedWithSuccess.dispatch(form, data.processData)
    else
      setTimeout( =>
        @poll(form, processId)
      , @pollFrequency)

return PollingSubmitter