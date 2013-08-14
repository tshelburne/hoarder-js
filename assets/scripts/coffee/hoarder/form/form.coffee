FormSerializer = require 'hoarder/form/form_serializer'

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# wraps an HTML form for easier form management
#
class Form

	constructor: (@formElement)->
		@addedElements = [ ]

	elements: -> (@formElement[index] for index in [0..@formElement.length] when @formElement[index]?.nodeName in [ 'INPUT', 'SELECT', 'TEXTAREA' ])

	action: -> @formElement.action

	method: -> @formElement.method

	addElement: (name, value)->
		throw new Error "'#{name}' already exists as an element on the form." if @formElement[name]?
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

	getElement: (name)-> @formElement[name]

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