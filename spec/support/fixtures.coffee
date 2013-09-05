createCreditCardFormFixture = ->
  formFixture = affix 'form#test-form[action="http://please.hoard.me/place-order"][method="post"]'

  formFixture.affix 'input#name[type="text"][name="name"][value="John Doe"]'
  document.getElementById('name').pattern = "[A-Za-z\\s]+"
  formFixture.affix 'input#card-number[type="credit-card"][name="card-number"][value="4111111111111111"]'
  formFixture.affix 'input#exp-month[type="month"][name="exp-month"][value="01"]'
  formFixture.affix 'input#exp-year[type="year"][name="exp-year"][value="13"]'
  formFixture.affix 'input#billing-zip[type="text"][name="billing-zip"][value="78751"]'
  document.getElementById('billing-zip').pattern = "[0-9]{5}"

  formFixture.affix 'button#submit[type="submit"]'


createAddressFormFixture = ->
  formFixture = affix 'form#test-form[action="http://please.hoard.me/place-order"][method="post"]'
  
  formFixture.affix 'textarea#address[name="address"]'
  document.getElementById('address').value = '1234 Test Lane'
  document.getElementById('address').pattern = "[A-Za-z0-9\\s]+"

  formFixture.affix 'input#city[type="text"][name="city"][value="Austin"]'
  document.getElementById('city').pattern = "[A-Za-z/s]+"
  
  state = formFixture.affix 'select#state[name="state"]'
  state.affix 'option[value="TX"]'
  state.affix 'option[value="LA"]'
  state.affix 'option[value="AR"]'
  document.getElementById('state')[1].selected = true
  
  formFixture.affix 'input#zip[type="text"][name="zip"][value="78751"]'
  document.getElementById('zip').pattern = "[0-9]{5}"

  formFixture.affix 'button#submit[type="submit"]'

globalize(createCreditCardFormFixture, 'createCreditCardFormFixture')
globalize(createAddressFormFixture, 'createAddressFormFixture')