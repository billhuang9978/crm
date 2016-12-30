class ContextSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmContextClientGetClient",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Returns a value to indicate which client the script is executing in.",
			"Xrm.Page.context.client.getClient()"));

		collection.push(new Snippet("XrmContextClientGetClientState",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Returns a value to indicate the state of the client.",
			"Xrm.Page.context.client.getClientState()"));

		collection.push(new Snippet("XrmContextGetClientUrl",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the base URL that was used to access the application.",
			"Xrm.Page.context.getClientUrl()"));

		collection.push(new Snippet("XrmContextGetCurrentTheme",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string representing the current Microsoft Office Outlook theme chosen by the user.",
			"Xrm.Page.context.getCurrentTheme()"));

		collection.push(new Snippet("XrmContextClientGetFormFactor",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get information about the kind of device the user is using.",
			"Xrm.Page.context.client.getFormFactor()"));

		collection.push(new Snippet("XrmContextGetIsAutoSaveEnabled",
			monaco.languages.CompletionItemKind.Function,
			"7.0+ Returns whether Autosave is enabled for the organization.",
			"Xrm.Page.context.getIsAutoSaveEnabled()"));

		collection.push(new Snippet("XrmContextGetOrgLcid",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the LCID value that represents the language pack that is the base language for the organization.",
			"Xrm.Page.context.getOrgLcid()"));

		collection.push(new Snippet("XrmContextGetOrgUniqueName",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the unique text value of the organization’s name.",
			"Xrm.Page.context.getOrgUniqueName()"));

		collection.push(new Snippet("XrmContextGetQueryStringParameters",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a dictionary object of key value pairs that represent the query string arguments that were passed to the page.",
			"Xrm.Page.context.getQueryStringParameters()"));

		collection.push(new Snippet("XrmContextGetTimeZoneOffsetMinutes",
			monaco.languages.CompletionItemKind.Function,
			" 7.1+ Returns the difference between the local time and Coordinated Universal Time (UTC).",
			"Xrm.Page.context.getTimeZoneOffsetMinutes()"));

		collection.push(new Snippet("XrmContextGetUserId",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the GUID of the SystemUser.Id value for the current user.",
			"Xrm.Page.context.getUserId()"));

		collection.push(new Snippet("XrmContextGetUserLcid",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the LCID value that represents the language pack that is the user selected as their preferred language.",
			"Xrm.Page.context.getUserLcid()"));

		collection.push(new Snippet("XrmContextGetUserName",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Returns the name of the current user.",
			"Xrm.Page.context.getUserName()"));

		collection.push(new Snippet("XrmContextGetUserRoles",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns an array of strings that represent the GUID values of each of the security roles that the user is associated with and any teams that the user is associated with.",
			"Xrm.Page.context.getUserRoles()"));

		collection.push(new Snippet("XrmContextIsOutlookClient",
			monaco.languages.CompletionItemKind.Function,
			"5.0-6.1 Returns a Boolean value indicating if the user is using CRM for Outlook.",
			"Xrm.Page.context.isOutlookClient()"));

		collection.push(new Snippet("XrmContextIsOutlookOnline",
			monaco.languages.CompletionItemKind.Function,
			"5.0-6.1 Returns a Boolean value that indicates whether the user is connected to the server while using CRM for Outlook with Offline Access. When this function returns false, the user is working offline without a connection to the server.",
			"Xrm.Page.context.isOutlookOnline()"));

		collection.push(new Snippet("XrmContextPrependOrgName",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Prepends the organization name to the specified path.",
			"Xrm.Page.context.prependOrgName(\"path\")"));

		return collection;
	}

}