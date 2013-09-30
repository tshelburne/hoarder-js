CreditCardConstraint = require "hoarder/validator/constraints/credit_card_constraint"

describe "Validator Constraints", ->
	constraint = validElement = invalidElement = null

	createInput = (name)-> 
		affix "input##{name}"
		document.getElementById name

	beforeEach ->
		validElement = createInput 'valid-element'
		invalidElement = createInput 'invalid-element'

	describe "when checking credit card numbers", ->

		beforeEach ->
			constraint = new CreditCardConstraint()
			validElement.type = invalidElement.type = 'creditcard'

		it "will recognize a valid card number", ->
			validElement.value = "4111111111111111"
			constraint.handle(validElement)
			expect(validElement.validationMessage).toEqual ""

		it "will mark the element invalid with too few digits", ->
			invalidElement.value = "12345"
			constraint.handle(invalidElement)
			expect(invalidElement.validationMessage).toEqual "Please enter a valid credit card number." 

		it "will mark the element invalid with non-numeric values", ->
			invalidElement.value = "asdfqwerasdfqwer"
			constraint.handle(invalidElement)
			expect(invalidElement.validationMessage).toEqual "Please enter a valid credit card number." 

		it "will mark the element invalid with spaces", ->
			invalidElement.value = "4111 1111 1111 1111"
			constraint.handle(invalidElement)
			expect(invalidElement.validationMessage).toEqual "Please enter a valid credit card number."