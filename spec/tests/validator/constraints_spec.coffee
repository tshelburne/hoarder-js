FormElement = require 'hoarder/form/form_element'

#AlphaConstraint = require "/hoarder/validator/constraints/alpha_constraint"
AlphanumericConstraint = require "hoarder/validator/constraints/alphanumeric_constraint"
CreditCardConstraint = require "hoarder/validator/constraints/credit_card_constraint"
EmailConstraint = require "hoarder/validator/constraints/email_constraint"
MaxLengthConstraint = require "hoarder/validator/constraints/max_length_constraint"
MinLengthConstraint = require "hoarder/validator/constraints/min_length_constraint"
NumericConstraint = require "hoarder/validator/constraints/numeric_constraint"
PhoneConstraint = require "hoarder/validator/constraints/phone_constraint"
RequiredConstraint = require "hoarder/validator/constraints/required_constraint"

describe "Validator Constraints", ->
  it "can require that a value be alphanumeric only", ->
    constraint = new AlphanumericConstraint()
    validElement = new FormElement("fullName", "71m5h3lburn3")
    invalidElement = new FormElement("fullName", "T!m $h3lbur*3")
    expect(constraint.handle(validElement)).toEqual []
    expect(constraint.handle(invalidElement)[0].message).toEqual "This field only accepts numbers and characters (0-9, A-Z, a-z)."

  it "can require that a value be a valid credit card number", ->
    constraint = new CreditCardConstraint()
    validElement = new FormElement("number", "4111111111111111")
    invalidElement = new FormElement("number", "12345")
    expect(constraint.handle(validElement)).toEqual []
    expect(constraint.handle(invalidElement)[0].message).toEqual "Please enter a valid credit card number."

  it "can require that a value be a valid email address", ->
    constraint = new EmailConstraint()
    validElement = new FormElement("email", "tim@musiconelive.com")
    invalidElement = new FormElement("email", "tim she@d")
    expect(constraint.handle(validElement)).toEqual []
    expect(constraint.handle(invalidElement)[0].message).toEqual "Please enter a valid email address."

  it "can require that a value have a maximum length", ->
    constraint = new MaxLengthConstraint()
    validElement = new FormElement("zipCode", "78765")
    validElementTwo = new FormElement("zipCode", "787")
    invalidElement = new FormElement("zipCode", "787657")
    expect(constraint.handle(validElement, { value: 5 })).toEqual []
    expect(constraint.handle(validElementTwo, { value: 5 })).toEqual []
    expect(constraint.handle(invalidElement, { value: 5 })[0].message).toEqual "The maximum length of this field is 5."

  it "can require that a value have a minimum length", ->
    constraint = new MinLengthConstraint()
    validElement = new FormElement("zipCode", "78765")
    validElementTwo = new FormElement("zipCode", "787643")
    invalidElement = new FormElement("zipCode", "787")
    expect(constraint.handle(validElement, { value: 5 })).toEqual []
    expect(constraint.handle(validElementTwo, { value: 5 })).toEqual []
    expect(constraint.handle(invalidElement, { value: 5 })[0].message).toEqual "The minimum length of this field is 5."

  it "can require that a value be numeric only", ->
    constraint = new NumericConstraint()
    validElement = new FormElement("zipCode", "78765")
    invalidElement = new FormElement("zipCode", "Seven8765")
    expect(constraint.handle(validElement)).toEqual []
    expect(constraint.handle(invalidElement)[0].message).toEqual "This field only accepts numbers (0-9)."

  it "can require that a value be a valid phone number", ->
    constraint = new PhoneConstraint()
    validElement = new FormElement("phone", "(555)555-5555")
    invalidElement = new FormElement("phone", "12341")
    expect(constraint.handle(validElement)).toEqual []
    expect(constraint.handle(invalidElement)[0].message).toEqual "Please enter a valid phone number."

  it "can require that a value be required", ->
    constraint = new RequiredConstraint()
    validElement = new FormElement("fullName", "Tim Shelburne")
    invalidElement = new FormElement("fullName", "")
    invalidElementTwo = new FormElement("fullName", null)
    expect(constraint.handle(validElement)).toEqual []
    expect(constraint.handle(invalidElement)[0].message).toEqual "This field is required."
    expect(constraint.handle(invalidElementTwo)[0].message).toEqual "This field is required."