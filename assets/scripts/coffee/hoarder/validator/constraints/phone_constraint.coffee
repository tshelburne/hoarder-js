BaseConstraint = require 'hoarder/validator/constraints/base_constraint'

class PhoneConstraint extends BaseConstraint

  constructor: ->
    @type = "phone"

  rulePasses: (element)-> element.value.match(/^\d?[.(\-]?\d\d\d[.)\-]?\d\d\d[.\-]?\d\d\d\d$/)

  errorMessage: -> "Please enter a valid phone number."

return PhoneConstraint