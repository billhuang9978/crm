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

        collection.push(new Snippet("XrmUiQuickFormControls",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ A collection of all quick view controls on a form.",
            "Xrm.Page.ui.quickForms"));

        collection.push(new Snippet("XrmUiQuickFormControlsForEach",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Apply an action in a delegate function to each object in the collection of quick view controls on a form.",
            "Xrm.Page.ui.quickForms.forEach(function (qvcontrol, index) {\n" +
            "\n" +
            "})"));

        collection.push(new Snippet("XrmUiQuickFormGetControl",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Gets the constituent controls in a quick view control.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getControl(\"controlname\")"));

        collection.push(new Snippet("XrmUiQuickFormGetControlType",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Returns a string value that categorizes quick view controls.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getControlType()"));

        collection.push(new Snippet("XrmUiQuickFormGetName",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Returns the name assigned to the quick view control.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getName()"));

        collection.push(new Snippet("XrmUiQuickFormGetParent",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Returns a reference to the section object that contains the control.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getParent()"));

        collection.push(new Snippet("XrmUiQuickFormGetVisible",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Returns a value that indicates whether the quick view control is currently visible.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getVisible()"));

        collection.push(new Snippet("XrmUiQuickFormGetLabel",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Returns the label for the quick view control.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getLabel()"));

        collection.push(new Snippet("XrmUiQuickFormSetLabel",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Sets the label for the quick view control.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").setLabel(\"value\")"));

        collection.push(new Snippet("XrmUiQuickFormIsLoaded",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Returns whether the data binding for the constituent controls in a quick view control is complete.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").isLoaded()"));

        collection.push(new Snippet("XrmUiQuickFormRefresh",
            monaco.languages.CompletionItemKind.Function,
            "8.1+ Refreshes the data displayed in a quick view control.",
            "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").refresh()"));

		return collection;
	}

}