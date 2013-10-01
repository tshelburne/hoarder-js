addMock "simpleSuccessResponse", 
	status: "success", 
	testData: "This is just some simple test data."

addMock "pollingSubmitSuccessResponse", 
	processId: "1234"

addMock "pollingProcessCompletedResponse", 
	processCompleted: true
	processData:
		status: "success"
		testData: "This is just some polling test data"

addMock "pollingProcessNotCompletedResponse", 
	processCompleted: false

addMock "errorXhr", 
	status: "Bad Request", 
	response: "Error!"