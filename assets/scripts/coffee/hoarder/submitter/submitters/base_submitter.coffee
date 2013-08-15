Signal = require 'cronus/signal'

class BaseSubmitter

	constructor: ->
    @submittedWithSuccess = new Signal()
    @submittedWithError = new Signal()

  canSubmit: (type)-> type is @type

return BaseSubmitter