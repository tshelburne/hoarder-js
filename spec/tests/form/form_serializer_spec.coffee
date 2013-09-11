FormSerializer = require 'hoarder/form/form_serializer'
Form = require 'hoarder/form/form'

describe 'FormSerializer', ->

	beforeEach ->
		form = affix 'form#serializable-form'

		form.affix 'input[type="text"][name="text"][value="text-value"]'
		form.affix 'input[type="text"][name="text-disabled"][value="disabled-value"][disabled=disabled]'
		form.affix 'input[type="hidden"][name="hidden"][value="hidden-value"]'
		form.affix 'input[type="password"][name="password"][value="password-value"]'
		form.affix 'input[type="file"][name="file"]' # this MAY cause a problem in some browsers - DOM Exception 11

		form.affix 'input[type="radio"][name="radio"][value="1-value"]'
		form.affix 'input[type="radio"][name="radio"][value="2-value"][checked=checked]'

		form.affix 'input[type="checkbox"][name="checkbox"][value="1-value"]'
		form.affix 'input[type="checkbox"][name="checkbox"][value="2-value"][checked=checked]'
		form.affix 'input[type="checkbox"][name="checkbox"][value="3-value"][checked=checked]'
		form.affix 'input[type="checkbox"][name="checkbox"][value="4-value"]'

		form.affix 'input[type="checkbox"][name="affirm"][value="T"]'

		selectSing = form.affix 'select[id="single"][name="single"]'
		selectSing.affix 'option[value=1]'
		selectSing.affix 'option[value=2]'
		document.getElementById('single')[1].selected = true # for some reason, jasmine-fixture won't add selected as an attribute
		
		selectMult = form.affix 'select[id="multiple"][multiple="multiple"][name="multiple"]'
		selectMult.affix 'option[value=1]'
		selectMult.affix 'option[value=2]'
		selectMult.affix 'option[value=3]'
		document.getElementById('multiple')[0].selected = true
		document.getElementById('multiple')[2].selected = true

		form.affix 'textarea#textarea[name="textarea"]'
		document.getElementById('textarea').value = "textarea-value" # no way to add content to a jasmine-fixture'd element

	describe '::toString', ->
		serializedString = null

		beforeEach ->
			formElement = document.getElementById 'serializable-form'
			form = new Form(formElement)
			serializedString = FormSerializer.toString form

		it "will ignore disabled elements", ->
			expect(serializedString).not.toContain 'text-disabled'

		describe "when serializing INPUT elements", ->

			it "will serialize basic inputs", ->
				expect(serializedString).toContain 'text=text-value'
				expect(serializedString).toContain 'hidden=hidden-value'
				expect(serializedString).toContain 'password=password-value'

			it "will ignore file inputs", ->
				expect(serializedString).not.toContain 'file'

			it "will serialize radio inputs", ->
				expect(serializedString).toContain 'radio=2-value'

			it "will serialize multiple checkbox inputs", ->
				expect(serializedString).toContain string for string in [ 'checkbox=2-value', 'checkbox=3-value' ]

			it "will not include unchecked single checkboxes", ->
				expect(serializedString).not.toContain 'affirm'

		describe "when serializing SELECT elements", ->

			it "will serialize single selects", ->
				expect(serializedString).toContain 'single=2'

			it "will serialize multiple selects", ->
				expect(serializedString).toContain 'multiple=1'
				expect(serializedString).toContain 'multiple=3'

		describe "when serializing TEXTAREA elements", ->

			it "will serialize textareas", ->
				expect(serializedString).toContain 'textarea=textarea-value'