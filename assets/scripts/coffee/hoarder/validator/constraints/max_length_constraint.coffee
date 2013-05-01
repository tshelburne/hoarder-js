ValidationError = require "hoarder/validator/error/validation_error"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# 
#
class MaxLengthConstraint
  canHandle: (type)->
    type is "maxLength"

  handle: (element, context)->
    if element.value.length <= context.value
      return []
    else
      return [ new ValidationError "The maximum length of this field is #{context.value}." ]

return MaxLengthConstraint