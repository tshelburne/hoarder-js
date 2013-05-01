ValidationError = require "hoarder/validator/error/validation_error"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# 
#
class RequiredConstraint
  canHandle: (type)->
    type is "required"

  handle: (element)->
    if element.value? and element.value isnt ""
      return []
    else
      return [ new ValidationError "This field is required." ]

return RequiredConstraint