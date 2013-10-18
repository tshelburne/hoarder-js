class Serializer

	@toString: (form)-> _removeNulls((_serializeElement element for element in form.elements())).join("&")

	# private

	_serializeElement = (element)->
		return "" if element.disabled
		return "#{element.name}=#{encodeURIComponent element.value}" unless _isComplicated element
		return "#{element.name}=#{encodeURIComponent element.value}" if _isCheckable(element) and element.checked
		return ("#{element.name}=#{encodeURIComponent option.value}" for option in element.options when option.selected).join("&") if _isMultiSelect(element)
		null

	_isComplicated = (element)-> _isCheckable(element) or _isMultiSelect(element) or _isFile(element)

	_isCheckable = (element)-> element.nodeName is "INPUT" and element.type in [ "checkbox", "radio" ]

	_isMultiSelect = (element)-> element.nodeName is "SELECT" and element.type is "select-multiple"

	_isFile = (element)-> element.nodeName is "INPUT" and element.type is "file"

	_removeNulls = (array)-> array.filter((e)-> return e)

return Serializer