ValidationError = require "hoarder/validator/error/validation_error"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# 
#
class AlphanumericConstraint
  canHandle: (type)->
    type is "alphanumeric"

  handle: (element)->
    if element.value.match(/^[A-Za-z0-9\s]*$/)
      return []
    else
      return [ new ValidationError "This field only accepts numbers and characters (0-9, A-Z, a-z)." ]

return AlphanumericConstraint