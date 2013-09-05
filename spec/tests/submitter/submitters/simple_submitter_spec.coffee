SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"
Form = require 'hoarder/form/form'

describe "SimpleSubmitter", ->
	submitter = form = null

	reqwestCallback = "success"
	reqwestResponse = null
	reqwestSpy = (params)-> params[reqwestCallback].apply null, reqwestResponse

	# these are a result of using Function::apply above
	successResponse = -> reqwestResponse[0]
	errorResponse = -> reqwestResponse[1]

	callbacks =
		successHappened: (form, data)->
		errorHappened: (form, errorMessage)->

	beforeEach ->
		createAddressFormFixture()

		form = new Form(document.getElementById('test-form'))
		submitter = new SimpleSubmitter()
		spyOn(callbacks, 'successHappened').andCallThrough()
		spyOn(callbacks, 'errorHappened').andCallThrough()
		submitter.submittedWithSuccess.add callbacks.successHappened
		submitter.submittedWithError.add callbacks.errorHappened
		spyOn(window, 'reqwest').andCallFake(reqwestSpy)

	describe '#submit', ->

		describe "when the submission is successful", ->

			it "will call callbacks added to the submittedWithSuccess signal", ->
				reqwestResponse = mocks.simpleSuccessResponse
				submitter.submit(form)
				expect(callbacks.successHappened).toHaveBeenCalledWith(form, successResponse())
			
		describe "when an error occurs in the submission", ->

			it "will call callbacks added to the submittedWithError signal", ->
				reqwestCallback = 'error'
				reqwestResponse = mocks.errorResponse
				submitter.submit(form)
				expect(callbacks.errorHappened).toHaveBeenCalledWith(form, errorResponse())