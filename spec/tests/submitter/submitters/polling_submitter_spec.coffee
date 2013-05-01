PollingSubmitter = require "hoarder/submitter/submitters/polling_submitter"

describe "PollingSubmitter", ->
  submitter = null

  beforeEach ->
    submitter = new PollingSubmitter("/poll-check-form-submit", 500)

  it "can initiate a poll upon successful submission of a form", ->
    spyOn($, "ajax").andCallFake( (params)-> params.success(mocks.submitPollingFormResponse))
    spyOn(submitter, "queryPoll")
    submitter.submitForm(mocks.pollingForm)
    expect(submitter.queryPoll).toHaveBeenCalledWith(mocks.pollingForm, "1234")

  it "can respond to a successful poll check", ->
    spyOn($, "ajax").andCallFake( (params)-> params.success(mocks.submitFormPollingCheckResponse))
    spyOn(submitter.submittedWithSuccess, "dispatch")
    submitter.queryPoll(mocks.pollingForm, "1234")
    expect(submitter.submittedWithSuccess.dispatch).toHaveBeenCalledWith(mocks.pollingForm, mocks.submitFormPollingCheckResponse.pollData)

  it "can poll with the given frequency", ->
    jasmine.Clock.useMock()
    spyOn($, "ajax").andCallFake( (params)=> if $.ajax.calls.length < 3 then params.success(mocks.submitFormPollingCheckFailedResponse) else params.success(mocks.submitFormPollingCheckResponse))
    spyOn(submitter, "queryPoll").andCallThrough()
    spyOn(submitter.submittedWithSuccess, "dispatch")
    spyOn(submitter.submittedWithError, "dispatch")
    submitter.submitSuccess(mocks.pollingForm, { pollId:"1234" })
    expect(submitter.submittedWithSuccess.dispatch).not.toHaveBeenCalled()
    expect(submitter.submittedWithError.dispatch).not.toHaveBeenCalled()
    expect(submitter.queryPoll.calls.length).toEqual 1
    jasmine.Clock.tick 501
    expect(submitter.submittedWithSuccess.dispatch).not.toHaveBeenCalled()
    expect(submitter.submittedWithError.dispatch).not.toHaveBeenCalled()
    expect(submitter.queryPoll.calls.length).toEqual 2
    jasmine.Clock.tick 501
    expect(submitter.submittedWithSuccess.dispatch).toHaveBeenCalledWith(mocks.pollingForm, mocks.submitFormPollingCheckResponse.pollData)

  it "will stop polling after receiving a pollCompleted message", ->
    jasmine.Clock.useMock()
    spyOn($, "ajax").andCallFake( (params)-> params.success(mocks.submitFormPollingCheckResponse))
    spyOn(submitter, "queryPoll").andCallThrough()
    spyOn(submitter.submittedWithSuccess, "dispatch")
    spyOn(submitter.submittedWithError, "dispatch")
    submitter.submitSuccess(mocks.pollingForm, { pollId:"1234" })
    expect(submitter.submittedWithSuccess.dispatch).toHaveBeenCalledWith(mocks.pollingForm, mocks.submitFormPollingCheckResponse.pollData)
    expect(submitter.submittedWithSuccess.dispatch.calls.length).toEqual 1
    jasmine.Clock.tick 501
    expect(submitter.submittedWithSuccess.dispatch.calls.length).toEqual 1

  it "can respond to an error-ridden polling form submission", ->
    spyOn($, "ajax").andCallFake( (params)-> params.error({}, "Error!"))
    spyOn(submitter.submittedWithError, "dispatch")
    submitter.submitForm(mocks.pollingForm)
    expect(submitter.submittedWithError.dispatch).toHaveBeenCalledWith(mocks.pollingForm, "Error!" )

  it "can respond to an error-ridden poll check", ->
    spyOn($, "ajax").andCallFake( (params)-> params.error({}, "Error!"))
    spyOn(submitter.submittedWithError, "dispatch")
    submitter.queryPoll(mocks.pollingForm, "1234")
    expect(submitter.submittedWithError.dispatch).toHaveBeenCalledWith(mocks.pollingForm, "Error!" )