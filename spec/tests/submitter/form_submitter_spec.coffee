FormSubmitter = require "hoarder/submitter/form_submitter"

Form = require 'hoarder/form/form'
SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"
PollingSubmitter = require "hoarder/submitter/submitters/polling_submitter"

describe "FormSubmitter", ->
  formSubmitter = pollingSubmitter = form = null
  reqwestSpy = null

  callbacks =
    successHappened: (form, data)->
    errorHappened: (form, errorMessage)->

  beforeEach ->
    createAddressFormFixture()

    form = new Form(document.getElementById('test-form'))
    pollingSubmitter = new PollingSubmitter("/poll-url", 500)
    formSubmitter = new FormSubmitter([ new SimpleSubmitter(), pollingSubmitter ])
    
    spyOn(callbacks, 'successHappened').andCallThrough()
    spyOn(callbacks, 'errorHappened').andCallThrough()
    formSubmitter.submittedWithSuccess.add callbacks.successHappened
    formSubmitter.submittedWithError.add callbacks.errorHappened
    reqwestSpy = spyOn(window, 'reqwest')

  describe '::create', ->

    beforeEach ->
      formSubmitter = FormSubmitter.create("/poll-url", 500)

    it "will create a default implementation of the FormSubmitter", ->
      expect(formSubmitter.constructor).toEqual FormSubmitter

    it "will add a simple submitter to the submitters list", ->
      simpleSubmitter = submitter for submitter in formSubmitter.submitters when submitter.constructor is SimpleSubmitter
      expect(simpleSubmitter).not.toBeNull()

    it "will add a polling submitter to the submitters list", ->
      pollingSubmitter = submitter for submitter in formSubmitter.submitters when submitter.constructor is PollingSubmitter
      expect(pollingSubmitter).not.toBeNull()
      expect(pollingSubmitter.pollUrl).toEqual '/poll-url'
      expect(pollingSubmitter.pollFrequency).toEqual 500

  describe '#submit', ->

    it "will successfully submit a simple form", ->
      reqwestSpy.andCallFake (params)-> params.success mocks.simpleSuccessResponse
      formSubmitter.submit form, 'simple'
      expect(callbacks.successHappened).toHaveBeenCalledWith form, mocks.simpleSuccessResponse

    it "will relay errors on a simple form submission", ->
      reqwestSpy.andCallFake (params)-> params.error mocks.errorXhr
      formSubmitter.submit form, 'simple'
      expect(callbacks.errorHappened).toHaveBeenCalledWith form, mocks.errorXhr

    it "will successfully submit a polling form", ->
      reqwestSpy.andCallFake (params)-> params.success mocks.pollingProcessCompletedResponse
      spyOn(pollingSubmitter, 'submit').andCallFake(-> pollingSubmitter.poll(form, "1234"))
      formSubmitter.submit form, 'polling'
      expect(callbacks.successHappened).toHaveBeenCalledWith form, mocks.pollingProcessCompletedResponse.processData

    it "will relay errors on a polling form submission", ->
      reqwestSpy.andCallFake (params)-> params.error mocks.errorXhr
      formSubmitter.submit form, 'polling'
      expect(callbacks.errorHappened).toHaveBeenCalledWith form, mocks.errorXhr