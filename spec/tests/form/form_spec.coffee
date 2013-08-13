Form = require 'hoarder/form/form'

describe "Form", ->
	form = null
	baseForm = nameElement = shippingElement = null

	beforeEach ->
		createFormFixture()
		baseForm = document.getElementById("order-form")
		nameElement = baseForm['customer-name']
		shippingElement = baseForm['shipping-method']
		form = new Form("order-form", "simple")

	describe '#elements', ->

		it "will return a list containing all the original form elements", ->
			expect(form.elements()).toContain element for element in [ nameElement, shippingElement ]

		it "will return a list containing any added form elements", ->
			element = form.addElement("customer[phone]", "555-555-55555")
			expect(form.elements()).toContain element

		it "will return all input, select, and textarea elements currently in the form", ->
			form.addElement("customer[phone]", "555-555-5555")
			expect(form.elements().length).toEqual 10

	describe '#action', ->

		it "will return the action attribute of the referenced form", ->
			expect(form.action()).toEqual "http://please.hoard.me/place-order"

	describe '#method', ->

		it "will return the method attribute of the referenced form", ->
			expect(form.method()).toEqual "post"

	describe '#addElement', ->

	describe '#addElements', ->

	describe '#updateAddedElement', ->

	describe '#clearAddedElements', ->

	describe '#serialize', ->