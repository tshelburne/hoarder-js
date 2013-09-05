FormManager = require "hoarder/form_manager"
FormValidator = require 'hoarder/validator/form_validator'
FormSubmitter = require 'hoarder/submitter/form_submitter'
Form = require 'hoarder/form/form'

describe "FormManager", ->
	manager = submitter = validator = null

	reqwestCallback = null
	reqwestResponse = null
	reqwestSpy = (params)-> params[reqwestCallback].apply null, reqwestResponse

	# these are a result of using Function::apply above
	successResponse = -> reqwestResponse[0]
	errorResponse = -> reqwestResponse[1]

	callbacks =
		validateErrorHappened: (form)->
		submitSuccessHappened: (form, data)->
		submitErrorHappened: (form, errorMessage)->

	beforeEach ->
		createCreditCardFormFixture()

		submitter = FormSubmitter.create('/polling-url', 500)
		validator = FormValidator.create()
		manager = new FormManager(submitter, validator)

		reqwestCallback = "success"
		spyOn(callbacks, 'validateErrorHappened').andCallThrough()
		spyOn(callbacks, 'submitSuccessHappened').andCallThrough()
		spyOn(callbacks, 'submitErrorHappened').andCallThrough()
		manager.validatedWithErrors.add callbacks.validateErrorHappened
		manager.submittedWithSuccess.add callbacks.submitSuccessHappened
		manager.submittedWithError.add callbacks.submitErrorHappened
		spyOn(window, 'reqwest').andCallFake(reqwestSpy)

	describe '::create', ->

		it "will return a FormManager using the default classes", ->
			expect(FormManager.create().constructor).toEqual FormManager

	describe '#manage', ->
		form = null

		beforeEach ->
			form = manager.manage('test-form')

		it "will return a Hoarder form", ->
			expect(form.constructor).toEqual Form

		it "will throw if the form is already managed", ->
			expect(-> manager.manage('test-form')).toThrow()

		describe "when the submit button is clicked", ->

			describe "and all or part of the form is invalid", ->

				beforeEach ->
					spyOn(submitter, 'submit')
					document.getElementById('card-number').value = '12345'
					document.getElementById('submit').click()

				it "will call callbacks added to the validatedWithErrors signal", ->
					expect(callbacks.validateErrorHappened).toHaveBeenCalledWith(form)

				it "will not submit the form", ->
					expect(submitter.submit).not.toHaveBeenCalled()

			describe "and the form is valid", ->

				it "will attempt to submit the form", ->
					spyOn(submitter, 'submit')
					reqwestResponse = mocks.simpleSuccessResponse
					document.getElementById('submit').click()
					expect(submitter.submit).toHaveBeenCalledWith(form, 'simple')

				describe "and submission is successful", ->

					beforeEach ->
						reqwestResponse = mocks.simpleSuccessResponse
						document.getElementById('submit').click()

					it "will call callbacks added to the submittedWithSuccess", ->
						expect(callbacks.submitSuccessHappened).toHaveBeenCalledWith(form, successResponse())

				describe "and submission is not successful", ->

					beforeEach ->
						reqwestCallback = 'error'
						reqwestResponse = mocks.errorResponse
						document.getElementById('submit').click()

					it "will call callbacks added to the submittedWithError", ->
						expect(callbacks.submitErrorHappened).toHaveBeenCalledWith(form, errorResponse())

	describe '#release', ->
		formElement = null

		beforeEach ->
			formElement = document.getElementById 'test-form'
			formElement.addEventListener 'submit', (e)-> e.preventDefault()

			manager.manage 'test-form'
			manager.release 'test-form'

		it "will allow re-managing the form without throwing an error", ->
			expect(-> manager.manage 'test-form').not.toThrow()

		it "will no longer call the validation callbacks", ->
			document.getElementById('card-number').value = '12345'
			document.getElementById('submit').click()
			expect(callbacks.validateErrorHappened).not.toHaveBeenCalled()

		it "will no longer call the success callbacks", ->
			reqwestResponse = mocks.simpleSuccessResponse
			document.getElementById('submit').click()
			expect(callbacks.submitSuccessHappened).not.toHaveBeenCalled()

		it "will no longer call the error callbacks", ->
			reqwestCallback = 'error'
			reqwestResponse = mocks.errorResponse
			document.getElementById('submit').click()
			expect(callbacks.submitErrorHappened).not.toHaveBeenCalled()
