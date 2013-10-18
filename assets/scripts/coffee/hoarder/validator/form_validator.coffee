CreditCardConstraint = require "hoarder/validator/constraints/credit_card_constraint"

class FormValidator

  @libraryConstraints = [
      new CreditCardConstraint()
    ]
    
  @create: (constraints=[])-> 
    constraints.push constraint for constraint in FormValidator.libraryConstraints
    new @(constraints)

  constructor: (@constraints)->

  validateForm: (form)->
    @validateElement(element) for element in form.elements()
    form.isValid()

  validateElement: (element)->
    _clearCustomErrorOn element
    
    type = element.getAttribute("type")
    for constraint in @constraints
      constraint.handle(element, type) if constraint.canHandle type
      break unless _isValid element

    _isValid element

  # private

  _clearCustomErrorOn = (element)-> _markValidityAs element, ""

  _markValidityAs = (element, message)-> element.setCustomValidity message

  _isValid = (element)-> element.validity.valid

return FormValidator