Form = require 'hoarder/form/form'

describe "Form", ->
	form = null
	shippingForm = addressElement = cityElement = stateElement = zipElement = null

	elements = [
		{ name: 'name',  value: 'John' }
		{ name: 'gender', value: 'male' }
		{ name: 'height', value: 'tall' }
	]

	singleElementName = elements[0].name
	singleElementValue = elements[0].value

	beforeEach ->
		createAddressFormFixture()

		shippingForm   = document.getElementById("test-form")
		addressElement = shippingForm['address']
		cityElement    = shippingForm['city']
		stateElement   = shippingForm['state']
		zipElement     = shippingForm['zip']
		form           = new Form(shippingForm)

	describe '#elements', ->

		it "will return a list containing all the original form elements", ->
			expect(form.elements()).toContain element for element in [ cityElement, stateElement, zipElement ]

		it "will return a list containing any added form elements", ->
			element = form.addElement(singleElementName, singleElementValue)
			expect(form.elements()).toContain element

		it "will return all input, select, and textarea elements currently in the form", ->
			form.addElement(singleElementName, singleElementValue)
			expect(form.elements().length).toEqual 5

	describe '#action', ->

		it "will return the action attribute of the referenced form", ->
			expect(form.action()).toEqual "http://please.hoard.me/place-order"

	describe '#method', ->

		it "will return the method attribute of the referenced form", ->
			expect(form.method()).toEqual "post"

	describe '#isValid', ->

		it "will return true when all form elements are marked as valid", ->
			expect(form.isValid()).toBeTruthy()

		it "will return false when any form element is marked as invalid", ->
			addressElement.setCustomValidity "Invalid element"
			expect(form.isValid()).toBeFalsy()

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
			expect(-> form.addElement(singleElementName, 'Jane Doe')).toThrow()

		describe "when the element is marked as permanent", ->

			it "will not be removed by clearAddedElements", ->
				element = form.addElement(singleElementName, singleElementValue, true)
				form.clearAddedElements()
				expect(form.elements()).toContain element

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

		describe "when the elements are marked as permanent", ->

			it "will not remove them with clearAddedElements", ->
				form.addElements(elements, true)
				form.clearAddedElements()
				expect(form.getElement(element.name)).not.toBeNull() for element in elements

	describe '#hasElement', ->

		it "will return true when the element exists on the form", ->
			expect(form.hasElement 'city').toBeTruthy()

		it "will return false when the element does not exist on the form", ->
			expect(form.hasElement 'fullname').toBeFalsy()

		it "will not return true for form properties", ->
			expect(form.hasElement 'name').toBeFalsy()

	describe '#getElement', ->

		it "will return the element with the given name", ->
			expect(form.getElement('city')).toEqual document.getElementById 'city'

		it "will return undefined when the element doesn't exist", ->
			expect(form.getElement('bad-name')).toBeUndefined()

	describe '#updateAddedElement', ->

		it "will update the element's value", ->
			form.addElement(singleElementName, singleElementValue)
			form.updateAddedElement(singleElementName, 'Jane Doe')
			expect(form.getElement(singleElementName).value).toEqual "Jane Doe"

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
			expect(form.serialize()).toEqual "address=1234%20Test%20Lane&city=Austin&state=LA&zip=78751&name=John&gender=male&height=tall"


