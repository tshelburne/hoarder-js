class BaseConstraint

	constructor: ->
		@type = null

	canHandle: (rule)-> rule.type is @type

	handle: (element, rule)-> element.setCustomValidity @errorMessage(rule, element) unless @rulePasses element, rule

return BaseConstraint