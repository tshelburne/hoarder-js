Form = require 'hoarder/form/form'
FormValidator = require "hoarder/validator/form_validator"

describe "FormValidator", ->
  validator = null
  form = cityElement = null

  beforeEach ->
    createTestFormFixture()

    formElement  = document.getElementById 'test-form'
    cityElement  = formElement['city']

    form      = new Form(formElement)
    validator = FormValidator.create()

  describe '#validateForm', ->

    it "will return true if the form is valid", ->
      expect(validator.validateForm form).toBeTruthy()

    describe "when part of the form is invalid", ->

      beforeEach ->
        cityElement.value = 5

      it "will return false", ->
        expect(validator.validateForm form).toBeFalsy()

      it "will mark the invalid elements as invalid", ->
        validator.validateForm form
        expect(cityElement.validity.valid).toBeFalsy()

      it "will mark the invalid elements with a validity message", ->
        validator.validateForm form
        expect(cityElement.validationMessage).toEqual "This field only accepts characters (A-Z, a-z)."

  describe '#validateElement', ->

    it "will return true if the element is valid", ->
      expect(validator.validateElement cityElement).toBeTruthy()

    describe "when the element is invalid", ->

      beforeEach ->
        cityElement.value = 5

      it "will return false", ->
        expect(validator.validateElement cityElement).toBeFalsy()

      it "will mark the element as invalid", ->
        validator.validateElement cityElement
        expect(cityElement.validity.valid).toBeFalsy()

      it "will mark the element with a validity message", ->
        validator.validateElement cityElement
        expect(cityElement.validationMessage).toEqual "This field only accepts characters (A-Z, a-z)."

      describe "and then the element is corrected", ->

        beforeEach ->
          validator.validateElement cityElement
          cityElement.value = "Austin"

        it "will return true", ->
          # cityElement.setCustomValidity ""
          expect(validator.validateElement cityElement).toBeTruthy()

        it "will mark the element as valid", ->
          # cityElement.setCustomValidity ""
          validator.validateElement cityElement
          expect(cityElement.validity.valid).toBeTruthy()

        it "will remove the validationMessage", ->
          # cityElement.setCustomValidity ""
          validator.validateElement cityElement
          expect(cityElement.validationMessage).toEqual ""