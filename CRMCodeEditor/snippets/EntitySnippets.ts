class EntitySnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmEntityAttributesForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of attributes.",
			"Xrm.Page.data.entity.attributes.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmEntityAttributes",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ A collection of all the attributes on the page.",
			"Xrm.Page.data.entity.attributes.get()"));

		collection.push(new Snippet("XrmEntityAttributesGetLength",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Get the number of items in the collection of attributes.",
			"Xrm.Page.data.entity.attributes.getLength()"));

		collection.push(new Snippet("XrmEntityAddOnSave",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets a function to be called when the record is saved.",
			"Xrm.Page.data.entity.addOnSave(functionName)"));

		collection.push(new Snippet("XrmEntityGetDataXml",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string representing the XML that will be sent to the server when the record is saved. Only data in fields that have changed are set to the server.",
			"Xrm.Page.data.entity.getDataXml()"));

		collection.push(new Snippet("XrmEntityGetEntityName",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string representing the logical name of the entity for the record.",
			"Xrm.Page.data.entity.getEntityName()"));

		collection.push(new Snippet("XrmEntityGetId",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a string representing the GUID id value for the record.",
			"Xrm.Page.data.entity.getId()"));

		collection.push(new Snippet("XrmEntityGetIsDirty",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a Boolean value that indicates if any fields in the form have been modified.",
			"Xrm.Page.data.entity.getIsDirty()"));

		collection.push(new Snippet("XrmEntityGetPrimaryAttributeValue",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Gets a string for the value of the primary attribute of the entity.",
			"Xrm.Page.data.entity.getPrimaryAttributeValue()"));

		collection.push(new Snippet("XrmEntityRemoveOnSave",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Removes a function to be called when the record is saved.",
			"Xrm.Page.data.entity.removeOnSave(functionName)"));

		collection.push(new Snippet("XrmEntitySave",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Saves the record synchronously with the options to close the form or open a new form after the save is completed.",
			"Xrm.Page.data.entity.save(null|\"saveandclose\"|\"saveandnew\")"));

		return collection;
	}

}