ValidationError = require "hoarder/validator/error/validation_error"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# 
#
class MinLengthConstraint
  canHandle: (type)->
    type is "minLength"

  handle: (element, context)->
    if element.value.length >= context.value
      return []
    else
      return [ new ValidationError "The minimum length of this field is #{context.value}." ]

return MinLengthConstraint