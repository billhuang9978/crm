class ProcessSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmProcessAddOnStageChange",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use these methods to add or remove event handlers for the business process flow control.",
			"Xrm.Page.data.process.addOnStageChange(functionName)"));

		collection.push(new Snippet("XrmProcessAddOnStageSelected",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use this to add a function as an event handler for the OnStageSelected event so that it will be called when a business process flow stage is selected.",
			"Xrm.Page.data.process.addOnStageSelected(functionName)"));

		collection.push(new Snippet("XrmProcessGetActivePath",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use this method to get a collection of stages currently in the active path with methods to interact with the stages displayed in the business process flow control.",
			"Xrm.Page.data.process.getActivePath()"));

		collection.push(new Snippet("XrmProcessGetActiveProcess",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns a Process object representing the active process.",
			"Xrm.Page.data.process.getActiveProcess()"));

		collection.push(new Snippet("XrmProcessGetActiveStage",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use getActiveStage to retrieve information about the active stage and setActiveStage to set a different stage as the active stage.",
			"Xrm.Page.data.process.getActiveStage()"));

		collection.push(new Snippet("XrmProcessGetDisplayState",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Retrieve the display state for the business process control.",
			"Xrm.Page.ui.process.getDisplayState()"));

		collection.push(new Snippet("XrmProcessGetEnabledProcesses",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use this method to asynchronously retrieve the enabled business process flows that the user can switch to for an entity.",
			"Xrm.Page.data.process.getEnabledProcesses(callbackfunctionName(enabledProcesses))"));

		collection.push(new Snippet("XrmProcessGetSelectedStage",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get the currently selected stage.",
			"Xrm.Page.data.process.getSelectedStage()"));

		collection.push(new Snippet("XrmProcessGetVisible",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Retrieve whether the business process control is visible.",
			"Xrm.Page.ui.process.getVisible()"));

		collection.push(new Snippet("XrmProcessMoveNext",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Progresses to the next stage.",
			"Xrm.Page.data.process.moveNext(callbackfunctionName)"));

		collection.push(new Snippet("XrmProcessMovePrevious",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Moves to the previous stage. Use movePrevious to a previous stage in a different entity.",
			"Xrm.Page.data.process.movePrevious(callbackfunctionName)"));

		collection.push(new Snippet("XrmProcessRemoveOnStageChange",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use this to remove a function as an event handler for the OnStageChange event.",
			"Xrm.Page.data.process.removeOnStageChange(functionName)"));

		collection.push(new Snippet("XrmProcessRemoveOnStageSelected",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use this to remove a function as an event handler for the OnStageSelected event.",
			"Xrm.Page.data.process.removeOnStageSelected(functionName)"));

		collection.push(new Snippet("XrmProcessSetActiveProcess",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Set a Process as the active process.",
			"Xrm.Page.data.process.setActiveProcess(\"processId\", callbackfunctionName)"));

		collection.push(new Snippet("XrmProcessSetActiveStage",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Set a completed stage as the active stage.",
			"Xrm.Page.data.process.setActiveStage(\"stageId\", callbackfunctionName)"));

		collection.push(new Snippet("XrmProcessSetDisplayState",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Use this method to expand or collapse the business process flow control.",
			"Xrm.Page.ui.process.setDisplayState(\"expanded|collapsed\")"));

		collection.push(new Snippet("70+ XrmProcessSetVisible",
			monaco.languages.CompletionItemKind.Function,
			"Use this method to show or hide the business process flow control.",
			"Xrm.Page.ui.process.setVisible(true|false)"));

		collection.push(new Snippet("XrmProcessGetId",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the unique identifier of the process.",
			"Xrm.Page.data.process.getActiveProcess().getId()"));

		collection.push(new Snippet("XrmProcessGetId",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the unique identifier of the process.",
			"Xrm.Page.data.process.getActiveProcess().getId()"));

		collection.push(new Snippet("XrmProcessGetName",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the name of the process.",
			"Xrm.Page.data.process.getActiveProcess().getName()"));

		collection.push(new Snippet("XrmProcessGetStages",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns an collection of stages in the process.",
			"Xrm.Page.data.process.getActiveProcess().getStages()"));

		collection.push(new Snippet("XrmProcessIsRendered",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns true if the process is rendered, false if not.",
			"Xrm.Page.data.process.getActiveProcess().isRendered()"));

		collection.push(new Snippet("XrmProcessGetStagesGetCategoryGetValue",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns an object with a getValue method which will return the integer value of the business process flow category.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getCategory().getValue()"));

		collection.push(new Snippet("XrmProcessGetStagesGetCategoryGetValueGetEntityName",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the logical name of the entity associated with the stage.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getEntityName()"));

		collection.push(new Snippet("XrmProcessGetStagesGetId",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the unique identifier of the stage.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getId()"));

		collection.push(new Snippet("XrmProcessGetStagesGetName",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the name of the stage.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getName()"));

		collection.push(new Snippet("XrmProcessGetStagesGetStatus",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the status of the stage.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getStatus()"));

		collection.push(new Snippet("XrmProcessGetStagesGetSteps",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the status of the stage.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps()"));

		collection.push(new Snippet("XrmProcessGetStagesGetStepsGetAttribute",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the logical name of the attribute associated to the step.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps().get(stepindex).getAttribute()"));

		collection.push(new Snippet("XrmProcessGetStagesGetStepsGetAttributeGetName",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns the name of the step.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps().get(stepindex).getName()"));

		collection.push(new Snippet("XrmProcessGetStagesGetStepsGetAttributeIsRequired",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns whether the step is required in the business process flow.",
			"Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps().get(stepindex).isRequired()"));

		collection.push(new Snippet("XrmProcessGetProcessInstances",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Returns all the process instances for the entity record that the calling user has access to.",
			"Xrm.Page.data.process.getProcessInstances(callbackfunctionName(object))"));

		collection.push(new Snippet("XrmProcessSetActiveProcessInstance",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Sets a process instance as the active instance.",
			"Xrm.Page.data.process.setActiveProcessInstance(\"processInstanceId\", callbackfunctionName)"));

		collection.push(new Snippet("XrmProcessAddOnProcessStatusChange",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Use this to add a function as an event handler for the OnProcessStatusChange event event so that it will be called when the business process flow status changes.",
			"Xrm.Page.data.process.addOnProcessStatusChange(functionName)"));

		collection.push(new Snippet("XrmProcessRemoveOnProcessStatusChange",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Use this to remove a function as an event handler for the OnProcessStatusChange event event.",
			"Xrm.Page.data.process.removeOnProcessStatusChange(functionName)"));

		collection.push(new Snippet("XrmProcessGetInstanceId",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Returns the unique identifier of the process instance.",
			"Xrm.Page.data.process.getInstanceId()"));

		collection.push(new Snippet("XrmProcessGetInstanceName",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Returns the name of the process instance.",
			"Xrm.Page.data.process.getInstanceName()"));

		collection.push(new Snippet("XrmProcessGetStatus",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Returns the current status of the process instance.",
			"Xrm.Page.data.process.getStatus()"));

		collection.push(new Snippet("XrmProcessSetStatus",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Sets the current status of the active process instance.",
			"Xrm.Page.data.process.setStatus(\"status\", callbackFunction)"));

		return collection;
	}

}