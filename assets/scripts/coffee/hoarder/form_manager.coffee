require 'patches/event_listeners'
require 'lib/H5F'

Signal = require "cronus/signal"
SignalRelay = require "cronus/signal_relay"

Form = require 'hoarder/form/form'
FormSubmitter = require 'hoarder/submitter/form_submitter'
FormValidator = require 'hoarder/validator/form_validator'

class FormManager

	@create: (pollingUrl="", pollFrequency=1000)->
		new @(FormSubmitter.create(pollingUrl, pollFrequency), FormValidator.create())

	constructor: (@formSubmitter, @formValidator)->
		@validatedWithErrors = new Signal()
		@submittedWithSuccess = new SignalRelay(@formSubmitter.submittedWithSuccess)
		@submittedWithError = new SignalRelay(@formSubmitter.submittedWithError)
		@_forms = [ ]
		@_listeners = { }

	manage: (formId, type='simple')-> 
		throw new Error "'#{formId}' is already a managed form." if getForm.call(@, formId)?
		form = setupHoarderForm.call @, formId, type
		@_forms.push form
		form

	release: (formId)->
		form = getForm.call @, formId
		form.formElement.removeEventListener 'submit', @_listeners[formId]
		delete @_listeners[formId]
		@_forms.splice @_forms.indexOf(form), 1

	getForm = (formId)-> 
		for form in @_forms 
			return form if form.formElement.id is formId

	submit = (form, type)-> 
		if @formValidator.validateForm form
			@formSubmitter.submit form, type
		else 
			@validatedWithErrors.dispatch form

	setupHoarderForm = (formId, type)->
		formElement = document.getElementById formId
		H5F.setup formElement # make sure our form is HTML5 compliant
		form = new Form(formElement)
		formElement.addEventListener 'submit', @_listeners[formId] = (event)=>
			event.preventDefault()
			submit.call @, form, type
		form

return FormManager