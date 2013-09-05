CreditCardConstraint = require "hoarder/validator/constraints/credit_card_constraint"

class FormValidator

  @libraryConstraints = [
      new CreditCardConstraint()
    ]
    
  @create: -> new @(FormValidator.libraryConstraints)

  constructor: (@constraints)->

  validateForm: (form)->
    @validateElement(element) for element in form.elements()
    form.isValid()

  validateElement: (element)->
    clearCustomErrorOn element
    
    type = element.getAttribute("type")
    for constraint in @constraints
      constraint.handle(element, type) if constraint.canHandle type
      break unless isValid element

    isValid element

  # private

  clearCustomErrorOn = (element)-> markValidityAs element, ""

  markValidityAs = (element, message)-> element.setCustomValidity message

  isValid = (element)-> element.validity.valid

return FormValidator