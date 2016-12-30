class AttributeSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmAttributeAddOnChange",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets a function to be called when the attribute value is changed.",
			"Xrm.Page.getAttribute(\"fieldname\").addOnChange(functionName)"));

		collection.push(new Snippet("XrmAttributeFireOnChange",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Causes the OnChange event to occur on the attribute so that any script associated to that event can execute.",
			"Xrm.Page.getAttribute(\"fieldname\").fireOnChange()"));

		collection.push(new Snippet("XrmAttributeGetName",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string representing the logical name of the attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getName()"));

		collection.push(new Snippet("XrmAttributeGetAttributeType",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string value that represents the type of attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getAttributeType()"));

		collection.push(new Snippet("XrmAttributeGetFormat",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string value that represents formatting options for the attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getFormat()"));

		collection.push(new Snippet("XrmAttributeGetInitialValue",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value that represents the value set for an OptionSet or Boolean attribute when the form opened.",
			"Xrm.Page.getAttribute(\"fieldname\").getInitialValue()"));

		collection.push(new Snippet("XrmAttributeGetIsDirty",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a Boolean value indicating if there are unsaved changes to the attribute value.",
			"Xrm.Page.getAttribute(\"fieldname\").getIsDirty()"));

		collection.push(new Snippet("XrmAttributeGetIsPartyList",
			monaco.languages.CompletionItemKind.Function,
			" 6.0+ Returns a Boolean value indicating whether the lookup represents a partylist lookup. Partylist lookups allow for multiple records to be set, such as the To: field for an email entity record.",
			"Xrm.Page.getAttribute(\"fieldname\").getIsPartyList()"));

		collection.push(new Snippet("XrmAttributeGetMax",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a number indicating the maximum allowed value for an attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getMax()"));

		collection.push(new Snippet("XrmAttributeGetMaxLength",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a number indicating the maximum length of a string or memo attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getMaxLength()"));

		collection.push(new Snippet("XrmAttributeGetMin",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a number indicating the minimum allowed value for an attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getMin()"));

		collection.push(new Snippet("XrmAttributeGetOption",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns an option object with the value matching the argument passed to the method.",
			"Xrm.Page.getAttribute(\"fieldname\").getOption(value)"));

		collection.push(new Snippet("XrmAttributeGetOptions",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns an array of option objects representing the valid options for an optionset attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getOptions()"));

		collection.push(new Snippet("XrmAttributeGetParent",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the Xrm.Page.data.entity object that is the parent to all attributes.",
			"Xrm.Page.getAttribute(\"fieldname\").getParent()"));

		collection.push(new Snippet("XrmAttributeGetPrecision",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the number of digits allowed to the right of the decimal point.",
			"Xrm.Page.getAttribute(\"fieldname\").getPrecision()"));

		collection.push(new Snippet("XrmAttributeGetRequiredLevel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string value indicating whether a value for the attribute is required or recommended.",
			"Xrm.Page.getAttribute(\"fieldname\").getRequiredLevel()"));

		collection.push(new Snippet("XrmAttributeGetSelectedOption",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the option object that is selected in an optionset attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getSelectedOption()"));

		collection.push(new Snippet("XrmAttributeGetSubmitMode",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string indicating when data from the attribute will be submitted when the record is saved.",
			"Xrm.Page.getAttribute(\"fieldname\").getSubmitMode()"));

		collection.push(new Snippet("XrmAttributeGetText",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string value of the text for the currently selected option for an optionset attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getText()"));

		collection.push(new Snippet("XrmAttributeGetUserPrivilege",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns an object with three Boolean properties corresponding to privileges indicating if the user can create, read or update data values for an attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getUserPrivilege()"));

		collection.push(new Snippet("XrmAttributeGetValue",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Retrieves the data value for an attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").getValue()"));

		collection.push(new Snippet("XrmAttributeRemoveOnChange",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Removes a function from the OnChange event hander for an attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").removeOnChange(functionName)"));

		collection.push(new Snippet("XrmAttributeSetRequiredLevel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets whether data is required or recommended for the attribute before the record can be saved.",
			"Xrm.Page.getAttribute(\"fieldname\").setRequiredLevel(\"none|required|recommended\")"));

		collection.push(new Snippet("XrmAttributeSetSubmitMode",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets whether data from the attribute will be submitted when the record is saved.",
			"Xrm.Page.getAttribute(\"fieldname\").setSubmitMode(\"always|never|dirty\")"));

		collection.push(new Snippet("XrmAttributeSetValue",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the data value for an attribute.",
			"Xrm.Page.getAttribute(\"fieldname\").setValue(\"value\")"));

		return collection;
	}

}