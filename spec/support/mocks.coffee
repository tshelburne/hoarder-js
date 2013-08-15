# we have to use arrays so that success / error functions can be called with Function::apply

addMock "simpleSuccessResponse", [ status: "success", testData: "This is just some simple test data." ]

addMock "pollingInitialSuccessResponse", [ processId: "1234" ]

addMock "pollingProcessCompletedResponse", 
	[
		processCompleted: true
		processData:
			status: "success"
			testData: "This is just some polling test data"
	]

addMock "pollingProcessNotCompletedResponse", [ processCompleted: false ]

addMock "errorResponse", [ null, "Error!" ]