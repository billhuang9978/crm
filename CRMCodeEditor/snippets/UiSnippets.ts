class UiSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmUiClearFormNotification",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Use this method to remove form level notifications.",
			"Xrm.Page.ui.clearFormNotification(\"uniqueId\")"));

		collection.push(new Snippet("XrmUiGetCurrentControl",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to get the control object that currently has focus on the form. Web Resource and IFRAME controls are not returned by this method.",
			"Xrm.Page.ui.getCurrentControl()"));

		collection.push(new Snippet("XrmUiClose",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to close the form.",
			"Xrm.Page.ui.close()"));

		collection.push(new Snippet("XrmUiGetFormType",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to get the form context for the record.",
			"Xrm.Page.ui.getFormType()"));

		collection.push(new Snippet("XrmUiGetViewPortWidth",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to get the width of the viewport in pixels.",
			"Xrm.Page.ui.getViewPortWidth()"));

		collection.push(new Snippet("XrmUiGetViewPortHeight",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to get the height of the viewport in pixels.",
			"Xrm.Page.ui.getViewPortHeight()"));

		collection.push(new Snippet("XrmUiRefreshRibbon",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to cause the ribbon to re-evaluate data that controls what is displayed in it.",
			"Xrm.Page.ui.refreshRibbon()"));

		collection.push(new Snippet("XrmUiSetFormNotification",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Use this method to display form level notifications.",
			"Xrm.Page.ui.setFormNotification(\"message\", \"ERROR|WARNING|INFO\", \"uniqueId\")"));

		return collection;
	}

}