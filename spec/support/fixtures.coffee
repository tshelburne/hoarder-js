createTestFormFixture = ->
  formFixture = affix 'form#test-form[action="http://please.hoard.me/place-order"][method="post"]'
  
  formFixture.affix 'textarea#address[name="address"]'
  document.getElementById('address').value = '1234 Test Lane'

  formFixture.affix 'input#city[type="text"][name="city"][value="Austin"][data-validation="alpha"]'
  
  state = formFixture.affix 'select#state[name="state"]'
  state.affix 'option[value="TX"]'
  state.affix 'option[value="LA"]'
  state.affix 'option[value="AR"]'
  document.getElementById('state')[1].selected = true
  
  formFixture.affix 'input#zip[type="text"][name="zip"][value="78751"][data-validation="numeric"]'

  formFixture.affix 'button#submit[type="submit"]'

globalize(createTestFormFixture, 'createTestFormFixture')