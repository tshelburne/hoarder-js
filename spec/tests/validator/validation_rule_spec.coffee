ValidationRule = require 'hoarder/validator/rules/validation_rule'

describe 'ValidationRule', ->

	describe '::fromString', ->

		it "will build a rule with only a type", ->
			rule = ValidationRule.fromString("email")
			expect(rule.constructor).toEqual ValidationRule

		it "will build a rule with context", ->
			rule = ValidationRule.fromString("maxLength=5")
			expect(rule.constructor).toEqual ValidationRule
			expect(rule.context).toEqual "5"