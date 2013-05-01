SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# handles executing a delayed
#
class PollingSubmitter extends SimpleSubmitter
  constructor: (@pollUrl, @pollFrequency)->
    super()

  canSubmit: (form)-> form.type is "polling"

  submitSuccess: (form, data)->
    @interval = setInterval( =>
      @queryPoll(form, data.pollId)
    , @pollFrequency)
    @queryPoll(form, data.pollId)

  queryPoll: (form, pollId)=>
    unless @executing
      @executing = true
      $.ajax
        url: @pollUrl
        type: "POST"
        data: "pollId=#{pollId}"
        success: (data)=> @pollSuccess(form, pollId, data)
        error: (xhr, text)=> @submitError(form, xhr, text)

  pollSuccess: (form, pollId, data)=>
    @executing = false
    if data.pollCompleted
      clearInterval(@interval)
      @submittedWithSuccess.dispatch(form, data.pollData)

return PollingSubmitter