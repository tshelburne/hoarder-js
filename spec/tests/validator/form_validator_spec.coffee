Form = require 'hoarder/form/form'
FormValidator = require "hoarder/validator/form_validator"

describe "FormValidator", ->
  validator = null
  form = cityElement = stateElement = zipElement = null

  beforeEach ->
    formFixture = affix 'form#test-form'
    formFixture.affix 'input[type="text"][name="city"][value="Austin"][data-validation="alpha"]'
    formFixture.affix 'input[type="text"][name="state"][value="TX"][data-validation="alpha,maxLength=2,minLength=2"]'
    formFixture.affix 'input[type="text"][name="zip"][value="78751"][data-validation="numeric"]'

    formElement  = document.getElementById 'test-form'
    cityElement  = formElement['city']
    stateElement = formElement['state']
    zipElement   = formElement['zip']

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
        stateElement.value = "Texas"
        expect(validator.validateElement stateElement).toBeFalsy()

      it "will mark the element with a validity message", ->
        zipElement.value = "Tim"
        validator.validateElement zipElement
        expect(zipElement.validationMessage).toEqual "This field only accepts numbers (0-9)."