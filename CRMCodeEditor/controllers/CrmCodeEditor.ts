/// <reference path="../app.ts" />
/// <reference path="../services/CrmService.ts" />

"use strict";

module app.controllers {

    export class CrmCodeEditor implements IController {
        constructor(private $scope, private $timeout, private $window, private uiGridConstants, private blockUI, private CrmService, private Base64, private notify) {
            $scope.crmService = CrmService;
            this.init();
            this.notify.config({ startTop: 300, maximumOpen: 1 });
            this.resize();
        }

        crmVersion = null;
        crmService = null;
        mode: string = "grid";
        retrieveCount = 5000;
        editor = null;
        editor2 = null;
        editorMode = "edit";
        jsCompletionRegistered = false;
        tsCompletionRegistered = false;
        gridApi = null;

        workingId = null;
        workingType = null;

        wrName: string;
        wrDisplayName: string;
        wrContent: string;
        wrType: number;
        wrIsManaged = true;
        wrCreatedOn: Date;
        wrCreatedBy: string;
        wrCreatedById: string;
        wrModifiedOn: Date;
        wrModifiedBy: string;
        wrModifiedById: string;
        wrIsNew = false;

        statusMessage = null;
        solutions = [];
        solPrefix: string;
        selectedSolution: string;
        wrTypeCodes = [
            { code: 1, name: "HTML" },
            { code: 2, name: "CSS" },
            { code: 3, name: "JScript" },
            { code: 4, name: "XML" },
            { code: 0, name: "TypeScript" }];

        wrDescription = null;
        wrData = [];
        pagingCookie = null;
        pageNumber = 1;

        init = () => {
            this.block(null, "Loading...", null);

            this.$timeout(() => {
                this.getCrmVersion();
            }, 0);
        }

        getCrmVersion = () => {
            this.CrmService.getVersion()
                .then((result) => {
                    this.crmVersion = result;
                    this.getData(null, 1, null);
                })
                .catch((err) => {
                    this.notify(err);
                    this.$scope.$apply(() => {
                        this.blockUI.stop();
                    });
                });
        }

        handleUpload = (value, filename) => {
            if (value === null)
                return;

            let decodedValue: string = null;
            if (value)
                decodedValue = this.Base64.decode(value.split(",")[1]);

            let extension = filename.split(".").pop();
            this.wrType = this.typeToNumber(extension.toLowerCase());
            this.editor.getModel().dispose();
            if (extension.toLowerCase() === "js")
                extension = "javascript";
            if (extension.toLowerCase() === "ts")
                extension = "typescript";
            this.createEditor(decodedValue, extension.toLowerCase());
        }

        clearModel = () => {
            this.wrName = null;
            this.wrDisplayName = null;
            this.wrDescription = null;
            this.wrContent = null;
            this.wrType = 3;
            this.wrIsManaged = true;
            this.wrCreatedOn = null;
            this.wrCreatedBy = null;
            this.wrCreatedById = null;
            this.wrModifiedOn = null;
            this.wrModifiedBy = null;
            this.wrModifiedById = null;
            this.wrIsNew = false;
        }

        block = (element: string, message: string, delay: number) => {
            if (!element) {
                this.blockUI.start(message);
                if (delay) {
                    this.$timeout(() => {
                        this.blockUI.stop();
                    },
                        delay);
                }
            } else {
                let block = this.blockUI.instances.get(element);
                block.start(message);
                if (delay) {
                    this.$timeout(() => {
                        block.stop();
                    },
                        delay);
                }
            }
        }

        getData = (pagingCookie: string, pageNumber: number, gridApi: any) => {
            this.pageNumber = pageNumber;

            this.CrmService.getItems(this.retrieveCount, pagingCookie, pageNumber)
                .then((responseText) => {
                    let items = this.CrmService.parseGetDataResponse(responseText);
                    angular.forEach(items, (item) => {
                        this.wrData.push(item);
                    });
                    let tempPagingCookie = this.CrmService.parseGetDataResponseForPagingCookie(responseText);

                    this.$scope.$apply(() => {
                        this.pagingCookie = tempPagingCookie;
                        this.pageNumber++;
                    });

                    if (this.pagingCookie)
                        this.getData(this.pagingCookie, this.pageNumber, gridApi);
                    else {
                        this.handleTypeScriptFiles();
                        this.gridOptions.data = this.wrData;
                        if (gridApi)
                            gridApi.core.refresh();

                        this.gridApi.grid.columns[2].filters[0] = {
                            term: "false"
                        };

                        this.blockUI.stop();
                    }
                })
                .catch((err) => {
                    this.notify(err);
                    this.$scope.$apply(() => {
                        this.blockUI.stop();
                    });
                });
        };

        handleTypeScriptFiles = () => {
            angular.forEach(this.wrData, (item) => {
                if (this.isTypeScript(item.type, item.name))
                    item.type = "0";
            });
        }

        isTypeScript = (type: string, name: string) => {
            if (type === "4" && name.toUpperCase().substr(name.length - 3) === ".TS")
                return true;
            return false;
        }

        publishItem = (id1: string, id2: string) => {
            this.$scope.$apply(() => {
                this.blockUI.message("Publishing...");
            });

            this.CrmService.publishItem(id1, id2)
                .then(() => {
                    this.$scope.$apply(() => {
                        this.mode = "grid";
                        this.editorMode = "edit";
                        this.workingId = null;
                        this.workingType = null;
                        this.disposeEditor(this.editor);
                        this.blockUI.stop();
                    });
                })
                .catch((err) => {
                    this.notify(err);
                    this.$scope.$apply(() => {
                        this.blockUI.stop();
                    });
                });
        }

        hidesave = () => {
            if (this.wrIsNew)
                return true;
            return this.wrIsManaged;
        }

        showsave = () => {
            if (this.wrIsNew)
                return false;
            return !this.wrIsManaged;
        }

        hidecreate = () => {
            if (this.wrIsNew)
                return false;
            return true;
        }

        showcreate = () => {
            if (this.wrIsNew)
                return true;
            return false;
        }

        showsxs = () => {
            if (this.mode === "grid")
                return "none";
            if (this.editorMode === "sxs")
                return "block";
            return "none";
        }

        showeditor = () => {
            if (this.mode === "grid")
                return "none";
            if (this.editorMode === "edit" || this.editorMode === "diff")
                return "block";
            return "none";
        }

        gridmode = () => {
            return (this.mode === "grid");
        }

        editmode = () => {
            return (this.mode === "edit");
        }

        disablebutton = () => {
            if (this.editorMode === "diff" || this.editorMode === "sxs")
                return "buttonDisable";
            return "";
        }

        disablediffbutton = () => {
            if (this.editorMode === "sxs")
                return "buttonDisable";
            return "";
        }

        disablesxsbutton = () => {
            if (this.editorMode === "diff")
                return "buttonDisable";
            return "";
        }

        validateSaveItem = (publish: boolean) => {
            let value: string = this.editor.getValue();
            if (!value) {
                this.notify({ message: "You cannot use this web resource because it is empty", duration: 3000 });
                return;
            }

            if (this.workingType === "javascript") {
                this.validatecode(value, false, publish);
            } else {
                this.saveItem(publish);
            }
        }

        updateModifedOn = (id: string) => {
            this.CrmService.retrieveUnpublishedItemModified(id)
                .then((result) => {
                    this.$scope.$apply(() => {
                        this.wrModifiedOn = result["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"]
                        ["KeyValuePairOfstringanyType"]["value"]["FormattedValues"]["KeyValuePairOfstringstring"]
                        ["value"]["__text"];
                    });
                })
                .catch((err) => {
                    this.notify(err);
                });
        }

        saveItem = (publish: boolean) => {
            if (this.wrType === 0) {
                this.saveTsItems(publish);
                return;
            }

            this.notify.closeAll();
            this.block(null, "Saving...", null);

            let value: string = this.editor.getValue();
            let b64Value: string = this.Base64.encode(value);;

            this.CrmService.saveItem(this.workingId, this.wrDisplayName, b64Value, this.wrDescription)
                .then(() => {
                    if (publish) {
                        this.publishItem(this.workingId, null);
                    } else {
                        this.$scope.$apply(() => {
                            this.updateModifedOn(this.workingId);
                            this.blockUI.stop();
                        });
                    }
                })
                .catch((err) => {
                    this.notify(err);
                    this.editor.getModel().dispose();
                    this.$scope.$apply(() => {
                        this.blockUI.stop();
                    });
                });
        }

        saveTsItems = (publish: boolean) => {
            this.notify.closeAll();
            this.block(null, "Saving...", null);

            let tsValue: string = this.editor.getValue();
            let tsB64Value: string = this.Base64.encode(tsValue);
            let jsValue: string = ts.transpile(tsValue);
            let jsB64Value: string = this.Base64.encode(jsValue);
            let jsName: string = this.wrName.slice(0, -3) + ".js";

            this.CrmService.retrieveItemByName(jsName)
                .then((result) => {
                    let p1;
                    if (result === null)
                        p1 = this.createWebResource(this.wrDisplayName, jsName, 3, jsB64Value, this.wrDescription);
                    else
                        p1 = this.CrmService.saveItem(result, this.wrDisplayName, jsB64Value, this.wrDescription);
                    let p2 = this.CrmService.saveItem(this.workingId, this.wrDisplayName, tsB64Value, this.wrDescription);

                    Promise.all([p1, p2])
                        .then((values) => {
                            let jsId = (result === null) ? values[0] : result;
                            if (publish) {
                                this.publishItem(String(jsId), this.workingId);
                            } else {
                                this.$scope.$apply(() => {
                                    this.updateModifedOn(this.workingId);
                                    this.blockUI.stop();
                                });
                            }
                        })
                        .catch((err) => {
                            this.$scope.$apply(() => {
                                this.blockUI.stop();
                            });
                            this.editor.getModel().dispose();
                            this.notify(err);
                        });
                })
                .catch((err) => {
                    this.editor.getModel().dispose();
                    this.$scope.$apply(() => {
                        this.blockUI.stop();
                    });
                    this.notify(err);
                });
        }

        showDiff = () => {
            let newValue: string = this.editor.getValue();

            if (this.editor.getEditorType() === "vs.editor.ICodeEditor") {
                this.editorMode = "diff";
                this.block(null, "Retrieving...", null);

                this.CrmService.retrievePublishedItem(this.workingId)
                    .then(result => {
                        let currentValue: string = this.Base64.decode(result);

                        this.disposeEditor(this.editor);

                        this.createDiffEditor(currentValue, newValue, this.workingType);

                        this.$scope.$apply(() => {
                            this.blockUI.stop();
                        });
                    })
                    .catch((err) => {
                        this.notify(err);
                        this.$scope.$apply(() => {
                            this.blockUI.stop();
                        });
                    });
            } else {
                this.disposeEditor(this.editor);
                this.editorMode = "edit";
                this.createEditor(newValue, this.workingType);
            }
        }

        showJs = () => {
            let tsValue: string = this.editor.getValue();
            var wrapper = document.getElementById("sxswrapper");
            var ed = document.getElementById("monacoeditor");

            if (this.editorMode === "edit") {
                wrapper.style.display = "block";
                ed.style.display = "none";
                this.editorMode = "sxs";
                let jsValue = ts.transpile(tsValue);
                this.disposeEditor(this.editor);
                this.createSxsEditor(tsValue, jsValue);

            } else {
                wrapper.style.display = "none";
                ed.style.display = "block";
                tsValue = this.editor.getValue();
                this.disposeEditor(this.editor);
                this.disposeEditor(this.editor2);
                this.editorMode = "edit";
                this.createEditor(tsValue, "typescript");
            }
        };

        addToSolution = (id: string, solutionName: string, done: boolean) => {
            if (this.selectedSolution !== "fd140aaf-4df4-11dd-bd17-0019b9312238") {
                this.CrmService.addToSolution(id, solutionName)
                    .catch(err => {
                        this.notify(err);
                    });
            }

            if (!done)
                return;

            this.editor.getModel().dispose();
            this.mode = "grid";
            this.wrIsNew = false;
            this.blockUI.stop();
        }

        validateCreateItem = () => {
            if (!this.wrName) {
                this.notify({ message: "Name is required", duration: 3000 });
                return;
            }

            let pattern = new RegExp("^[a-zA-Z0-9_.\\/]*$");
            if (!pattern.test(this.wrName)) {
                this.notify({ message: "Web resource names may only include letters, numbers, periods, and nonconsecutive forward slash characters", duration: 3000 });
                return;
            }

            let value: string = this.editor.getValue();
            if (!value) {
                this.notify({ message: "You cannot use this web resource because it is empty", duration: 3000 });
                return;
            }

            if (this.wrType === 3) {
                this.validatecode(value, true, false);
            } else {
                this.createItem();
            }
        }

        createItem = () => {
            if (this.wrType === 0) {
                this.createTsItems();
                return;
            }

            this.notify.closeAll();
            this.block(null, "Saving...", null);

            let value: string = this.editor.getValue();
            let b64Value: string = this.Base64.encode(value);

            this.CrmService.createItem((!this.wrDisplayName) ? null : this.wrDisplayName.trim(),
                this.solPrefix + this.wrName.trim(), this.wrType,
                b64Value, (!this.wrDescription) ? null : this.wrDescription.trim())
                .then((result) => {
                    let selSolution = this.selectedSolution;
                    let solutionName = this.solutions.filter((solution, index) => solution["id"] === selSolution)[0]["uniquename"];

                    this.addToSolution(result, solutionName, true);

                    this.clearModel();
                    this.gridApi.grid.clearAllFilters();
                    this.wrData = [];
                    this.gridOptions.data = this.wrData;
                    this.gridApi.core.refresh();
                    this.getData(null, 1, this.gridApi);
                })
                .catch((err) => {
                    this.$scope.$apply(() => {
                        this.blockUI.stop();
                    });
                    this.notify(err);
                });
        }

        createTsItems = () => {
            this.notify.closeAll();
            this.block(null, "Saving...", null);

            let tsValue: string = this.editor.getValue();
            let tsB64Value: string = this.Base64.encode(tsValue);
            let jsValue: string = ts.transpile(tsValue);
            let jsB64Value: string = this.Base64.encode(jsValue);
            let tsName: string = this.solPrefix + this.wrName.trim() + ".ts";
            let jsName: string = this.solPrefix + this.wrName.trim() + ".js";
            let tsType: number = 4;
            let jsType: number = 3;
            let displayName: string = (!this.wrDisplayName) ? null : this.wrDisplayName.trim();
            let description: string = (!this.wrDescription) ? null : this.wrDescription.trim();

            this.CrmService.retrieveItemByName(jsName)
                .then((result) => {
                    if (result !== null) {
                        this.$scope.$apply(() => {
                            this.blockUI.stop();
                        });
                        this.notify("A JavaScript webresource with the same name already exists. Use a different name.");
                        return;
                    }

                    let p1 = this.createWebResource(displayName, tsName, tsType, tsB64Value, description);
                    let p2 = this.createWebResource(displayName, jsName, jsType, jsB64Value, description);

                    Promise.all([p1, p2])
                        .then(values => {
                            let selSolution = this.selectedSolution;
                            let solutionName = this.solutions
                                .filter((solution, index) => solution["id"] === selSolution)[0]["uniquename"];

                            for (var i = 0; i < values.length; i++) {
                                let done: boolean = (i + 1 === values.length);
                                this.addToSolution(String(values[i]), solutionName, done);
                            }

                            this.clearModel();
                            this.gridApi.grid.clearAllFilters();
                            this.wrData = [];
                            this.gridOptions.data = this.wrData;
                            this.gridApi.core.refresh();
                            this.getData(null, 1, this.gridApi);
                        })
                        .catch(err => {
                            this.$scope.$apply(() => {
                                this.blockUI.stop();
                            });
                            this.notify(err);
                        });
                })
                .catch((err) => {
                    this.$scope.$apply(() => {
                        this.blockUI.stop();
                    });
                    this.notify(err);
                    return;
                });
        }

        createWebResource = (displayname: string, name: string, type: number, content: string, description: string) => {
            return new Promise((resolve, reject) => {
                this.CrmService.createItem(displayname, name, type, content, description)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });

            });
        }

        validatecode = (script: string, isNew: boolean, publish: boolean) => {
            try {
                esprima.parse(script, { tolerant: true, loc: true });
                if (isNew)
                    this.createItem();
                else
                    this.saveItem(publish);
            } catch (e) {
                let template = "<span>OK to Save? Code Errors Detected:</span></br></br><span>" + e.message + "</span></br></br><button ng-click='crmCodeEditor." +
                    ((isNew) ? "create" : "save") + "Item(" + publish +
                    ")'>OK</button><button class='confirmCancel' ng-click='crmCodeEditor.confirmCancel()'>Cancel</button>";

                this.notify({
                    messageTemplate: template,
                    scope: this.$scope
                });
            }
        }

        cancel = () => {
            this.notify.closeAll();
            this.disposeEditor(this.editor);
            this.mode = "grid";
            this.editorMode = "edit";
            this.clearModel();
            this.workingId = null;
            this.wrIsNew = false;
        }

        disposeEditor = (editor: any) => {
            if (editor) {
                if (editor.getModel()) {
                    if (typeof (editor.getModel().dispose) !== "undefined")
                        editor.getModel().dispose();
                }
                editor.dispose();
                editor = null;
                document.getElementById("monacoeditor").innerHTML = "";
                //TODO: better way to do this?
                document.getElementById("tsmonacoeditor").innerHTML = "";
                document.getElementById("jsmonacoeditor").innerHTML = "";
            }
        }

        copy = (element: string, block: string, value: string) => {
            let result = new Clipboard(element,
                {
                    text: () => value
                });
            result.on("success",
                () => {
                    this.block(block, "Copied", 600);
                });
            result.on("error",
                () => {
                    this.block(block, "Error!", 900);
                });
        }

        copyCode = () => {
            this.copy(".copycode", null, this.editor.getValue());
        }

        saveAs = () => {
            this.clearModel();
            let value: string = this.editor.getValue().trim();
            this.disposeEditor(this.editor);
            this.editorMode = "edit";
            this.statusMessage = "Creating new web resource";
            this.wrType = this.typeToNumber(this.workingType);
            this.wrIsNew = true;
            this.getSolutions(value, this.workingType);
        }

        setJavaScriptCompletion = (language: string) => {
            if (language === "javascript" && this.jsCompletionRegistered)
                return;
            if (language === "typescript" && this.tsCompletionRegistered)
                return;

            monaco.languages.registerCompletionItemProvider(language,
                {
                    provideCompletionItems(model, position) {
                        let snippets = new Snippets();
                        return snippets.getSnippets();
                    }
                });

            (language === "javascript") ? this.jsCompletionRegistered = true : this.tsCompletionRegistered = true;
        }

        resize = () => {
            let wrapper = document.getElementById("sxswrapper");
            let lhs = {
                domNode: document.getElementById("tsmonacoeditor"),
                editor: null
            };
            let rhs = {
                domNode: document.getElementById("jsmonacoeditor"),
                editor: null
            };

            var horizontalSpace = 0;
            var wrapperSizeDiff = 25;
            var windowHeight = window.innerHeight || document.body.offsetHeight || document.documentElement.offsetHeight;
            wrapper.style.height = (windowHeight - wrapper.offsetTop - wrapperSizeDiff) + "px";
            var halfWidth = Math.floor((wrapper.clientWidth - 0) / 2) - 2 - (horizontalSpace / 2);
            // Layout lhs
            var lhsSizeDiff = wrapperSizeDiff + 40;
            lhs.domNode.style.width = halfWidth + "px";
            lhs.domNode.style.height = (windowHeight - wrapper.offsetTop - lhsSizeDiff) + "px";
            if (lhs.editor)
                lhs.editor.layout();
            // Layout rhs
            var rhsSizeDiff = wrapperSizeDiff + 40;
            rhs.domNode.style.width = halfWidth + "px";
            rhs.domNode.style.height = (windowHeight - wrapper.offsetTop - rhsSizeDiff) + "px";
            if (rhs.editor)
                rhs.editor.layout();
        }

        createEditor = (content: string, format: string) => {

            this.setJavaScriptCompletion(format);

            this.editor = monaco.editor.create(<HTMLElement>document.getElementById("monacoeditor"),
                {
                    value: (content !== null) ? content : null,
                    language: format,
                    readOnly: this.wrIsManaged,
                    wordWrap: true,
                    scrollBeyondLastLine: false,
                    parameterHints: true,
                    folding: true
                });

            this.editor.layout();
        }

        createSxsEditor = (ts: string, js: string) => {
            this.editor = monaco.editor.create(<HTMLElement>document.getElementById("tsmonacoeditor"),
                {
                    value: ts,
                    language: "typescript",
                    readOnly: true,
                    wordWrap: true,
                    scrollBeyondLastLine: false,
                    parameterHints: true,
                    folding: true
                });

            this.editor2 = monaco.editor.create(<HTMLElement>document.getElementById("jsmonacoeditor"),
                {
                    value: js,
                    language: "javascript",
                    readOnly: true,
                    wordWrap: true,
                    scrollBeyondLastLine: false,
                    parameterHints: true,
                    folding: true
                });

            this.resize();
        }

        createDiffEditor = (currentValue: string, newValue: string, format: string) => {
            this.editor = monaco.editor.createDiffEditor(<HTMLElement>document.getElementById("monacoeditor"),
                {
                    wordWrap: true,
                    scrollBeyondLastLine: false,
                    parameterHints: true,
                    folding: true,
                    readOnly: true
                });
            this.editor.setModel({
                modified: monaco.editor.createModel(currentValue, format),
                original: monaco.editor.createModel(newValue, format)
            });
        }

        solutionChange = () => {
            this.solPrefix = this.findSolutionPrefix();
        }

        findSolutionPrefix = () => {
            let selSolution = this.selectedSolution;
            let solution = this.solutions.filter((obj, index) => obj["id"] === selSolution);
            return solution[0]["prefix"] + "_";
        }

        wrTypeChange = () => {
            let value: string = this.editor.getValue();
            this.disposeEditor(this.editor);

            switch (this.wrType) {
                case 2:
                    this.createEditor(value, "css");
                    break;
                case 3:
                    this.createEditor(value, "javascript");
                    break;
                case 4:
                    this.createEditor(value, "xml");
                    break;
                case 0:
                    this.createEditor(value, "typescript");
                    break;
                default:
                    this.createEditor(value, "html");
                    break;
            }
        }

        getSolutions = (content: string, type: string) => {
            this.CrmService.getSolutions()
                .then((results) => {
                    this.solutions = this.moveDefaultToTop(results, "fd140aaf-4df4-11dd-bd17-0019b9312238");
                    this.$scope.$apply(() => {
                        this.selectedSolution = "fd140aaf-4df4-11dd-bd17-0019b9312238"; //Default
                        this.solPrefix = this.findSolutionPrefix();
                        this.createEditor(content, type);
                    });
                })
                .catch((err) => {
                    this.notify(err);
                });
        }

        moveDefaultToTop = (results, id) => {
            for (let i = 0; i < results.length; ++i) {
                if (results[i].id === id) {
                    let temp = results[i];
                    results.splice(i, 1);
                    results.unshift(temp);
                    break;
                }
            }

            return results;
        }

        new = () => {
            this.getSolutions(null, "javascript");

            this.mode = "edit";
            this.statusMessage = "Creating new web resource";
            this.wrIsNew = true;
            this.wrType = 3;
            this.wrIsManaged = false;
        }

        copyTag = (event, type: string) => {
            let id: string = event.target.id;
            let name = this.wrData.filter((wrItem, index) => wrItem["id"] === id)[0]["name"];
            if (type === "3")
                this.copy(".clipTag", null, "<script src='/WebResources/" + name + "'></script>");
            else
                this.copy(".clipTag", null, "<link href='/WebResources/" + name + "' rel='stylesheet' />");
        }

        copyLink = (event) => {
            let id: string = event.target.id;
            let name = this.wrData.filter((wrItem, index) => wrItem["id"] === id)[0]["name"];
            let text: string = Xrm.Page.context.getClientUrl() + "/WebResources/" + name;
            this.copy(".clipLink", null, text);
        }

        showDependencies = (event) => {
            let id: string = event.target.id;
            this.$window
                .open(Xrm.Page.context.getClientUrl() +
                "/tools/dependency/dependencyviewdialog.aspx?appSolutionId=%7bFD140AAF-4DF4-11DD-BD17-0019B9312238%7d&dType=1&objectid=%7b" +
                id + "%7d&objecttype=9333&operationtype=showdependency", "", "width=900px,height=730px,top=0,left=0,menubar=no");
        }

        refresh = () => {
            this.block(null, "Loading...", null);

            this.gridApi.grid.clearAllFilters();
            this.wrData = [];
            this.gridOptions.data = this.wrData;
            this.gridApi.core.refresh();
            setTimeout(() => { this.getData(null, 1, this.gridApi); }, 500);
        }

        confirmCancel = () => {
            this.notify.closeAll();
        }

        deleteOk = (id) => {
            this.notify.closeAll();
            this.block(null, "Deleting...", null);

            this.CrmService.deleteItem(id)
                .then(() => {
                    this.blockUI.stop();
                    this.refresh();
                })
                .catch((err) => {
                    this.blockUI.stop();
                    this.notify(err);
                });
        }

        deleteItem = (event) => {
            let id = event.target.id;
            let template = "<span>Are you sure?</br></br>Deleting items is permanent!</br></br></span><button ng-click='crmCodeEditor.deleteOk(\"" + id +
                "\")'>OK</button><button class='confirmCancel' ng-click='crmCodeEditor.confirmCancel()'>Cancel</button>";

            this.notify({
                messageTemplate: template,
                scope: this.$scope
            });
        }

        retrieveItem = (event) => {
            this.block(null, "Retrieving...", null);

            let id: string = event.target.id;
            this.workingId = id;

            this.CrmService.retrieveUnpublishedItem(id)
                .then((result) => {
                    this.$scope.$apply(() => {

                        let attributes = result["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"]
                        ["KeyValuePairOfstringanyType"]["value"]["Attributes"]["KeyValuePairOfstringanyType"];

                        angular.forEach(attributes, (attribute) => {
                            switch (attribute["key"]["__text"]) {
                                case "name":
                                    this.wrName = attribute["value"]["__text"];
                                    break;
                                case "displayname":
                                    this.wrDisplayName = attribute["value"]["__text"];
                                    break;
                                case "description":
                                    this.wrDescription = attribute["value"]["__text"];
                                    break;
                                case "content":
                                    this.wrContent = attribute["value"]["__text"];
                                    break;
                                case "webresourcetype":
                                    this.wrType = parseInt(attribute["value"]["Value"]["__text"]);
                                    break;
                                case "ismanaged":
                                    this.wrIsManaged = JSON.parse(attribute["value"]["__text"]);
                                    break;
                                case "modifiedby":
                                    this.wrModifiedById = attribute["value"]["Id"]["__text"];
                                    break;
                                case "createdby":
                                    this.wrCreatedById = attribute["value"]["Id"]["__text"];
                                    break;
                            }
                        });

                        if (this.isTypeScript(this.wrType.toString(), this.wrName))
                            this.wrType = 0;

                        let formattedValues = result["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"]
                        ["KeyValuePairOfstringanyType"]["value"]["FormattedValues"]["KeyValuePairOfstringstring"];

                        angular.forEach(formattedValues, (formattedValue) => {
                            switch (formattedValue["key"]["__text"]) {
                                case "modifiedon":
                                    this.wrModifiedOn = formattedValue["value"]["__text"];
                                    break;
                                case "createdon":
                                    this.wrCreatedOn = formattedValue["value"]["__text"];
                                    break;
                            }
                        });

                        this.workingType = this.numberToType(this.wrType, false, this.wrName).toLowerCase();
                        this.wrIsNew = false;
                    });

                    return this.CrmService.retrieveUsers(this.wrCreatedById, this.wrModifiedById);
                })
                .then((result) => {
                    this.$scope.$apply(() => {

                        angular.forEach(result["results"], (user) => {
                            if (user["SystemUserId"].toLowerCase() === this.wrCreatedById.toLowerCase())
                                this.wrCreatedBy = user["FullName"];
                            if (user["SystemUserId"].toLowerCase() === this.wrModifiedById.toLowerCase())
                                this.wrModifiedBy = user["FullName"];
                        });

                        this.mode = "edit";
                        this.statusMessage = ((this.wrIsManaged) ? "Viewing: " : "Editing: ");
                        this.blockUI.stop();
                    });
                })
                .then(() => {
                    let decodedValue: string = null;
                    if (this.wrContent)
                        decodedValue = this.Base64.decode(this.wrContent);

                    this.blockUI.stop();
                    this.createEditor(decodedValue, this.workingType);
                })
                .catch((err) => {
                    this.blockUI.stop();
                    this.notify(err);
                });
        }

        numberToType = (input: number, short: boolean, name: string) => {
            let types = {
                3: (short) ? "JS" : "JavaScript",
                1: "HTML",
                2: "CSS",
                4: "XML",
                0: (short) ? "TS" : "TypeScript"
            };

            if (input === 4 && name.toUpperCase().substr(name.length - 3) === ".TS")
                return (short) ? "TS" : "TypeScript";

            return types[input];
        }

        typeToNumber = (input: string) => {
            let types = {
                "javascript": 3,
                "js": 3,
                "html": 1,
                "css": 2,
                "xml": 4,
                "ts": 0,
                "typescript": 0
            };

            if (!input) return "";

            return types[input];
        }

        transpile = () => {
            let model = this.editor.getModel();

            return new Promise(resolve => {
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES5,
                    allowNonTsExtensions: true
                });

                monaco.languages.typescript.getTypeScriptWorker()
                    .then(worker => {
                        worker(model.uri)
                            .then(client => {
                                client.getEmitOutput(model.uri.toString()).then(r => {
                                    resolve(r);;
                                });
                            });
                    });
            });
        }

        gridOptions = {
            data: this.wrData,
            enableFiltering: true,
            enableHorizontalScrollbar: this.uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: this.uiGridConstants.scrollbars.NEVER,
            paginationPageSizes: [],
            paginationPageSize: 15,
            columnDefs: [
                {
                    field: "id",
                    cellTemplate:
                    "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton edit' title='Edit' ng-click='grid.appScope.crmCodeEditor.retrieveItem($event)'></div><div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton delete' title='Delete' ng-click='grid.appScope.crmCodeEditor.deleteItem($event)'></div>",
                    enableColumnMenu: false,
                    width: 65,
                    cellClass: "editCell",
                    enableSorting: false,
                    displayName: "",
                    enableFiltering: false,
                    headerCellTemplate:
                    "<div class='toolbarButton largeImageButton new' id='newWr' title='New Web Resource' ng-click='grid.appScope.crmCodeEditor.new($event)'></div>"
                },
                {
                    field: "type",
                    displayName: "Type",
                    width: 120,
                    filter: {
                        term: "",
                        type: this.uiGridConstants.filter.SELECT,
                        selectOptions: [
                            { value: "3", label: "JS" }, { value: "1", label: "HTML" }, { value: "2", label: "CSS" },
                            { value: "4", label: "XML" }, { value: "0", label: "TypeScript" }
                        ]
                    },
                    cellClass: "gridLeft",
                    enableHiding: false,
                    cellTemplate: "<span>{{ grid.appScope.crmCodeEditor.numberToType(COL_FIELD, true, grid.appScope.crmCodeEditor.wrName) }}</span>"
                },
                {
                    field: "ismanaged",
                    displayName: "Managed",
                    width: 100,
                    filter: {
                        term: "",
                        type: this.uiGridConstants.filter.SELECT,
                        selectOptions: [{ value: "true", label: "True" }, { value: "false", label: "False" }]
                    },
                    cellClass: "gridLeft firstUpper",
                    enableHiding: false
                },
                {
                    field: "displayname",
                    displayName: "Display Name",
                    width: 500,
                    cellClass: "gridLeft",
                    enableHiding: false
                },
                {
                    field: "name",
                    displayName: "Name",
                    cellClass: "gridLeft",
                    enableHiding: false
                },
                {
                    field: "id",
                    enableColumnMenu: false,
                    enableSorting: false,
                    displayName: "",
                    enableFiltering: false,
                    cellTemplate:
                    "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton dependencies' title='Show Dependencies' ng-click='grid.appScope.crmCodeEditor.showDependencies($event)'></div>" +
                    "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton linkcopy clipLink' title='Copy Link' ng-click='grid.appScope.crmCodeEditor.copyLink($event)'></div>" +
                    "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton codecopy clipTag' title='Copy Tag' ng-click='grid.appScope.crmCodeEditor.copyTag($event, row.entity.type)' ng-show='row.entity.type === \"2\" || row.entity.type === \"3\"'></div>",
                    enableHiding: false,
                    width: 95,
                    headerCellTemplate:
                    "<div class='toolbarButton largeImageButton refresh' id='refresh' title='Refresh' ng-click='grid.appScope.crmCodeEditor.refresh($event)'></div>"
                }
            ],
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;
            }
        };

        toggleFiltering = () => {
            this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
            this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.COLUMN);
        };
    }
}

app.registerController("CrmCodeEditor", ["$scope", "$timeout", "$window", "uiGridConstants", "blockUI", "crmService", "base64", "notify"]);