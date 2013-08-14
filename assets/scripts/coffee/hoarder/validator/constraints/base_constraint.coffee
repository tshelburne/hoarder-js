ValidationError = require 'hoarder/validator/error/validation_error'

class BaseConstraint

	constructor: ->
		@type = null

	canHandle: (rule)-> rule.type is @type

	handle: (element, rule)-> @createError(element, rule) unless @rulePasses(element, rule)

	createError: (element, rule)-> throw new ValidationError @errorMessage(rule), element

return BaseConstraint