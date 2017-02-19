/// <reference path="../app.ts" />

"use strict";

module app.directives {

    export class fileUpload implements IDirective {
        static $inject = ["$scope"];
        restrict = "A";
        link = ($scope, element, attrs) => {
            let handleDropStyle = (add: boolean) => {
                if (!$scope.crmCodeEditor.wrIsManaged) {
                    var editor = angular.element(document.querySelector("#monacoeditor"));
                    if (add)
                        editor.addClass("drop");
                    else
                        editor.removeClass("drop");
                }
            }

            let processDragOverOrEnter = (event) => {
                if (event !== null)
                    event.preventDefault();

                handleDropStyle(true);

                return false;
            };

            let processDragOverLeave = (event) => {
                handleDropStyle(false);
            }

            let validMimeTypes = attrs.fileDropzone;

            let checkExtension = (name) => {
                let extenion = name.split(".").pop();
                let validExtensions = ["js", "ts", "html", "css", "xml"];
                if (validExtensions.indexOf(extenion.toLowerCase()) !== -1)
                    return true;
                else {
                    $scope.crmCodeEditor.notify({ message: "Invalid file type. File extension must be one of following types JS, TS, HTML, CSS, or XML", duration: 3000 });
                    return false;
                }
            }

            let checkSize = (size) => {
                var ref;
                if (((ref = attrs.maxFileSize) === (void 0) || ref === "") || size < attrs.maxFileSize) {
                    return true;
                } else {
                    $scope.crmCodeEditor.notify({ message: "File must be smaller than " + (attrs.maxFileSize + "").replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " KB", duration: 3000 });
                    return false;
                }
            };

            let isTypeValid = (type) => {
                if ((validMimeTypes === (void 0) || validMimeTypes === "") || validMimeTypes.indexOf(type) > -1) {
                    return true;
                } else {
                    $scope.crmCodeEditor.notify({ message: "Invalid file type. File must be one of following types " + validMimeTypes, duration: 3000 });
                    return false;
                }
            };

            element.bind("dragover", processDragOverOrEnter);
            element.bind("dragenter", processDragOverOrEnter);
            element.bind("dragleave", processDragOverLeave);

            return element.bind("drop", (event: any) => {
                let reader;
                event.preventDefault();

                if ($scope.crmCodeEditor.editor.getEditorType() === "vs.editor.IDiffEditor") {
                    $scope.crmCodeEditor.notify({ message: "Cannot upload while in diff mode", duration: 3000 });
                    return false;
                }

                if ($scope.crmCodeEditor.wrIsManaged) {
                    $scope.crmCodeEditor.notify({ message: "Cannot upload to a managed web resource", duration: 3000 });
                    return false;
                }

                handleDropStyle(false);

                let file = event.dataTransfer.files[0];
                let name = file.name;
                let type = file.type;
                let size = file.size;

                reader = new FileReader();
                reader.onload = evt => {
                    if (isTypeValid(type) && checkExtension(name) && checkSize(size)) {
                        return $scope.$apply(() => {
                            $scope.crmCodeEditor.handleUpload(evt.target.result, name);

                            if (angular.isString($scope.fileName))
                                return $scope.fileName = name;
                        });
                    }
                };

                reader.readAsDataURL(file);
                return false;
            });
        };
    }
}

app.registerDirective("fileUpload", []);
