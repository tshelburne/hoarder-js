BaseConstraint = require "hoarder/validator/constraints/base_constraint"

class MaxLengthConstraint extends BaseConstraint
  
  constructor: ->
    @type = "maxLength"

  rulePasses: (element, rule)-> element.value.length <= rule.context

  errorMessage: (rule)-> "The maximum length of this field is #{rule.context}."

return MaxLengthConstraint