BaseConstraint = require 'hoarder/validator/constraints/base_constraint'

class RequiredConstraint extends BaseConstraint

  constructor: ->
    @type = "required"

  rulePasses: (element)-> element.value? and element.value isnt ""

  errorMessage: -> "This field is required."

return RequiredConstraint