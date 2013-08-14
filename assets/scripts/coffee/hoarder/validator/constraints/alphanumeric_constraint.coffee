BaseConstraint = require 'hoarder/validator/constraints/base_constraint'

class AlphanumericConstraint extends BaseConstraint

  constructor: ->
    @type = "alphanumeric"

  rulePasses: (element)-> element.value.match(/^[A-Za-z0-9\s]*$/)

  errorMessage: -> "This field only accepts numbers and characters (0-9, A-Z, a-z)."

return AlphanumericConstraint