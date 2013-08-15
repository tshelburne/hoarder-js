ValidationRule = require 'hoarder/validator/rules/validation_rule'

AlphaConstraint = require "hoarder/validator/constraints/alpha_constraint"
AlphanumericConstraint = require "hoarder/validator/constraints/alphanumeric_constraint"
CreditCardConstraint = require "hoarder/validator/constraints/credit_card_constraint"
EmailConstraint = require "hoarder/validator/constraints/email_constraint"
MaxLengthConstraint = require "hoarder/validator/constraints/max_length_constraint"
MinLengthConstraint = require "hoarder/validator/constraints/min_length_constraint"
NumericConstraint = require "hoarder/validator/constraints/numeric_constraint"
PhoneConstraint = require "hoarder/validator/constraints/phone_constraint"
RequiredConstraint = require "hoarder/validator/constraints/required_constraint"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# a class to validate forms and form elements
#
class FormValidator

  @libraryConstraints = [
      new AlphaConstraint()
      new AlphanumericConstraint()
      new CreditCardConstraint()
      new EmailConstraint()
      new MaxLengthConstraint()
      new MinLengthConstraint()
      new NumericConstraint()
      new PhoneConstraint()
      new RequiredConstraint()
    ]
    
  @create: -> new @(FormValidator.libraryConstraints)

  constructor: (@constraints)->

  validateForm: (form)->
    isValid = true
    for element in form.elements()
      isValid = false unless @validateElement(element)
    isValid

  validateElement: (element)->
    for ruleString in validationStringsFrom element
      rule = ValidationRule.fromString ruleString

      for constraint in @constraints
        constraint.handle(element, rule) if constraint.canHandle rule
        break unless isValid element

      break unless isValid element

    isValid element

  # private

  validationStringsFrom = (element)->
    validationAttribute = element.getAttribute("data-validation") 
    return [] unless validationAttribute? 
    (ruleString.trim() for ruleString in validationAttribute.split(',')) 

  isValid = (element)-> not element.validity.customError

return FormValidator