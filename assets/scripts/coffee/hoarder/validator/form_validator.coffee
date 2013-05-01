#AlphaConstraint = require "/hoarder/validator/constraints/alpha_constraint"
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
  constructor: (@constraints)->
    
  @default: ->
    new @([
      new AlphanumericConstraint()
      new CreditCardConstraint()
      new EmailConstraint()
      new MaxLengthConstraint()
      new MinLengthConstraint()
      new NumericConstraint()
      new PhoneConstraint()
      new RequiredConstraint()
    ])

  validateForm: (form)->
    errors = []
    for element in form.elements()
      errors = errors.concat @validateElement(element)
    errors

  validateElement: (element)->
    for rule in element.validationRules
      ruleParts = rule.split('=')
      type = ruleParts[0]
      context = {}
      context.value = ruleParts[1] if ruleParts.length > 1

      for constraint in @constraints
        if constraint.canHandle type
          errors = constraint.handle element, context
          if errors.length > 0
            element.addError(errors[0])
            return errors

    return []

return FormValidator