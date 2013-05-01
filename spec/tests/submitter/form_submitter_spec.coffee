FormSubmitter = require "hoarder/submitter/form_submitter"

describe "FormSubmitter", ->
  formSubmitter = null
  response = null
  success = (form, data)->
    response = { form : form, data : data }
  error = (form, text)->
    response = { form : form, text : text }

  beforeEach ->
    response = null
    formSubmitter = FormSubmitter.default("http://mydomain.com/my/polling/url")
    formSubmitter.submittedWithSuccess.add(success)
    formSubmitter.submittedWithError.add(error)

  it "can successfully submit a simple form", ->
    spyOn(formSubmitter.submitters[0], "submitForm").andCallFake (form)-> @submitSuccess(form, "simple")
    formSubmitter.submitForm mocks.simpleForm
    expect(response.form).toBe mocks.simpleForm
    expect(response.data).toEqual "simple"

  it "can relay errors on a simple form submission", ->
    spyOn(formSubmitter.submitters[0], "submitForm").andCallFake (form)-> @submitError(form, {}, "simple error")
    formSubmitter.submitForm mocks.simpleForm
    expect(response.form).toBe mocks.simpleForm
    expect(response.text).toEqual "simple error"

  it "can successfully submit a polling form", ->
    spyOn(formSubmitter.submitters[1], "submitForm").andCallFake (form)-> @submitSuccess(form, { pollId: "1234" })
    spyOn(formSubmitter.submitters[1], "queryPoll").andCallFake (form, pollId)-> @pollSuccess(form, pollId, { pollCompleted: true, pollData: "polling" })
    formSubmitter.submitForm mocks.pollingForm
    expect(response.form).toBe mocks.pollingForm
    expect(response.data).toEqual "polling"

  it "can relay errors on a polling form submission", ->
    spyOn(formSubmitter.submitters[1], "submitForm").andCallFake (form)-> @submitError(form, {}, "polling error")
    formSubmitter.submitForm mocks.pollingForm
    expect(response.form).toBe mocks.pollingForm
    expect(response.text).toEqual "polling error"

  it "can relay errors on a polling check submission", ->
    spyOn(formSubmitter.submitters[1], "submitForm").andCallFake (form)-> @submitSuccess(form, { pollId: "1234" })
    spyOn(formSubmitter.submitters[1], "queryPoll").andCallFake (form, pollId)-> @submitError(form, {}, "polling error")
    formSubmitter.submitForm mocks.pollingForm
    expect(response.form).toBe mocks.pollingForm
    expect(response.text).toEqual "polling error"