BaseConstraint = require "hoarder/validator/constraints/base_constraint"

class MinLengthConstraint extends BaseConstraint
  
  constructor: ->
    @type = "minLength"

  rulePasses: (element, rule)-> element.value.length >= rule.context

  errorMessage: (rule)-> "The minimum length of this field is #{rule.context}."

return MinLengthConstraint