ValidationError = require "hoarder/validator/error/validation_error"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# 
#
class PhoneConstraint
  canHandle: (type)->
    type is "phone"

  handle: (element)->
    if element.value.match(/^\d?[.(\-]?\d\d\d[.)\-]?\d\d\d[.\-]?\d\d\d\d$/)
      return []
    else
      return [ new ValidationError "Please enter a valid phone number." ]

return PhoneConstraint