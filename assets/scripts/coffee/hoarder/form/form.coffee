require "lib/jquery"

FormElement = require "hoarder/form/form_element"

#
# @author - Tim Shelburne <tim@musiconelive.com>
#
# wraps an HTML form for easier form management
#
class Form
  constructor: (formId, @type = "simple")->
    @form = $("##{formId}")
    @form.submit (e)-> e.preventDefault()
    @action = @form.attr("action")
    @method = @form.attr("method")
    @addedElements = []

  elements: ->
    elements = []
    inputs = @form.find("input")
    elements = elements.concat inputs.toArray() if inputs.length > 0
    selects = @form.find("select")
    elements = elements.concat selects.toArray() if selects.length > 0
    textareas = @form.find("textarea")
    elements = elements.concat textareas.toArray() if textareas.length > 0

    formElements = []
    for element in elements
      validationRules = if element.getAttribute("data-validation")? then (rule.trim() for rule in element.getAttribute("data-validation").split(',')) else []
      selector = "#{element.nodeName}[data-bind='#{element.getAttribute("data-bind")}']"
      formElements.push new FormElement(element.name, element.value, selector, validationRules)
    formElements

  addElement: (name, value, isRemovable = true)->
    @form.append "<input type='hidden' name='#{name}' value='#{value}'/>"
    @addedElements.push $("input[name='#{name}']", @form) if isRemovable

  addElements: (elements)-> @addElement(element.name, element.value) for element in elements

  updateAddedElement: (name, value)->  @form.find("input[name='#{name}']").val(value)

  clearAddedElements: ->
    element.remove() for element in @addedElements
    @addedElements = []

  serialize: -> @form.serialize()

return Form