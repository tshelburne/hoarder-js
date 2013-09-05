CreditCardConstraint = require "hoarder/validator/constraints/credit_card_constraint"

describe "Validator Constraints", ->
	validElement = invalidElement = null

	createInput = (name)-> 
		affix "input##{name}"
		document.getElementById name

	beforeEach ->
		validElement = createInput 'valid-element'
		invalidElement = createInput 'invalid-element'

	it "can require that a value be a valid credit card number", ->
		constraint = new CreditCardConstraint()
		validElement.type = invalidElement.type = 'credit-card'
		validElement.value = "4111111111111111"
		invalidElement.value = "12345"
		constraint.handle(validElement)
		constraint.handle(invalidElement)
		expect(validElement.validationMessage).toEqual ""
		expect(invalidElement.validationMessage).toEqual "Please enter a valid credit card number." 