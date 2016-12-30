class UtilitySnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmUtilityAlertDialog",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Displays a dialog box containing an application-defined message.",
			"Xrm.Utility.alertDialog(\"message\", functionName)"));

		collection.push(new Snippet("XrmUtilityConfirmDialog",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Displays a confirmation dialog box that contains an optional message as well as OK and Cancel buttons.",
			"Xrm.Utility.confirmDialog(\"message\", yesfunctionName, nofunctionName)"));

		collection.push(new Snippet("XrmUtilityIsActivityType",
			monaco.languages.CompletionItemKind.Function,
			"6.0+ Determine if an entity is an activity entity.",
			"Xrm.Utility.isActivityType(\"entityName\")"));

		collection.push(new Snippet("XrmUtilityOpenEntityForm",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Opens an entity form.",
			"var name = \"account\";\n" +
			"var id = \"5D24B2A7-957A-4D08-8723-2CEF5219FFA0\";\n" +
			"var parameters = {};\n" +
			"parameters[\"formid\"] = \"b053a39a-041a-4356-acef-ddf00182762b\";\n" +
			"parameters[\"name\"] = \"Test\";\n" +
			"var windowOptions = {\n" +
			"	openInNewWindow: true\n" +
			"};\n" +
			"\n" +
			"Xrm.Utility.openEntityForm(name, id, parameters, windowOptions);"));

		collection.push(new Snippet("XrmUtilityOpenQuickCreate",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Opens a new quick create form.",
			"var entityName = \"account\";\n" +
			"var createFromEntity = { entityType: \"account\", id: Xrm.Page.data.entity.getId() };\n" +
			"var parameters = {};\n" +
			"parameters[\"name\"] = \"Test\";\n" +
			"\n" +
			"Xrm.Utility.openQuickCreate(entityName, createFromEntity, parameters).then(successFunction, errorFunction);"));

		collection.push(new Snippet("XrmUtilityOpenWebResource",
			monaco.languages.CompletionItemKind.Function,
			"5.0+ Opens an HTML web resource.",
			"var webResourceName = \"new_webResource.htm\";\n" +
			"var webResourceData = encodeURIComponent(\"first=First Value&second=Second Value\");\n" +
			"var parameters = {};\n" +
			"var width = 300;\n" +
			"var height = 300;\n" +
			"\n" +
			"Xrm.Utility.openWebResource(webResourceName, webResourceData, width, height);"));

		collection.push(new Snippet("XrmUtilityGetBarcodeValue",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Returns the barcode information, such as a product number, scanned using the device camera.",
			"Xrm.Utility.getBarcodeValue().then([successFunction], [errorFunction])"));

		collection.push(new Snippet("XrmUtilityGetCurrentPosition",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Returns the current location using the device geolocation capability.",
			"Xrm.Utility.getCurrentPosition().then([successFunction], [errorFunction])"));

		return collection;
	}

}