class Snippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		var attrbiuteSnippets = new AttributeSnippets();
		var a1 = attrbiuteSnippets.getSnippets();
		for (let item of a1) {
			collection.push(item);
		}

		var contextSnippets = new ContextSnippets();
		var a2 = contextSnippets.getSnippets();
		for (let item of a2) {
			collection.push(item);
		}

		var controlsSnippets = new ControlsSnippets();
		var a3 = controlsSnippets.getSnippets();
		for (let item of a3) {
			collection.push(item);
		}

		var entitySnippets = new EntitySnippets();
		var a4 = entitySnippets.getSnippets();
		for (let item of a4) {
			collection.push(item);
		}

		var execObjSnippets = new ExecObjSnippets();
		var a5 = execObjSnippets.getSnippets();
		for (let item of a5) {
			collection.push(item);
		}

		var formSelectorSnippets = new FormSelectorSnippets();
		var a6 = formSelectorSnippets.getSnippets();
		for (let item of a6) {
			collection.push(item);
		}

		var gridSnippets = new GridSnippets();
		var a7 = gridSnippets.getSnippets();
		for (let item of a7) {
			collection.push(item);
		}

		var navigationSnippets = new NavigationSnippets();
		var a8 = navigationSnippets.getSnippets();
		for (let item of a8) {
			collection.push(item);
		}

		var processSnippets = new ProcessSnippets();
		var a9 = processSnippets.getSnippets();
		for (let item of a9) {
			collection.push(item);
		}

		var tabsSnippets = new TabsSnippets();
		var a10 = tabsSnippets.getSnippets();
		for (let item of a10) {
			collection.push(item);
		}

		var uiSnippets = new UiSnippets();
		var a11 = uiSnippets.getSnippets();
		for (let item of a11) {
			collection.push(item);
		}

		var utilitySnippets = new UtilitySnippets();
		var a12 = utilitySnippets.getSnippets();
		for (let item of a12) {
			collection.push(item);
		}

		var mobileSnippets = new MobileSnippets();
		var a13 = mobileSnippets.getSnippets();
		for (let item of a13) {
			collection.push(item);
		}

		var panelSnippets = new PanelSnippets();
		var a14 = panelSnippets.getSnippets();
		for (let item of a14) {
			collection.push(item);
		}

		return collection;
	}

}

class Snippet {
	constructor(labelIn: string, kindIn: monaco.languages.CompletionItemKind, documentationIn: string, insertTextIn: string) {
		this.label = labelIn;
		this.kind = kindIn;
		this.documentation = documentationIn;
		this.insertText = insertTextIn;
	}

	label: string;
	kind: monaco.languages.CompletionItemKind;
	documentation: string;
	insertText: string;
}