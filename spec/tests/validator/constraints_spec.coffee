AlphaConstraint = require "hoarder/validator/constraints/alpha_constraint"
AlphanumericConstraint = require "hoarder/validator/constraints/alphanumeric_constraint"
CreditCardConstraint = require "hoarder/validator/constraints/credit_card_constraint"
EmailConstraint = require "hoarder/validator/constraints/email_constraint"
MaxLengthConstraint = require "hoarder/validator/constraints/max_length_constraint"
MinLengthConstraint = require "hoarder/validator/constraints/min_length_constraint"
NumericConstraint = require "hoarder/validator/constraints/numeric_constraint"
PhoneConstraint = require "hoarder/validator/constraints/phone_constraint"
RequiredConstraint = require "hoarder/validator/constraints/required_constraint"

describe "Validator Constraints", ->

	newElement = (name, value)-> { name: name, value: value }

	it "can require that a value be alpha only", ->
		constraint = new AlphaConstraint()
		validElement = newElement("fullName", "ABCabc")
		invalidElement = newElement("fullName", "a1b2c3")
		expect(-> constraint.handle(validElement)).not.toThrow()
		expect(-> constraint.handle(invalidElement)).toThrow()

	it "can require that a value be alphanumeric only", ->
		constraint = new AlphanumericConstraint()
		validElement = newElement("fullName", "71m5h3lburn3")
		invalidElement = newElement("fullName", "T!m $h3lbur*3")
		expect(-> constraint.handle(validElement)).not.toThrow()
		expect(-> constraint.handle(invalidElement)).toThrow()

	it "can require that a value be a valid credit card number", ->
		constraint = new CreditCardConstraint()
		validElement = newElement("number", "4111111111111111")
		invalidElement = newElement("number", "12345")
		expect(-> constraint.handle(validElement)).not.toThrow()
		expect(-> constraint.handle(invalidElement)).toThrow() 

	it "can require that a value be a valid email address", ->
		constraint = new EmailConstraint()
		validElement = newElement("email", "tim@musiconelive.com")
		invalidElement = newElement("email", "tim she@d")
		expect(-> constraint.handle(validElement)).not.toThrow()
		expect(-> constraint.handle(invalidElement)).toThrow() 

	it "can require that a value have a maximum length", ->
		constraint = new MaxLengthConstraint()
		validElement = newElement("zipCode", "78765")
		validElementTwo = newElement("zipCode", "787")
		invalidElement = newElement("zipCode", "787657")
		expect(-> constraint.handle(validElement, { context: 5 })).not.toThrow()
		expect(-> constraint.handle(validElementTwo, { context: 5 })).not.toThrow()
		expect(-> constraint.handle(invalidElement, { context: 5 })).toThrow() 

	it "can require that a value have a minimum length", ->
		constraint = new MinLengthConstraint()
		validElement = newElement("zipCode", "78765")
		validElementTwo = newElement("zipCode", "787643")
		invalidElement = newElement("zipCode", "787")
		expect(-> constraint.handle(validElement, { context: 5 })).not.toThrow()
		expect(-> constraint.handle(validElementTwo, { context: 5 })).not.toThrow()
		expect(-> constraint.handle(invalidElement, { context: 5 })).toThrow() 

	it "can require that a value be numeric only", ->
		constraint = new NumericConstraint()
		validElement = newElement("zipCode", "78765")
		invalidElement = newElement("zipCode", "Seven8765")
		expect(-> constraint.handle(validElement)).not.toThrow()
		expect(-> constraint.handle(invalidElement)).toThrow() 

	it "can require that a value be a valid phone number", ->
		constraint = new PhoneConstraint()
		validElement = newElement("phone", "(555)555-5555")
		invalidElement = newElement("phone", "12341")
		expect(-> constraint.handle(validElement)).not.toThrow()
		expect(-> constraint.handle(invalidElement)).toThrow()

	it "can require that a value be required", ->
		constraint = new RequiredConstraint()
		validElement = newElement("fullName", "Tim Shelburne")
		invalidElement = newElement("fullName", "")
		invalidElementTwo = newElement("fullName", null)
		expect(-> constraint.handle(validElement)).not.toThrow()
		expect(-> constraint.handle(invalidElement)).toThrow() 
		expect(-> constraint.handle(invalidElementTwo)).toThrow()