addMock "submitSimpleFormResponse",
  status: "success"

addMock "submitPollingFormResponse",
  pollId: "1234"

addMock "submitFormPollingCheckResponse",
  pollCompleted: true
  pollData:
    success: true
    countdownTime: 300

addMock "submitFormPollingCheckFailedResponse",
  pollCompleted: false

addMock "simpleForm",
  type: "simple"
  action: "/submit-simple-form"
  method: "POST"
  elements: -> [
    { name: "street1",  value: "123 Duval", validationRules: [ "required", "alphanumeric"], addError: -> }
    { name: "street2",  value: "",          validationRules: [ "alphanumeric" ], addError: -> }
    { name: "city",     value: "Austin",    validationRules: [ "required" ], addError: -> }
    { name: "state",    value: "TX",        validationRules: [ "required" ], addError: -> }
    { name: "zipCode",  value: "78753",     validationRules: [ "required", "numeric", "maxLength=5", "minLength=5" ], addError: -> }
  ]
  serialize: -> "street1=123 Duval&street2=&city=Austin&state=TX&zipCode=78753"

addMock "pollingForm",
  type: "polling"
  action: "/submit-polling-form"
  method: "POST"
  serialize: -> "products[1234]=2&products[2345]=3"

addMock "invalidForm",
  elements: -> [
    { name: "street1",  value: "$$$#",  validationRules: [ "required", "alphanumeric"], addError: -> }
    { name: "street2",  value: "",      validationRules: [ "alphanumeric" ], addError: -> }
    { name: "city",     value: "",      validationRules: [ "required" ], addError: -> }
    { name: "state",    value: "",      validationRules: [ "required" ], addError: -> }
    { name: "zipCode",  value: "asdf",  validationRules: [ "required", "numeric", "maxLength=5", "minLength=5" ], addError: -> }
  ]