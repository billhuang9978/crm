class ControlsSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmControlsForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of controls.",
			"Xrm.Page.ui.controls.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmControls",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ A collection of all the controls on the page.",
			"Xrm.Page.ui.controls.get()"));

		collection.push(new Snippet("XrmControlsGetLength",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Get the number of items in the collection of controls.",
			"Xrm.Page.ui.controls.getLength()"));

		collection.push(new Snippet("XrmControlsAddCustomFilter",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Use to add filters to the results displayed in the lookup. Each filter will be combined with any previously added filters as an 'AND' condition.",
			"var entityName = \"account\";\n" +
			"var filter = \"<filter type='and'><condition attribute='name' operator='eq' value='test' /></filter>\";\n" +
			"\n" +
			"Xrm.Page.getControl(\"fieldname\").addCustomFilter(filter, entityName);"));

		collection.push(new Snippet("XrmControlsAddCustomView",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Adds a new view for the lookup dialog box.",
			"var viewId = \"F0EE06F5-BB78-465F-BADA-FC3F5CF05300\";\n" +
			"var entityName = \"account\";\n" +
			"var viewDisplayName = \"Custom View\";\n" +
			"var fetchXml = \"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\" +\n" +
			"\t\"<entity name='account'>\" +\n" +
			"\t\"<attribute name='name' />\" +\n" +
			"\t\"<attribute name='accountid' />\" +\n" +
			"\t\"<filter type='and'>\" +" +
			"\t\"<condition attribute='name' operator='eq' value='test' />\" +\n" +
			"\t\"</filter>\" +\n" +
			"\t\"</entity>\" +\n" +
			"\t\"</fetch>\";\n" +
			"\n" +
			"var layoutXml = \"<grid name='resultset' object='1' jump='accountid' select='1' icon='1' preview='1'>\" +\n" +
			"\t\"<row name='result' id='accountid'>\" +\n" +
			"\t\"<cell name='name' width='150' />\" +\n" +
			"\t\"</row>\" +\n" +
			"\t\"</grid>\";\n" +
			"var isDefault = true;\n" +
			"\n" +
			"Xrm.Page.getControl(\"fieldname\").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, isDefault);"));

		collection.push(new Snippet("XrmControlsAddOnKeyPress",
			monaco.languages.CompletionItemKind.Function,
			"8.0+ Use this to add a function as an event handler for the keypress event so that the function is called when you type a character in the specific text or number field.",
			"Xrm.Page.getControl(\"controlname\").addOnKeyPress(functionName)"));

		collection.push(new Snippet("XrmControlsAddOption",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Adds an option to an option set control.",
			"Xrm.Page.getControl(\"fieldname\").addOption(option, index)"));

		collection.push(new Snippet("XrmControlsAddPreSearch",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Use this method to apply changes to lookups based on values current just as the user is about to view results for the lookup.",
			"Xrm.Page.getControl(\"fieldname\").addPreSearch(functionName)"));

		collection.push(new Snippet("XrmControlsClearNotification",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Remove a message already displayed for a control.",
			"Xrm.Page.getControl(\"controlname\").clearNotification(\"uniqueId\")"));

		collection.push(new Snippet("XrmControlsClearOptions",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Clears all options from an option set control.",
			"Xrm.Page.getControl(\"fieldname\").clearOptions()"));

		collection.push(new Snippet("XrmControlsFireOnKeyPress",
			monaco.languages.CompletionItemKind.Function,
			"8.0+ Use this to manually fire an event handler that you created for a specific text or number field to be executed on the keypress event.",
			"Xrm.Page.getControl(\"controlname\").fireOnKeyPress()"));

		collection.push(new Snippet("XrmControlsGetAttribute",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the attribute that the control is bound to.",
			"Xrm.Page.getControl(\"controlname\").getAttribute()"));

		collection.push(new Snippet("XrmControlsGetControlType",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value that categorizes controls.",
			"Xrm.Page.getControl(\"controlname\").getControlType()"));

		collection.push(new Snippet("XrmControlsGetData",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the value of the data query string parameter passed to a Silverlight web resource.",
			"Xrm.Page.getControl(\"controlname\").getData()"));

		collection.push(new Snippet("XrmControlsGetDefaultView",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the Id value of the default lookup dialog view.",
			"Xrm.Page.getControl(\"fieldname\").getDefaultView()"));

		collection.push(new Snippet("XrmControlsGetDisabled",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns whether the control is disabled.",
			"Xrm.Page.getControl(\"controlname\").getDisabled()"));

		collection.push(new Snippet("XrmControlsGetInitialUrl",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the default URL that an IFRAME control is configured to display. This method is not available for web resources.",
			"Xrm.Page.getControl(\"controlname\").getInitialUrl()"));

		collection.push(new Snippet("XrmControlsGetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the label for the control.",
			"Xrm.Page.getControl(\"controlname\").getLabel()"));

		collection.push(new Snippet("XrmControlsGetName",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the name assigned to the control.",
			"Xrm.Page.getControl(\"controlname\").getName()"));

		collection.push(new Snippet("XrmControlsGetObject",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the object in the form that represents an IFRAME or web resource.",
			"Xrm.Page.getControl(\"controlname\").getObject()"));

		collection.push(new Snippet("XrmControlsGetParent",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a reference to the section object that contains the control.",
			"Xrm.Page.getControl(\"controlname\").getParent()"));

		collection.push(new Snippet("XrmControlsGetShowTime",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Get whether a date control shows the time portion of the date.",
			"Xrm.Page.getControl(\"fieldname\").getShowTime()"));

		collection.push(new Snippet("XrmControlsGetSrc",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the current URL being displayed in an IFRAME or web resource.",
			"Xrm.Page.getControl(\"controlname\").getSrc()"));

		collection.push(new Snippet("XrmControlsGetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value that indicates whether the control is currently visible.",
			"Xrm.Page.getControl(\"controlname\").getVisible()"));

		collection.push(new Snippet("XrmControlsHideAutoComplete",
			monaco.languages.CompletionItemKind.Function,
			"8.0+ Use this function to hide the auto-completion drop-down list you configured for a specific text field.",
			"Xrm.Page.getControl(\"controlname\").hideAutoComplete()"));

		collection.push(new Snippet("XrmControlsRemoveOnKeyPress",
			monaco.languages.CompletionItemKind.Function,
			"8.0+ Use this to remove an event handler for a text or number field that you added using addOnKeyPress.",
			"Xrm.Page.getControl(\"controlname\").removeOnKeyPress(functionName)"));

		collection.push(new Snippet("XrmControlsRemoveOption",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Removes an option from an option set control.",
			"Xrm.Page.getControl(\"fieldname\").removeOption(number)"));

		collection.push(new Snippet("XrmControlsRemovePreSearch",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Use this method to remove event handler functions that have previously been set for the PreSearch event.",
			"Xrm.Page.getControl(\"fieldname\").removePreSearch(functionName)"));

		collection.push(new Snippet("XrmControlsSetData",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the value of the data query string parameter passed to a Silverlight web resource.",
			"Xrm.Page.getControl(\"controlname\").setData(value)"));

		collection.push(new Snippet("XrmControlsSetDefaultView",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the default view for the lookup control dialog.",
			"Xrm.Page.getControl(\"fieldname\").setDefaultView(\"viewId\")"));

		collection.push(new Snippet("XrmControlsSetDisabled",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets whether the control is disabled.",
			"Xrm.Page.getControl(\"controlname\").setDisabled(true|false)"));

		collection.push(new Snippet("XrmControlsSetFocus",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the focus on the control.",
			"Xrm.Page.getControl(\"controlname\").setFocus()"));

		collection.push(new Snippet("XrmControlsSetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the label for the control.",
			"Xrm.Page.getControl(\"fieldname\").setLabel(\"value\")"));

		collection.push(new Snippet("XrmControlsSetNotification",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Display a message near the control to indicate that data isn’t valid.",
			"Xrm.Page.getControl(\"controlname\").setNotification(\"message\", \"uniqueId\")"));

		collection.push(new Snippet("XrmControlsSetShowTime",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Specify whether a date control should show the time portion of the date.",
			"Xrm.Page.getControl(\"fieldname\").setShowTime(true|false)"));

		collection.push(new Snippet("XrmControlsSetSrc",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the URL to be displayed in an IFRAME or web resource.",
			"Xrm.Page.getControl(\"controlname\").setSrc(\"value\")"));

		collection.push(new Snippet("XrmControlsSetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets a value that indicates whether the control is visible.",
			"Xrm.Page.getControl(\"controlname\").setVisible(true|false)"));

		collection.push(new Snippet("XrmControlsShowAutoComplete",
			monaco.languages.CompletionItemKind.Function,
			"8.0+ Use this to show up to 10 matching strings in a drop-down list as users press keys to type character in a specific text field. You can also add a custom command with an icon at the bottom of the drop-down list.",
			"Xrm.Page.getControl(\"controlname\").showAutoComplete(object)"));

		collection.push(new Snippet("XrmControlsAddOnPostSearch",
			monaco.languages.CompletionItemKind.Function,
			"8.1+ Use this method to add an event handler to the PostSearch event.",
			"Xrm.Page.getControl(\"controlname\").addOnPostSearch(functionName)"));

		collection.push(new Snippet("XrmControlsAddOnResultOpened",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to add an event handler to the OnResultOpened event.",
			"Xrm.Page.getControl(\"controlname\").addOnResultOpened(functionName)"));

		collection.push(new Snippet("XrmControlsAddOnSelection",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to add an event handler to the OnSelection event.",
			"Xrm.Page.getControl(\"controlname\").addOnSelection(functionName)"));

		collection.push(new Snippet("XrmControlsGetSearchQuery",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get the text used as the search criteria for the knowledge base management control.",
			"Xrm.Page.getControl(\"controlname\").getSearchQuery()"));

		collection.push(new Snippet("XrmControlsGetSelectedResult",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get the currently selected result of the search control. The currently selected result also represents the result that is currently open.",
			"Xrm.Page.getControl(\"controlname\").getSelectedResult()"));

		collection.push(new Snippet("XrmControlsGetTotalResultCount",
			monaco.languages.CompletionItemKind.Function,
			"8.1+ Gets the count of results found in the search control.",
			"Xrm.Page.getControl(\"controlname\").getTotalResultCount()"));

		collection.push(new Snippet("XrmControlsOpenSearchResult",
			monaco.languages.CompletionItemKind.Function,
			"8.1+ Opens a search result in the search control by specifying the result number.",
			"Xrm.Page.getControl(\"controlname\").openSearchResult(index, \"Inline|Popout\")"));

		collection.push(new Snippet("XrmControlsRemoveOnPostSearch",
			monaco.languages.CompletionItemKind.Function,
			"8.1+ Use this method to remove an event handler from the PostSearch event.",
			"Xrm.Page.getControl(\"controlname\").removeOnPostSearch(functionName)"));

		collection.push(new Snippet("XrmControlsRemoveOnResultOpened",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to remove an event handler from the OnResultOpened event.",
			"Xrm.Page.getControl(\"controlname\").removeOnResultOpened(functionName)"));

		collection.push(new Snippet("XrmControlsRemoveOnSelection",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to remove an event handler from the OnSelection event.",
			"Xrm.Page.getControl(\"controlname\").removeOnSelection(functionName)"));

		collection.push(new Snippet("XrmControlsSetSearchQuery",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to set the text used as the search criteria for the knowledge base management control.",
			"Xrm.Page.getControl(\"controlname\").setSearchQuery(\"value\")"));

		collection.push(new Snippet("XrmControlsAddOnLoad",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to add event handlers to the GridControlOnLoad event.",
			"Xrm.Page.getControl(\"controlname\").addOnLoad(functionName)"));

		collection.push(new Snippet("XrmControlsGetGrid",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get access to the Grid available in the GridControl.",
			"Xrm.Page.getControl(\"controlname\").getGrid()"));

		collection.push(new Snippet("XrmControlsGetControl",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the grid or knowledge base search control.",
			"Xrm.Page.getControl(\"controlname\")"));

		collection.push(new Snippet("XrmControlsGetViewSelectorGetCurrentView",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get a reference to the current view.",
			"Xrm.Page.getControl(\"controlname\").getViewSelector().getCurrentView()"));

		collection.push(new Snippet("XrmControlsGetEntityName",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get the logical name of the entity data displayed in the grid.",
			"Xrm.Page.getControl(\"controlname\").getEntityName()"));

		collection.push(new Snippet("XrmControlsGetViewSelector",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to get access to the ViewSelector available for the GridControl.",
			"Xrm.Page.getControl(\"controlname\").getViewSelector()"));

		collection.push(new Snippet("XrmControlsGetViewSelectorIsVisible",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to determine whether the view selector is visible.",
			"Xrm.Page.getControl(\"controlname\").getViewSelector().isVisible()"));

		collection.push(new Snippet("XrmControlsRefresh",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Refreshes the data displayed in a subgrid.",
			"Xrm.Page.getControl(\"controlname\").refresh()"));

		collection.push(new Snippet("XrmControlsRemoveOnLoad",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to remove event handlers from the GridControlOnLoad event.",
			"Xrm.Page.getControl(\"controlname\").removeOnLoad(functionName)"));

		collection.push(new Snippet("XrmControlsGetViewSelectorSetCurrentView",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Use this method to set the current view.",
			"var contactSavedQuery = {\n" +
			"	entityType: 1039, // SavedQuery\n" +
			"	id: \"3A282DA1-5D90-E011-95AE-00155D9CFA02\",\n" +
			"	name: \"Contacts Saved Query\"\n" +
			"}\n" +
			"\n" +
			"Xrm.Page.getControl(\"controlname\").getViewSelector().setCurrentView(contactSavedQuery);"));

		collection.push(new Snippet("XrmControlsAddNotification",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Displays an error or recommendation notification for a control, and lets you specify actions to execute based on the notification.",
			"var actionCollection = {\n" +
			"   message: \"message\",\n" +
			"	actions: null\n" +
			"}\n" +
			"\n" +
			"actionCollection.actions = [function () {\n" +
			"\n" +
			"}];\n" +
			"\n" +
			"Xrm.Page.getControl(\"fieldname\").addNotification({\n" +
			"   messages: [\"message\"],\n" +
			"   notificationLevel: \"RECOMMENDATION|ERROR\",\n" +
			"   uniqueId: \"uniqueId\",\n" +
			"   actions: [actionCollection]\n" +
			"});"));

		return collection;
	}

}