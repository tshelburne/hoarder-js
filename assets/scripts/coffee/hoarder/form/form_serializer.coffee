class Serializer

	@toString: (form)-> removeNulls((serializeElement element for element in form.elements())).join("&")

	# private

	serializeElement = (element)->
		return "#{element.name}=#{encodeURIComponent element.value}" unless isComplicated element
		return "#{element.name}=#{encodeURIComponent element.value}" if isCheckable(element) and element.checked
		return ("#{element.name}=#{encodeURIComponent option.value}" for option in element.options when option.selected).join("&") if isMultiSelect(element)
		null

	isComplicated = (element)-> isCheckable(element) or isMultiSelect(element) or isFile(element)

	isCheckable = (element)-> element.nodeName is "INPUT" and element.type in [ "checkbox", "radio" ]

	isMultiSelect = (element)-> element.nodeName is "SELECT" and element.type is "select-multiple"

	isFile = (element)-> element.nodeName is "INPUT" and element.type is "file"

	removeNulls = (array)-> array.filter((e)-> return e)

return Serializer