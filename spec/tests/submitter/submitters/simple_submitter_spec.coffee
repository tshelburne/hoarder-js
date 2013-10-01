SimpleSubmitter = require "hoarder/submitter/submitters/simple_submitter"
Form = require 'hoarder/form/form'

describe "SimpleSubmitter", ->
	submitter = form = null
	reqwestSpy = null

	callbacks =
		successHappened: (form, data)->
		errorHappened: (form, xhr)->

	beforeEach ->
		createAddressFormFixture()

		form = new Form(document.getElementById('test-form'))
		submitter = new SimpleSubmitter()

		spyOn(callbacks, 'successHappened').andCallThrough()
		spyOn(callbacks, 'errorHappened').andCallThrough()
		submitter.submittedWithSuccess.add callbacks.successHappened
		submitter.submittedWithError.add callbacks.errorHappened
		reqwestSpy = spyOn(window, 'reqwest')

	describe '#submit', ->

		describe "when the submission is successful", ->

			it "will call callbacks added to the submittedWithSuccess signal", ->
				reqwestSpy.andCallFake (params)-> params.success mocks.simpleSuccessResponse
				submitter.submit(form)
				expect(callbacks.successHappened).toHaveBeenCalledWith(form, mocks.simpleSuccessResponse)
			
		describe "when an error occurs in the submission", ->

			it "will call callbacks added to the submittedWithError signal", ->
				reqwestSpy.andCallFake (params)-> params.error mocks.errorXhr
				submitter.submit(form)
				expect(callbacks.errorHappened).toHaveBeenCalledWith(form, mocks.errorXhr)