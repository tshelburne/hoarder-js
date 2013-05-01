ValidationError = require "hoarder/validator/error/validation_error"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# 
#
class EmailConstraint
  canHandle: (type)->
    type is "email"

  handle: (element)->
    if element.value.match(/^([a-zA-Z0-9_-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})$/i)
      return []
    else
      return [ new ValidationError "Please enter a valid email address." ]

return EmailConstraint