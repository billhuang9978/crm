class ExecObjSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmExecObjGetEventArgs()GetSaveMode",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value indicating how the save event was initiated by the user.",
			"execObj.getEventArgs().getSaveMode()"));

		collection.push(new Snippet("XrmExecObjGetEventArgs()IsDefaultPrevented",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value indicating whether the save event has been canceled because the preventDefault method was used in this event handler or a previous event handler.",
			"execObj.getEventArgs().isDefaultPrevented()"));

		collection.push(new Snippet("XrmExecObjGetEventArgs()PreventDefault",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Cancels the save operation, but all remaining handlers for the event will still be executed.",
			"execObj.getEventArgs().preventDefault()"));

		collection.push(new Snippet("XrmExecObjGetContext",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the Xrm.Page.context object.",
			"execObj.getContext()"));

		collection.push(new Snippet("XrmExecObjGetDepth",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value that indicates the order in which this handler is executed.",
			"execObj.getDepth()"));

		collection.push(new Snippet("XrmExecObjGetEventSource",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a reference to the object that the event occurred on.",
			"execObj.getEventSource()"));

		collection.push(new Snippet("XrmExecObjGetSharedVariable",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Retrieves a variable set using setSharedVariable.",
			"execObj.getSharedVariable(\"key\")"));

		collection.push(new Snippet("XrmExecObjSetSharedVariable",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the value of a variable to be used by a handler after the current handler completes.",
			"execObj.setSharedVariable(\"key\", value)"));

		collection.push(new Snippet("XrmExecObjGetFormContext",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Method that returns a reference to either the form (Xrm.Page) or editable grid depending on where the method was called.",
			"execObj.getFormContext()"));

		return collection;
	}

}