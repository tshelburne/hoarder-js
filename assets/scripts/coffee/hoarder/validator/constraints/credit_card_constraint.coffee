BaseConstraint = require 'hoarder/validator/constraints/base_constraint'

class CreditCardConstraint extends BaseConstraint

  constructor: ->
    @type = "credit-card"

  rulePasses: (element)-> element.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)

  errorMessage: -> "Please enter a valid credit card number."

return CreditCardConstraint