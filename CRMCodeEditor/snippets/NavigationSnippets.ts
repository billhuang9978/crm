class NavigationSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmNavigationItemsForEach",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Apply an action in a delegate function to each object in the collection of navigation items.",
			"Xrm.Page.ui.navigation.items.forEach(function (control, index) {\n" +
			"\n" +
			"})"));

		collection.push(new Snippet("XrmNavigationItems",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ A collection of all the navigation items on the page.",
			"Xrm.Page.ui.navigation.items.get()"));

		collection.push(new Snippet("XrmNavigationItemsGetLength",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Get the number of items in the collection of navigation items.",
			"Xrm.Page.ui.navigation.items.getLength()"));

		collection.push(new Snippet("XrmNavigationItemsGetId",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the name of the item.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getId()"));

		collection.push(new Snippet("XrmNavigationItemsGetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the label for the item.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getLabel()"));

		collection.push(new Snippet("XrmNavigationItemsGetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value that indicates whether the item is currently visible.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getVisible()"));

		collection.push(new Snippet("XrmNavigationItemsSetFocus",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the focus on the item.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setFocus()"));

		collection.push(new Snippet("XrmNavigationItemsSetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the label for the item.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setLabel(\"value\")"));

		collection.push(new Snippet("XrmNavigationItemsSetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets a value that indicates whether the item is visible.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setVisible(true|false)"));

		collection.push(new Snippet("XrmNavigationItemsGetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns the label for the item.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getLabel()"));

		collection.push(new Snippet("XrmNavigationItemsGetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Returns a value that indicates whether the item is currently visible.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getVisible()"));

		collection.push(new Snippet("XrmNavigationItemsSetFocus",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the focus on the item.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setFocus()"));

		collection.push(new Snippet("XrmNavigationItemsSetLabel",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets the label for the item.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setLabel(\"value\")"));

		collection.push(new Snippet("XrmNavigationItemsSetVisible",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Sets a value that indicates whether the item is visible.",
			"Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setVisible(true|false)"));

		return collection;
	}

}