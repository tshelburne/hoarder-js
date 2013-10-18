require 'patches/event_listeners'
require 'lib/H5F'

Signal = require "cronus/signal"
SignalRelay = require "cronus/signal_relay"

Form = require 'hoarder/form/form'
FormSubmitter = require 'hoarder/submitter/form_submitter'
FormValidator = require 'hoarder/validator/form_validator'

class FormManager

	@create: (pollingUrl="", pollFrequency=1000, customConstraints=[])->
		new @(FormSubmitter.create(pollingUrl, pollFrequency), FormValidator.create(customConstraints))

	constructor: (@submitter, @validator)->
		@validatedWithErrors = new Signal()
		@submittedWithSuccess = new SignalRelay(@submitter.submittedWithSuccess)
		@submittedWithError = new SignalRelay(@submitter.submittedWithError)
		@submitter.submittedWithSuccess.add reEnableSubmit
		@submitter.submittedWithError.add reEnableSubmit
		@_forms = []
		@_listeners = {}

	manage: (formId, type='simple')-> 
		throw new Error "'#{formId}' is already a managed form." if getForm.call(@, formId)?
		form = buildHoarderForm.call @, formId, type
		@_forms.push form
		form

	release: (formId)->
		form = getForm.call @, formId
		form.formElement.removeEventListener 'click', @_listeners[formId]['click']
		form.formElement.removeEventListener 'submit', @_listeners[formId]['submit']
		delete @_listeners[formId]
		@_forms.splice @_forms.indexOf(form), 1

	# private

	getForm = (formId)-> 
		for form in @_forms 
			return form if form.formElement.id is formId 

	validate = (form)-> @validatedWithErrors.dispatch form unless @validator.validateForm form

	submit = (form, type)-> @submitter.submit form, type

	buildHoarderForm = (formId, type)->
		formElement = document.getElementById formId
		H5F.setup formElement # make sure our form is HTML5 compliant
		form = new Form(formElement)
		@_listeners[formId] = {}
		formElement.addEventListener 'click', @_listeners[formId]['click'] = (event)=>
			validate.call @, form if event.target.type is 'submit'
		formElement.addEventListener 'submit', @_listeners[formId]['submit'] = (event)=>
			event.preventDefault()
			form.submitButton().disabled = true
			submit.call @, form, type if form.isValid()
		form

	reEnableSubmit = (form)-> form.submitButton().disabled = false

return FormManager