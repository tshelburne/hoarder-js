ValidationError = require "hoarder/validator/error/validation_error"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# 
#
class NumericConstraint
  canHandle: (type)->
    type is "numeric"

  handle: (element)->
    if element.value.match(/^[0-9]*$/)
      return []
    else
      return [ new ValidationError "This field only accepts numbers (0-9)." ]

return NumericConstraint