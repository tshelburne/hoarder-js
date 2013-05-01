SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"

describe "SimpleSubmitter", ->
  submitter = null

  beforeEach ->
    submitter = new SimpleSubmitter()

  it "can submit a form, and respond to a successful submit", ->
    spyOn(submitter.submittedWithSuccess, "dispatch")
    spyOn($,"ajax").andCallFake( (params)-> params.success(mocks.submitSimpleFormResponse))
    submitter.submitForm(mocks.simpleForm)
    expect(submitter.submittedWithSuccess.dispatch).toHaveBeenCalledWith(mocks.simpleForm, mocks.submitSimpleFormResponse)

  it "can respond to an error-ridden submission", ->
    spyOn($, "ajax").andCallFake( (params)-> params.error({}, "Error!"))
    spyOn(submitter.submittedWithError, "dispatch")
    submitter.submitForm(mocks.simpleForm)
    expect(submitter.submittedWithError.dispatch).toHaveBeenCalledWith(mocks.simpleForm, "Error!" )