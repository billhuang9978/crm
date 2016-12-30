class GridSnippets {

	getSnippets(): Snippet[] {

		let collection: Array<Snippet> = [];

		collection.push(new Snippet("XrmGridGetRowsGetData",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the GridRowData for the GridRow.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData()"));

		collection.push(new Snippet("XrmGridGetRowsGetEntity",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the GridEntity for the GridRowData.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity()"));

		collection.push(new Snippet("XrmGridGetRowsGetEntityGetEntityGetId",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the id for the record in the row.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getId()"));

		collection.push(new Snippet("XrmGridGetRowsGetEntityGetEntityName",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the logical name for the record in the row.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getEntityName()"));

		collection.push(new Snippet("XrmGridGetRowsGetEntityGetPrimaryAttributeValue",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the primary attribute value for the record in the row.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getPrimaryAttributeValue()"));

		collection.push(new Snippet("XrmGridGetRowsGetEntityGetEntityReference",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the entity reference for the record in the row.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getEntityReference()"));

		collection.push(new Snippet("XrmGridGetRows",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns a collection of every GridRow in the Grid.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getRows()"));

		collection.push(new Snippet("XrmGridGetSelectedRows",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns a collection of every selected GridRow in the Grid.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getSelectedRows()"));

		collection.push(new Snippet("XrmGridGetTotalRecordCount",
			monaco.languages.CompletionItemKind.Function,
			"7.1+ Returns the total number of records that match the filter criteria of the view, not limited by the number visible in a single page.",
			"Xrm.Page.getControl(\"controlname\").getGrid().getTotalRecordCount()"));

		return collection;
	}

}