BaseConstraint = require 'hoarder/validator/constraints/base_constraint'

class AlphaConstraint extends BaseConstraint

  constructor: ->
    @type = "alpha"

  rulePasses: (element)-> element.value.match(/^[A-Za-z\s]*$/)

  errorMessage: -> "This field only accepts numbers and characters (0-9, A-Z, a-z)."

return AlphaConstraint