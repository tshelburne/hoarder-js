class ValidationRule

	constructor: (@type, @context=null)->

	@fromString: (ruleString)->
    ruleParts = ruleString.split('=')
    context = if ruleParts[1]? then ruleParts[1] else null
    new @(ruleParts[0], context)

return ValidationRule