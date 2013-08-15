FormSubmitter = require "hoarder/submitter/form_submitter"

Form = require 'hoarder/form/form'
SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"
PollingSubmitter = require "hoarder/submitter/submitters/polling_submitter"

describe "FormSubmitter", ->
  formSubmitter = pollingSubmitter = form = null

  reqwestCallback = null
  reqwestResponse = null
  reqwestSpy = (params)-> params[reqwestCallback].apply null, reqwestResponse

  # these are a result of using Function::apply above
  successResponse = -> reqwestResponse[0]
  errorResponse = -> reqwestResponse[1]

  callbacks =
    successHappened: (form, data)->
    errorHappened: (form, errorMessage)->

  beforeEach ->
    createTestFormFixture()

    form = new Form(document.getElementById('test-form'))
    pollingSubmitter = new PollingSubmitter("/poll-url", 500)
    formSubmitter = new FormSubmitter([ new SimpleSubmitter(), pollingSubmitter ])
    
    reqwestCallback = "success"
    spyOn(callbacks, 'successHappened').andCallThrough()
    spyOn(callbacks, 'errorHappened').andCallThrough()
    formSubmitter.submittedWithSuccess.add callbacks.successHappened
    formSubmitter.submittedWithError.add callbacks.errorHappened
    spyOn(window, 'reqwest').andCallFake(reqwestSpy)

  describe '::create', ->

    it "will create a default implementation of the FormSubmitter", ->
      expect(FormSubmitter.create("/poll-url", 500).constructor).toEqual FormSubmitter

  describe '#submit', ->

    it "will successfully submit a simple form", ->
      reqwestResponse = mocks.simpleSuccessResponse
      formSubmitter.submit form, 'simple'
      expect(callbacks.successHappened).toHaveBeenCalledWith form, successResponse()

    it "will relay errors on a simple form submission", ->
      reqwestCallback = 'error'
      reqwestResponse = mocks.errorResponse
      formSubmitter.submit form, 'simple'
      expect(callbacks.errorHappened).toHaveBeenCalledWith form, errorResponse()

    it "will successfully submit a polling form", ->
      reqwestResponse = mocks.pollingProcessCompletedResponse
      spyOn(pollingSubmitter, 'submit').andCallFake(-> pollingSubmitter.poll(form, "1234"))
      formSubmitter.submit form, 'polling'
      expect(callbacks.successHappened).toHaveBeenCalledWith form, successResponse().processData

    it "will relay errors on a polling form submission", ->
      reqwestCallback = 'error'
      reqwestResponse = mocks.errorResponse
      formSubmitter.submit form, 'polling'
      expect(callbacks.errorHappened).toHaveBeenCalledWith form, errorResponse()