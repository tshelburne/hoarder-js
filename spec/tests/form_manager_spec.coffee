FormManager = require "hoarder/form_manager"

describe "FormManager", ->
  manager = null

  beforeEach ->
    manager = FormManager.default()

  describe "when working with the FormValidator", ->
    it "can validate forms", ->
      errors = manager.validateForm(mocks.simpleForm)
      expect(errors.length).toEqual 0
      errors = manager.validateForm(mocks.invalidForm)
      expect(errors.length).toEqual 4

    describe "and the FormSubmitter", ->
      response = null
      success = (form, data)->
        response = { form: form, data: data }
      error = (form, text)->
        response = { form: form, text: text }

      beforeEach ->
        response = null
        manager.submittedWithSuccess.add(success)
        manager.submittedWithError.add(error)

      it "can return validation errors when submitting a form", ->
        spyOn(manager.validatedWithErrors, "dispatch")
        manager.submitForm mocks.invalidForm
        expect(manager.validatedWithErrors.dispatch).toHaveBeenCalled()

      it "can submit a form and relay a success message", ->
        spyOn(manager.formSubmitter, "submitForm").andCallFake (form)-> @submittedWithSuccess.dispatch(form, "success")
        manager.submitForm mocks.simpleForm
        expect(response.form).toBe mocks.simpleForm
        expect(response.data).toEqual "success"

      it "can submit a form and relay an error message", ->
        spyOn(manager.formSubmitter, "submitForm").andCallFake (form)-> @submittedWithError.dispatch(form, "error")
        manager.submitForm mocks.simpleForm
        expect(response.form).toBe mocks.simpleForm
        expect(response.text).toEqual "error"