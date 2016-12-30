class MobileSnippets {

	getSnippets(): Snippet[] {

        let collection: Array<Snippet> = [];
        
		collection.push(new Snippet("XrmMobileIsOfflineEnabled",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Returns whether an entity is offline enabled.",
            "Xrm.Mobile.offline.isOfflineEnabled(\"entityName\")"));

		collection.push(new Snippet("XrmMobileCreateOfflineRecord",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Creates an entity record in Dynamics 365 mobile clients while working in the offline mode.",
			"var entity = {};\n" +
			"entity.name = \"test\";\n" +
			"\n" +
			"Xrm.Mobile.offline.createRecord(\"entityName\", entity).then([successFunction], [errorFunction]);"));

		collection.push(new Snippet("XrmMobileRetrieveOfflineRecord",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Retrieves an entity record in Dynamics 365 mobile clients while working in the offline mode.",
			"var options = \"?$select=name&$expand=primarycontactid($select=contactid,fullname)\";\n" +
			"\n" +
			"Xrm.Mobile.offline.retrieveRecord(\"entityName\", \"id\", options).then([successFunction], [errorFunction]);"));

		collection.push(new Snippet("XrmMobileRetrieveMultipleOfflineRecords",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Retrieves a collection of entity records in Dynamics 365 mobile clients while working in the offline mode.",
			"var options = \"?$select=name&$expand=primarycontactid($select=contactid,fullname)\";\n" +
			"var maxPageSize = 100;\n" +
			"\n" +
			"Xrm.Mobile.offline.retrieveMultipleRecords(\"entityName\", options, maxPageSize).then([successFunction], [errorFunction]);"));

		collection.push(new Snippet("XrmMobileUpdateOfflineRecord",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Updates an entity record in Dynamics 365 mobile clients while working in the offline mode.",
			"var entity = {};\n" +
			"entity.name = \"test\";\n" +
			"" +
			"Xrm.Mobile.offline.updateRecord(\"entityName\", \"id\", entity).then([successFunction], [errorFunction]);"));

		collection.push(new Snippet("XrmMobileDeleteOfflineRecord",
			monaco.languages.CompletionItemKind.Function,
			"8.2+ Deletes an entity record in Dynamics 365 mobile clients while working in the offline mode.",
			"Xrm.Mobile.offline.deleteRecord(\"entityName\", \"id\").then([successFunction], [errorFunction]);"));	

		return collection;
	}

}