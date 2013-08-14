BaseConstraint = require 'hoarder/validator/constraints/base_constraint'

class EmailConstraint extends BaseConstraint
  
  constructor: ->
    @type = "email"

  rulePasses: (element)-> element.value.match(/^([a-zA-Z0-9_-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/i)

  errorMessage: -> "Please enter a valid email address."

return EmailConstraint