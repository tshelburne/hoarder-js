FormElement = require "hoarder/form/form_element"
FormValidator = require "hoarder/validator/form_validator"

describe "FormValidator", ->
  validator = null
  element = null

  beforeEach ->
    validator = FormValidator.default()
    element = new FormElement("element", "$", "test-element", [ "alphanumeric", "creditCard", "email", "maxLength=5", "minLength=5", "numeric", "phone", "required" ])

  it "can validate an element", ->
    errors = validator.validateElement(element)
    jasmine.log errors
    expect(errors[0].message).toEqual "This field only accepts numbers and characters (0-9, A-Z, a-z)."
    element.value = "4111111111111111"
    errors = validator.validateElement(element)
    jasmine.log errors
    expect(errors[0].message).toEqual "Please enter a valid email address."
    element.value = "6854291"
    errors = validator.validateElement(element)
    jasmine.log errors
    expect(errors[0].message).toEqual "Please enter a valid credit card number."

  it "can validate a form", ->
    errors = validator.validateForm(mocks.simpleForm)
    expect(errors.length).toEqual 0
    errors = validator.validateForm(mocks.invalidForm)
    expect(errors.length).toEqual 4