FormSerializer = require 'hoarder/form/form_serializer'

class Form

	constructor: (@formElement)->
		@addedElements = []
		@permanentElements = []

	elements: -> (@formElement[index] for index in [0..@formElement.length] when @formElement[index]?.nodeName in [ 'INPUT', 'SELECT', 'TEXTAREA' ])

	action: -> @formElement.action

	method: -> @formElement.method

	isValid: -> @formElement.checkValidity()

	submitButton: -> (element for element in @formElement.elements when element.type is 'submit')[0]

	addElement: (name, value, isPermanent=false)=>
		throw new Error "'#{name}' already exists as an element on the form." if @hasElement name
		element = _createElement name, value
		@formElement.appendChild element
		if isPermanent then @permanentElements.push element else @addedElements.push element
		element

	addElements: (elements, arePermanent=false)=>
		errors = [ ]
		for element in elements
			try @addElement(element.name, element.value, arePermanent) 
			catch e 
				errors.push e
		throw errors[0] if errors.length

	hasElement: (name)-> @getElement(name)?

	getElement: (name)-> @formElement[name] if @formElement[name] instanceof HTMLElement

	updateAddedElement: (name, value)=> if @formElement[name]? then @formElement[name].value = value else @addElement name, value

	clearAddedElements: =>
		@formElement.removeChild element for element in @addedElements
		@addedElements = []

	serialize: -> FormSerializer.toString @


	# private

	_createElement = (name, value)->
		element = document.createElement("input")
		element.type = "hidden"
		element.name = name
		element.value = value
		element

return Form