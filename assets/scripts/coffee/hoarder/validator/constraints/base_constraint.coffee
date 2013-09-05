class BaseConstraint

	constructor: ->
		@type = null

	canHandle: (type)-> type is @type

	handle: (element, type)-> element.setCustomValidity @errorMessage(element) unless @rulePasses element

return BaseConstraint