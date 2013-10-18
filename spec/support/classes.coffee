BaseConstraint = require 'hoarder/validator/constraints/base_constraint'

globalize class CustomConstraint extends BaseConstraint

  constructor: ->
    @type = "custom"

  rulePasses: (element)-> element.value.match(/custom/)

  errorMessage: -> "Please enter a valid custom."

return CustomConstraint