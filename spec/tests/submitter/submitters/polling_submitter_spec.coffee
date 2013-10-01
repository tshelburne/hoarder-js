PollingSubmitter = require "hoarder/submitter/submitters/polling_submitter"
Form = require 'hoarder/form/form'

describe "PollingSubmitter", ->
	submitter = form = null
	reqwestSpy = null

	callbacks =
		successHappened: (form, data)->
		errorHappened: (form, xhr)->

	beforeEach ->
		createAddressFormFixture()

		form = new Form(document.getElementById('test-form'))
		submitter = new PollingSubmitter("/poll-url", 500)
		
		spyOn(callbacks, 'successHappened').andCallThrough()
		spyOn(callbacks, 'errorHappened').andCallThrough()
		submitter.submittedWithSuccess.add callbacks.successHappened
		submitter.submittedWithError.add callbacks.errorHappened
		reqwestSpy = spyOn(window, 'reqwest')

	describe '#submit', ->

		describe "when the submission is successful", ->

			it "will initiate a poll", ->
				spyOn(submitter, 'poll')
				reqwestSpy.andCallFake (params)-> params.success mocks.pollingSubmitSuccessResponse
				submitter.submit(form)
				expect(submitter.poll).toHaveBeenCalledWith(form, mocks.pollingSubmitSuccessResponse.processId)
			
		describe "when an error occurs in the submission", ->

			it "will call callbacks added to the submittedWithError signal", ->
				reqwestSpy.andCallFake (params)-> params.error mocks.errorXhr
				submitter.submit(form)
				expect(callbacks.errorHappened).toHaveBeenCalledWith(form, mocks.errorXhr)

	describe '#poll', ->

		beforeEach ->
			spyOn(submitter, "poll").andCallThrough()
			reqwestSpy.andCallFake (params)-> params.success mocks.pollingProcessNotCompletedResponse
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
					reqwestSpy.andCallFake (params)-> params.success mocks.pollingProcessCompletedResponse
					jasmine.Clock.tick 501

				it "will stop polling", ->
					expect(submitter.poll.calls.length).toEqual 2
					jasmine.Clock.tick 501
					expect(submitter.poll.calls.length).toEqual 2

				it "will call callbacks added to the submittedWithSuccess signal", ->
					expect(callbacks.successHappened).toHaveBeenCalledWith(form, mocks.pollingProcessCompletedResponse.processData)

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
				reqwestSpy.andCallFake (params)-> params.error mocks.errorXhr
				submitter.poll(form, "1234")
				expect(callbacks.errorHappened).toHaveBeenCalledWith(form, mocks.errorXhr)