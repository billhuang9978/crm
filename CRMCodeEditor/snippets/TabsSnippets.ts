class TabsSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmTabsSectionsForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of sections.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmTabsSectionsForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of sections.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmTabsSectionsControlsForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of controls in a section.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).controls.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmTabsForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of tabs.",
			"Xrm.Page.ui.tabs.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmTabsSectionsControls",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ A collection of all the controls in the section.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).controls.get()"));

		collection.push(new Snippet("XrmTabsSections",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ A collection of all the sections in a tab.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get()"));

		collection.push(new Snippet("XrmTabsSectionsGetLength",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Get the number of items in the collection of sections.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.getLength()"));

		collection.push(new Snippet("XrmTabs",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ A collection of all the tabs on the page.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex)"));

		collection.push(new Snippet("XrmTabsGetLength",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Get the number of items in the collection of tabs.",
			"Xrm.Page.ui.tabs.getLength()"));

		collection.push(new Snippet("XrmTabsSectionsGetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the label for the section.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getLabel()"));

		collection.push(new Snippet("XrmTabsSectionsGetName",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to return the name of the section.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getName()"));

		collection.push(new Snippet("XrmTabsSectionsGetParent",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Method to return the tab containing the section.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getParent()"));

		collection.push(new Snippet("XrmTabsSectionsGetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns true if the section is visible, otherwise returns false.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getVisible()"));

		collection.push(new Snippet("XrmTabsSectionsSetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the label for the section.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).setLabel(\"value\")"));

		collection.push(new Snippet("XrmTabsSectionsSetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets a value to show or hide the section.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).setVisible(true|false)"));

		collection.push(new Snippet("XrmTabsGetDisplayState",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value that indicates whether the tab is collapsed or expanded.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).getDisplayState()"));

		collection.push(new Snippet("XrmTabsGetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the tab label.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).getLabel()"));

		collection.push(new Snippet("XrmTabsGetParent",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the Xrm.Page.ui (client-side reference) object.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).getParent()"));

		collection.push(new Snippet("XrmTabsSetDisplayState",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the tab to be collapsed or expanded.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setDisplayState(\"expanded|collapsed\")"));

		collection.push(new Snippet("XrmTabsSetFocus",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the focus on the tab.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setFocus()"));

		collection.push(new Snippet("XrmTabsSetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the label for the tab.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setLabel(\"value\")"));

		collection.push(new Snippet("XrmTabsSetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets a value that indicates whether the control is visible.",
			"Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setVisible(true|false)"));

		return collection;
	}

}