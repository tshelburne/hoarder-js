createFormFixture = ->
	form = affix('form#order-form[action="http://please.hoard.me/place-order"][method="post"]')

	paymentFieldset = form.affix('fieldset')
	paymentFieldset.affix('input[name="customer-email"][value="testaddress"]')
	paymentFieldset.affix('input[name="customer-name"][value="John Doe"]')
	paymentFieldset.affix('input[name="payment-number"][value="4111111111111111"]')
	paymentFieldset.affix('input[name="billing-zip"][value="77441"]')

	shippingFieldset = form.affix('fieldset')

	shippingMethod = shippingFieldset.affix('select[name="shipping-method"]')
	shippingMethod.affix("option[value=1]")
	shippingMethod.affix("option[value=2]")
	shippingMethod.affix("option[value=3]")

	shippingFieldset.affix('input[name="shipping-address"][value="1234 Test Addy St."]')
	shippingFieldset.affix('input[name="shipping-zip"][value="77441"]')
	shippingFieldset.affix('input[name="shipping-city"][value="Dal Antauston"]')
	shippingFieldset.affix('textarea[name="extra-details"]')

	form.affix('button[type="submit"]')

globalize(createFormFixture, 'createFormFixture')