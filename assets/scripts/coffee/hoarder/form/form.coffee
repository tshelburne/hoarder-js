FormSerializer = require 'hoarder/form/form_serializer'

class Form

	constructor: (@formElement)->
		@addedElements = [ ]

	elements: -> (@formElement[index] for index in [0..@formElement.length] when @formElement[index]?.nodeName in [ 'INPUT', 'SELECT', 'TEXTAREA' ])

	action: -> @formElement.action

	method: -> @formElement.method

	checkValidity: -> @formElement.checkValidity()

	addElement: (name, value)->
		throw new Error "'#{name}' already exists as an element on the form." if @hasElement name
		element = createElement name, value
		@formElement.appendChild element
		@addedElements.push element
		element

	addElements: (elements)->
		errors = [ ]
		for element in elements
			try @addElement(element.name, element.value) 
			catch e 
				errors.push e
		throw errors[0] if errors.length

	hasElement: (name)-> @getElement(name)?

	getElement: (name)-> @formElement[name] if @formElement[name] instanceof HTMLElement

	updateAddedElement: (name, value)-> if @formElement[name]? then @formElement[name].value = value else @addElement name, value

	clearAddedElements: ->
		@formElement.removeChild element for element in @addedElements
		@addedElements = []

	serialize: -> FormSerializer.toString @


	# private

	createElement = (name, value)->
		element = document.createElement("input")
		element.type = "hidden"
		element.name = name
		element.value = value
		element

return Form