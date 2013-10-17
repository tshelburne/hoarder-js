Form = require 'hoarder/form/form'
FormValidator = require "hoarder/validator/form_validator"

describe "FormValidator", ->
  validator = null
  form = cardNumberElement = null

  beforeEach ->
    createCreditCardFormFixture()

    formElement  = document.getElementById 'test-form'
    cardNumberElement  = formElement['card-number']

    form      = new Form(formElement)
    validator = new FormValidator(FormValidator.libraryConstraints)

  describe '::create', ->
    customConstraint = null

    beforeEach ->
      customConstraint = new CustomConstraint()
      validator = FormValidator.create([ customConstraint ])

    it "will return a FormValidator", ->
      expect(validator.constructor).toEqual FormValidator

    it "will have all the default constraints from Hoarder included", ->
      expect(validator.constraints).toContain constraint for constraint in FormValidator.libraryConstraints

    it "will add any custom constraints passed in", ->
      expect(validator.constraints).toContain customConstraint

  describe '#validateForm', ->

    it "will return true if the form is valid", ->
      expect(validator.validateForm form).toBeTruthy()

    describe "when part of the form is invalid", ->

      beforeEach ->
        cardNumberElement.value = '12345'

      it "will return false", ->
        expect(validator.validateForm form).toBeFalsy()

      it "will mark the invalid elements as invalid", ->
        validator.validateForm form
        expect(cardNumberElement.validity.valid).toBeFalsy()

      it "will mark the invalid elements with a validity message", ->
        validator.validateForm form
        expect(cardNumberElement.validationMessage).toEqual "Please enter a valid credit card number."

  describe '#validateElement', ->

    it "will return true if the element is valid", ->
      expect(validator.validateElement cardNumberElement).toBeTruthy()

    describe "when the element is invalid", ->

      beforeEach ->
        cardNumberElement.value = '12345'

      it "will return false", ->
        expect(validator.validateElement cardNumberElement).toBeFalsy()

      it "will mark the element as invalid", ->
        validator.validateElement cardNumberElement
        expect(cardNumberElement.validity.valid).toBeFalsy()

      it "will mark the element with a validity message", ->
        validator.validateElement cardNumberElement
        expect(cardNumberElement.validationMessage).toEqual "Please enter a valid credit card number."

      describe "and then the element is corrected", ->

        beforeEach ->
          validator.validateElement cardNumberElement
          cardNumberElement.value = "4111111111111111"

        it "will return true", ->
          expect(validator.validateElement cardNumberElement).toBeTruthy()

        it "will mark the element as valid", ->
          validator.validateElement cardNumberElement
          expect(cardNumberElement.validity.valid).toBeTruthy()

        it "will remove the validationMessage", ->
          validator.validateElement cardNumberElement
          expect(cardNumberElement.validationMessage).toEqual ""