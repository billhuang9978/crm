class PanelSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = []; 

		collection.push(new Snippet("XrmPanelLoadPanel",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Displays the web page represented by a URL in the static area in the side pane, which appears on all pages in the Dynamics 365 web client.",
			"Xrm.Panel.LoadPanel(\"url\", \"title\")"));

		return collection;
	}

}