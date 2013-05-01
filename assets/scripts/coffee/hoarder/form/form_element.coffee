require "lib/jquery"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# represents a single element in a form
#
class FormElement
  constructor: (@name, @value, @selector, @validationRules = [])->

  addError: (error)->
    $(@selector).closest("li").addClass("invalid")
    $(@selector).closest("li").find("aside.tooltip").html(error.message)
    $(@selector).focus -> $(this).closest("li").addClass("focused")
    $(@selector).blur -> $(this).closest("li").removeClass("focused")

  clearError: ->
    $(@selector).closest("li").removeClass("invalid")
    $(@selector).closest("li").find("aside.tooltip").html("")
    $(@selector).unbind("focus").unbind("blur")

return FormElement