FormSerializer = require 'hoarder/form/form_serializer'

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# wraps an HTML form for easier form management
#
class Form

	constructor: (formId, @type)->
		@form = document.getElementById formId
		@addedElements = [ ]

	elements: -> (@form[index] for index in [0..@form.length] when @form[index]?.nodeName in [ 'INPUT', 'SELECT', 'TEXTAREA' ])

	action: -> @form.action

	method: -> @form.method

	addElement: (name, value)->
		throw new Error "'#{name}' already exists as an element on the form." if @form[name]?
		element = createElement name, value
		@form.appendChild element
		@addedElements.push element
		element

	addElements: (elements)->
		errors = [ ]
		for element in elements
			try @addElement(element.name, element.value) 
			catch e 
				errors.push e
		throw error for error in errors

	getElement: (name)-> @form[name]

	updateAddedElement: (name, value)-> if @form[name]? then @form[name].value = value else @addElement name, value

	clearAddedElements: ->
		@form.removeChild element for element in @addedElements
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