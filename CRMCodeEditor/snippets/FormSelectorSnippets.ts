class FormSelectorSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmFormSelectorItemsForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of forms.",
			"Xrm.Page.ui.formSelector.items.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmFormSelectorItems",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ A collection of all the forms on the page.",
			"Xrm.Page.ui.formSelector.items.get()"));

		collection.push(new Snippet("XrmFormSelectorItemsGetLength",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Get the number of items in the collection of forms.",
			"Xrm.Page.ui.formSelector.items.getLength()"));

		collection.push(new Snippet("XrmFormSelectorItemsGetId",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the GUID ID of the form.",
			"Xrm.Page.ui.formSelector.items.get(\"formindex\").getId()"));

		collection.push(new Snippet("XrmFormSelectorItemsGetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the label of the form.",
			"Xrm.Page.ui.formSelector.items.get(\"formindex\").getLabel()"));

		collection.push(new Snippet("XrmFormSelectorItemsNavigate",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Opens the specified form.",
			"Xrm.Page.ui.formSelector.items.get(\"formindex\").navigate()"));

		return collection;
	}

}