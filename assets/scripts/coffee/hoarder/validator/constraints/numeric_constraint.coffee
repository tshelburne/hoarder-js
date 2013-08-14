BaseConstraint = require "hoarder/validator/constraints/base_constraint"

class NumericConstraint extends BaseConstraint

  constructor: ->
    @type = "numeric"

  rulePasses: (element)-> element.value.match(/^[0-9]*$/)

  errorMessage: -> "This field only accepts numbers (0-9)."

return NumericConstraint