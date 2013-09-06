PollingSubmitter = require "hoarder/submitter/submitters/polling_submitter"
Form = require 'hoarder/form/form'

describe "PollingSubmitter", ->
	submitter = form = null

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
		createAddressFormFixture()

		form = new Form(document.getElementById('test-form'))
		submitter = new PollingSubmitter("/poll-url", 500)
		
		reqwestCallback = "success"
		spyOn(callbacks, 'successHappened').andCallThrough()
		spyOn(callbacks, 'errorHappened').andCallThrough()
		submitter.submittedWithSuccess.add callbacks.successHappened
		submitter.submittedWithError.add callbacks.errorHappened
		spyOn(window, 'reqwest').andCallFake(reqwestSpy)

	describe '#submit', ->

		describe "when the submission is successful", ->

			it "will initiate a poll", ->
				spyOn(submitter, 'poll')
				reqwestResponse = mocks.pollingSubmitSuccessResponse
				submitter.submit(form)
				expect(submitter.poll).toHaveBeenCalledWith(form, successResponse().processId)
			
		describe "when an error occurs in the submission", ->

			it "will call callbacks added to the submittedWithError signal", ->
				reqwestCallback = "error"
				reqwestResponse = mocks.errorResponse
				submitter.submit(form)
				expect(callbacks.errorHappened).toHaveBeenCalledWith(form, errorResponse())

	describe '#poll', ->

		beforeEach ->
			spyOn(submitter, "poll").andCallThrough()
			reqwestResponse = mocks.pollingProcessNotCompletedResponse
			jasmine.Clock.useMock()
			submitter.poll(form, "1234")

		it "will poll with the given frequency", ->
			expect(submitter.poll.calls.length).toEqual 1
			jasmine.Clock.tick 501
			expect(submitter.poll.calls.length).toEqual 2
			jasmine.Clock.tick 501
			expect(submitter.poll.calls.length).toEqual 3

		describe "when the poll is successful", ->

			describe "and the process has completed", ->

				beforeEach ->
					reqwestResponse = mocks.pollingProcessCompletedResponse
					jasmine.Clock.tick 501

				it "will stop polling", ->
					expect(submitter.poll.calls.length).toEqual 2
					jasmine.Clock.tick 501
					expect(submitter.poll.calls.length).toEqual 2

				it "will call callbacks added to the submittedWithSuccess signal", ->
					expect(callbacks.successHappened).toHaveBeenCalledWith(form, successResponse().processData)

			describe "and the process has not yet completed", ->

				beforeEach ->
					jasmine.Clock.tick 501

				it "will initiate another poll", ->
					expect(submitter.poll.calls.length).toBeGreaterThan 1

				it "will continue to use the same process id", ->
					expect(submitter.poll.mostRecentCall.args[1]).toEqual '1234'
				
				it "will not call callbacks added to the submittedWithSuccess signal", ->
					expect(callbacks.successHappened).not.toHaveBeenCalled()

		describe "when an error occurs in the polling", ->

			it "will call callbacks added to the submittedWithError signal", ->
				reqwestCallback = "error"
				reqwestResponse = mocks.errorResponse
				submitter.poll(form, "1234")
				expect(callbacks.errorHappened).toHaveBeenCalledWith(form, errorResponse())