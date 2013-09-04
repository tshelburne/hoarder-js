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
	validElement = invalidElement = null

	createInput = (name)-> 
		affix "input##{name}[type=text]"
		document.getElementById name

	beforeEach ->
		validElement = createInput 'valid-element'
		invalidElement = createInput 'invalid-element'

	it "can require that a value be alpha only", ->
		constraint = new AlphaConstraint()
		validElement.value = "ABCabc"
		invalidElement.value = "a1b2c3"
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "This field only accepts characters (A-Z, a-z)."

	it "can require that a value be alphanumeric only", ->
		constraint = new AlphanumericConstraint()
		validElement.value = "71m5h3lburn3"
		invalidElement.value = "T!m $h3lbur*3"
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "This field only accepts numbers and characters (0-9, A-Z, a-z)."

	it "can require that a value be a valid credit card number", ->
		constraint = new CreditCardConstraint()
		validElement.value = "4111111111111111"
		invalidElement.value = "12345"
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "Please enter a valid credit card number." 

	it "can require that a value be a valid email address", ->
		constraint = new EmailConstraint()
		validElement.value = "tim@musiconelive.com"
		invalidElement.value = "tim she@d"
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "Please enter a valid email address." 

	it "can require that a value have a maximum length", ->
		constraint = new MaxLengthConstraint()
		validElement.value = "787"
		invalidElement.value = "787657"
		constraint.handle(validElement, { context: 5 })
		constraint.handle(invalidElement, { context: 5 }) 
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "The maximum length of this field is 5." 

	it "can require that a value have a minimum length", ->
		constraint = new MinLengthConstraint()
		validElement.value = "787643"
		invalidElement.value = "787"
		constraint.handle(validElement, { context: 5 })
		constraint.handle(invalidElement, { context: 5 }) 
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "The minimum length of this field is 5." 

	it "can require that a value be numeric only", ->
		constraint = new NumericConstraint()
		validElement.value = "78765"
		invalidElement.value = "Seven8765"
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "This field only accepts numbers (0-9)." 

	it "can require that a value be a valid phone number", ->
		constraint = new PhoneConstraint()
		validElement.value = "(555)555-5555"
		invalidElement.value = "12341"
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "Please enter a valid phone number."

	it "can require that a value be required", ->
		constraint = new RequiredConstraint()
		validElement.value = "Tim Shelburne"
		invalidElement.value = ""
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "This field is required." 