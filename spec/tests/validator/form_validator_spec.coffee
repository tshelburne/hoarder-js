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

    it "will return false if any part of the form is invalid", ->
      cityElement.value = 5
      expect(validator.validateForm form).toBeFalsy()

    it "will mark the invalid elements with a validity message", ->
      cityElement.value = 5
      validator.validateForm form
      expect(cityElement.validationMessage).toEqual "This field only accepts numbers and characters (0-9, A-Z, a-z)."

  describe '#validateElement', ->

    it "will return true if the element is valid", ->
      expect(validator.validateElement cityElement).toBeTruthy()

    describe "when the element is invalid", ->

      it "will return false", ->
        cityElement.value = 5
        expect(validator.validateElement cityElement).toBeFalsy()

      it "will mark the element with a validity message", ->
        cityElement.value = 5
        validator.validateElement cityElement
        expect(cityElement.validationMessage).toEqual "This field only accepts numbers and characters (0-9, A-Z, a-z)."