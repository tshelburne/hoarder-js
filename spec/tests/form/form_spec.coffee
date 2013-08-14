Form = require 'hoarder/form/form'

describe "Form", ->
	form = null
	baseForm = nameElement = shippingElement = null

	elements = [
		{ name: 'customer[phone]',  value: '555-555-5555' }
		{ name: 'customer[gender]', value: 'male' }
		{ name: 'customer[height]', value: 'tall' }
	]

	singleElementName = elements[0].name
	singleElementValue = elements[0].value

	beforeEach ->
		createFormFixture()
		baseForm = document.getElementById("order-form")
		nameElement = baseForm['customer-name']
		shippingElement = baseForm['shipping-method']
		form = new Form(baseForm)

	describe '#elements', ->

		it "will return a list containing all the original form elements", ->
			expect(form.elements()).toContain element for element in [ nameElement, shippingElement ]

		it "will return a list containing any added form elements", ->
			element = form.addElement(singleElementName, singleElementValue)
			expect(form.elements()).toContain element

		it "will return all input, select, and textarea elements currently in the form", ->
			form.addElement(singleElementName, singleElementValue)
			expect(form.elements().length).toEqual 10

	describe '#action', ->

		it "will return the action attribute of the referenced form", ->
			expect(form.action()).toEqual "http://please.hoard.me/place-order"

	describe '#method', ->

		it "will return the method attribute of the referenced form", ->
			expect(form.method()).toEqual "post"

	describe '#addElement', ->

		it "will add an element to the list of elements", ->
			element = form.addElement(singleElementName, singleElementValue)
			expect(form.elements()).toContain element

		it "will add the element into markup as a hidden input", ->
			element = form.addElement(singleElementName, singleElementValue)
			expect(document.getElementsByName(singleElementName)[0].type).toEqual 'hidden'

		it "will add an element that gets serialized by the form", ->
			element = form.addElement(singleElementName, singleElementValue)
			expect(form.serialize()).toContain "#{singleElementName}=#{singleElementValue}"

		it "will throw an error if the element already exists", ->
			form.addElement(singleElementName, singleElementValue)
			expect(-> form.addElement(singleElementName, '123-456-7890')).toThrow()

	describe '#addElements', ->

		it "will add a series of elements to the list of elements", ->
			form.addElements(elements)
			expect(form.getElement(element.name)).not.toBeNull() for element in elements

		describe "when elements that already exist are added", ->

			it "will still add all elements that haven't been added", ->
				form.addElement(singleElementName, singleElementValue)
				try form.addElements(elements)
				expect(form.getElement(name)).not.toBeNull() for name in [ elements[1].name, elements[2].name ]

			it "will throw errors", ->
				form.addElement(singleElementName, singleElementValue)
				expect(-> form.addElements(elements)).toThrow()

	describe '#getElement', ->

		it "will return the element with the given name", ->
			expect(form.getElement('customer-name')).toEqual document.getElementById 'customer-name'

		it "will return undefined when the element doesn't exist", ->
			expect(form.getElement('bad-name')).toBeUndefined()

	describe '#updateAddedElement', ->

		it "will update the element's value", ->
			form.addElement(singleElementName, singleElementValue)
			form.updateAddedElement(singleElementName, '123-456-7890')
			expect(form.getElement(singleElementName).value).toEqual "123-456-7890"

		it "will create a new element if the element doesn't exist", ->
			form.updateAddedElement(singleElementName, singleElementValue)
			expect(form.getElement(singleElementName)).not.toBeNull()

	describe '#clearAddedElements', ->

		it "will remove all added elements from the form", ->
			form.addElements(elements)
			form.clearAddedElements()
			expect(form.getElement(element.name)).toBeUndefined() for element in elements

	describe '#serialize', ->

		it "will serialize the form", ->
			form.addElements(elements)
			expect(form.serialize()).toEqual "customer-email=testaddress&customer-name=John%20Doe&payment-number=4111111111111111&billing-zip=77441&shipping-method=1&shipping-address=1234%20Test%20Addy%20St.&shipping-zip=77441&shipping-city=Dal%20Antauston&extra-details=&customer[phone]=555-555-5555&customer[gender]=male&customer[height]=tall"