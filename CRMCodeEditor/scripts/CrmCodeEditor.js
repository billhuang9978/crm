"use strict";
var modules = ["app.controllers", "app.directives", "app.services"];
modules.forEach(function (module) { return angular.module(module, ["ngRoute", "ui.grid", "ui.grid.pagination", "blockUI", "cgNotify"]); });
angular.module("app", modules);
var app;
(function (app) {
    function registerController(className, services) {
        var controller = "app.controllers." + className;
        services.push(app.controllers[className]);
        angular.module("app.controllers").controller(controller, services);
    }
    app.registerController = registerController;
    function registerDirective(className, services) {
        var directive = className[0].toLowerCase() + className.slice(1);
        services.push((function () { return new app.directives[className](); }));
        angular.module("app.directives").directive(directive, services);
    }
    app.registerDirective = registerDirective;
    function registerService(className, services) {
        var service = className[0].toLowerCase() + className.slice(1);
        services.push((function () { return new app.services[className](); }));
        angular.module("app.services").factory(service, services);
    }
    app.registerService = registerService;
})(app || (app = {}));
"use strict";
var app;
(function (app) {
    var services;
    (function (services) {
        var CrmService = (function () {
            function CrmService() {
                var _this = this;
                this.checkForSoapError = function (response) {
                    var x2Js = new X2JS();
                    var jsonObj = x2Js.xml_str2json(response);
                    if (!jsonObj["Envelope"])
                        return null;
                    if (jsonObj["Envelope"]["Body"]["Fault"]) {
                        return jsonObj["Envelope"]["Body"]["Fault"]["faultcode"]["__text"] + "\n\n" +
                            jsonObj["Envelope"]["Body"]["Fault"]["faultstring"]["__text"];
                    }
                    return null;
                };
                this.checkForRestError = function (req) {
                    try {
                        var response = JSON.parse(req.response);
                        return req.statusText + "\n\n" + response["error"]["message"]["value"];
                    }
                    catch (e) {
                        return req.response;
                    }
                };
                this.parseGetDataResponse = function (result) {
                    var data = [];
                    var x2Js = new X2JS();
                    var jsonObj = x2Js.xml_str2json(result);
                    var webResourceId, displayNameValue, nameValue, webResourceType, isManaged;
                    var entities = jsonObj["Envelope"]["Body"]["RetrieveMultipleResponse"]["RetrieveMultipleResult"]["Entities"]["Entity"];
                    angular.forEach(entities, function (value) {
                        var attributes = value["Attributes"]["KeyValuePairOfstringanyType"];
                        angular.forEach(attributes, function (value2) {
                            var k = value2["key"]["__text"];
                            if (k === "webresourceid")
                                webResourceId = value2["value"]["__text"];
                            if (k === "name")
                                nameValue = value2["value"]["__text"];
                            if (k === "displayname")
                                displayNameValue = value2["value"]["__text"];
                            if (k === "webresourcetype")
                                webResourceType = value2["value"]["Value"]["__text"];
                            if (k === "ismanaged")
                                isManaged = value2["value"]["__text"];
                        });
                        data.push({
                            id: webResourceId,
                            displayname: displayNameValue,
                            name: nameValue,
                            type: webResourceType,
                            ismanaged: isManaged
                        });
                        webResourceId = null;
                        nameValue = null;
                        displayNameValue = null;
                        webResourceType = null;
                        isManaged = null;
                    });
                    return data;
                };
                this.parseGetDataResponseForPagingCookie = function (result) {
                    var pagingCookie = null;
                    var x2Js = new X2JS();
                    var jsonObj = x2Js.xml_str2json(result);
                    var moreRecords = jsonObj["Envelope"]["Body"]["RetrieveMultipleResponse"]["RetrieveMultipleResult"]["MoreRecords"]["__text"];
                    if (moreRecords)
                        pagingCookie = jsonObj["Envelope"]["Body"]["RetrieveMultipleResponse"]["RetrieveMultipleResult"]["PagingCookie"]["__text"];
                    if (pagingCookie != null)
                        pagingCookie = _this.escapeXml(pagingCookie);
                    return pagingCookie;
                };
                this.escapeXml = function (unsafe) {
                    return unsafe.replace(/[<>&'"]/g, function (c) {
                        switch (c) {
                            case "<": return "&lt;";
                            case ">": return "&gt;";
                            case "&": return "&amp;";
                            case "'": return "&apos;";
                            case '"': return "&quot;";
                        }
                    });
                };
                this.getVersion = function () {
                    return new Promise(function (resolve, reject) {
                        var request = [];
                        request.push("<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>");
                        request.push("<s:Body>");
                        request.push("<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>");
                        request.push("<request i:type='b:RetrieveVersionRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>");
                        request.push("<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />");
                        request.push("<a:RequestId i:nil='true' />");
                        request.push("<a:RequestName>RetrieveVersion</a:RequestName>");
                        request.push("</request>");
                        request.push("</Execute>");
                        request.push("</s:Body>");
                        request.push("</s:Envelope>");
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    var x2Js = new X2JS();
                                    var jsonObj = x2Js.xml_str2json(req.responseText);
                                    var version = jsonObj["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"]["KeyValuePairOfstringanyType"]["value"]["__text"];
                                    resolve(version.split("."));
                                }
                                else {
                                    var error = _this.checkForSoapError(req.responseText);
                                    if (error !== null)
                                        reject(error);
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(request.join(""));
                    });
                };
                this.saveItem = function (id, displayName, content, description) {
                    return new Promise(function (resolve, reject) {
                        var entity = {
                            Content: content,
                            DisplayName: displayName,
                            Description: description
                        };
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet(guid'" + id + "')", true);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.setRequestHeader("X-HTTP-Method", "MERGE");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 204 || req.status === 1223) {
                                    resolve("Complete");
                                }
                                else {
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(JSON.stringify(entity));
                    });
                };
                this.createItem = function (displayName, name, webResourceType, content, description) {
                    return new Promise(function (resolve, reject) {
                        var entity = {};
                        entity["DisplayName"] = displayName;
                        entity["Name"] = name;
                        entity["WebResourceType"] = {
                            Value: webResourceType
                        };
                        entity["Content"] = content;
                        entity["Description"] = description;
                        var req = new XMLHttpRequest();
                        req.open("POST", encodeURI(Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet"), true);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 201) {
                                    var result = JSON.parse(req.responseText).d;
                                    var newEntityId = result.WebResourceId;
                                    resolve(newEntityId);
                                }
                                else {
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(JSON.stringify(entity));
                    });
                };
                this.publishItem = function (id1, id2) {
                    return new Promise(function (resolve, reject) {
                        var publishString = "&lt;webresource&gt;{" + id1 + "}&lt;/webresource&gt;";
                        if (id2 !== null)
                            publishString += "&lt;webresource&gt;{" + id2 + "}&lt;/webresource&gt;";
                        var request = [];
                        request.push("<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>");
                        request.push("  <s:Body>");
                        request.push("    <Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>");
                        request.push("      <request i:type='b:PublishXmlRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>");
                        request.push("        <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>");
                        request.push("          <a:KeyValuePairOfstringanyType>");
                        request.push("            <c:key>ParameterXml</c:key>");
                        request.push("            <c:value i:type='d:string' xmlns:d='http://www.w3.org/2001/XMLSchema'>&lt;importexportxml&gt;&lt;webresources&gt;" + publishString + "&lt;/webresources&gt;&lt;/importexportxml&gt;</c:value>");
                        request.push("          </a:KeyValuePairOfstringanyType>");
                        request.push("        </a:Parameters>");
                        request.push("        <a:RequestId i:nil='true' />");
                        request.push("        <a:RequestName>PublishXml</a:RequestName>");
                        request.push("      </request>");
                        request.push("    </Execute>");
                        request.push("  </s:Body>");
                        request.push("</s:Envelope>");
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    resolve("Complete");
                                }
                                else {
                                    var error = _this.checkForSoapError(req.responseText);
                                    if (error !== null)
                                        reject(error);
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(request.join(""));
                    });
                };
                this.getItems = function (retrieveCount, pagingCookie, pageNumber) {
                    return new Promise(function (resolve, reject) {
                        var request = [];
                        request.push("<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">");
                        request.push("  <s:Body>");
                        request.push("    <RetrieveMultiple xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">");
                        request.push("      <query i:type=\"a:QueryExpression\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">");
                        request.push("        <a:ColumnSet>");
                        request.push("          <a:AllColumns>false</a:AllColumns>");
                        request.push("          <a:Columns xmlns:b=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">");
                        request.push("            <b:string>name</b:string>");
                        request.push("            <b:string>displayname</b:string>");
                        request.push("            <b:string>webresourceid</b:string>");
                        request.push("            <b:string>webresourcetype</b:string>");
                        request.push("            <b:string>ismanaged</b:string>");
                        request.push("          </a:Columns>");
                        request.push("        </a:ColumnSet>");
                        request.push("        <a:Criteria>");
                        request.push("          <a:Conditions>");
                        request.push("            <a:ConditionExpression>");
                        request.push("              <a:AttributeName>webresourcetype</a:AttributeName>");
                        request.push("              <a:Operator>In</a:Operator>");
                        request.push("              <a:Values xmlns:b=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">");
                        request.push("                <b:anyType i:type=\"c:int\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">1</b:anyType>");
                        request.push("                <b:anyType i:type=\"c:int\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">2</b:anyType>");
                        request.push("                <b:anyType i:type=\"c:int\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">3</b:anyType>");
                        request.push("                <b:anyType i:type=\"c:int\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">4</b:anyType>");
                        request.push("              </a:Values>");
                        request.push("              <a:EntityName i:nil=\"true\" />");
                        request.push("            </a:ConditionExpression>");
                        request.push("          </a:Conditions>");
                        request.push("          <a:FilterOperator>And</a:FilterOperator>");
                        request.push("          <a:Filters />");
                        request.push("        </a:Criteria>");
                        request.push("        <a:Distinct>false</a:Distinct>");
                        request.push("        <a:EntityName>webresource</a:EntityName>");
                        request.push("        <a:LinkEntities />");
                        request.push("        <a:Orders>");
                        request.push("          <a:OrderExpression>");
                        request.push("            <a:AttributeName>name</a:AttributeName>");
                        request.push("            <a:OrderType>Ascending</a:OrderType>");
                        request.push("          </a:OrderExpression>");
                        request.push("        </a:Orders>");
                        request.push("        <a:PageInfo>");
                        request.push("          <a:Count>" + retrieveCount + "</a:Count>");
                        request.push("          <a:PageNumber>" + pageNumber + "</a:PageNumber>");
                        if (pagingCookie === null)
                            request.push("          <a:PagingCookie a:nil='true' />");
                        else
                            request.push("          <a:PagingCookie>" + pagingCookie + "</a:PagingCookie>");
                        request.push("          <a:ReturnTotalRecordCount>false</a:ReturnTotalRecordCount>");
                        request.push("        </a:PageInfo>");
                        request.push("        <a:NoLock>false</a:NoLock>");
                        request.push("      </query>");
                        request.push("    </RetrieveMultiple>");
                        request.push("  </s:Body>");
                        request.push("</s:Envelope>");
                        var serverUrl = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
                        var req = new XMLHttpRequest();
                        req.open("POST", serverUrl, false);
                        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/RetrieveMultiple");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                if (req.status === 200) {
                                    resolve(req.responseText);
                                }
                                else {
                                    var error = _this.checkForSoapError(req.responseText);
                                    if (error !== null)
                                        reject(error);
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(request.join(""));
                    });
                };
                this.retrieveUsers = function (id1, id2) {
                    return new Promise(function (resolve, reject) {
                        var req = new XMLHttpRequest();
                        req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/SystemUserSet?$select=FullName,SystemUserId&$filter=SystemUserId " +
                            "eq (guid'" + id1 + "') or SystemUserId eq (guid'" + id2 + "')", true);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    var result = JSON.parse(req.responseText).d;
                                    resolve(result);
                                }
                                else {
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send();
                    });
                };
                this.retrieveUnpublishedItem = function (id) {
                    return new Promise(function (resolve, reject) {
                        var request = [];
                        request.push("<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>");
                        request.push("  <s:Body>");
                        request.push("    <Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>");
                        request.push("      <request i:type='b:RetrieveUnpublishedRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>");
                        request.push("        <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>");
                        request.push("          <a:KeyValuePairOfstringanyType>");
                        request.push("            <c:key>Target</c:key>");
                        request.push("            <c:value i:type='a:EntityReference'>");
                        request.push("              <a:Id>" + id + "</a:Id>");
                        request.push("              <a:KeyAttributes xmlns:d='http://schemas.microsoft.com/xrm/7.1/Contracts' />");
                        request.push("              <a:LogicalName>webresource</a:LogicalName>");
                        request.push("              <a:Name i:nil='true' />");
                        request.push("              <a:RowVersion i:nil='true' />");
                        request.push("           </c:value>");
                        request.push("          </a:KeyValuePairOfstringanyType>");
                        request.push("          <a:KeyValuePairOfstringanyType>");
                        request.push("            <c:key>ColumnSet</c:key>");
                        request.push("            <c:value i:type='a:ColumnSet'>");
                        request.push("              <a:AllColumns>false</a:AllColumns>");
                        request.push("              <a:Columns xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/Arrays'>");
                        request.push("                <d:string>content</d:string>");
                        request.push("                <d:string>webresourcetype</d:string>");
                        request.push("                <d:string>name</d:string>");
                        request.push("                <d:string>displayname</d:string>");
                        request.push("                <d:string>description</d:string>");
                        request.push("                <d:string>ismanaged</d:string>");
                        request.push("                <d:string>createdon</d:string>");
                        request.push("                <d:string>modifiedon</d:string>");
                        request.push("                <d:string>createdby</d:string>");
                        request.push("                <d:string>modifiedby</d:string>");
                        request.push("              </a:Columns>");
                        request.push("            </c:value>");
                        request.push("          </a:KeyValuePairOfstringanyType>");
                        request.push("        </a:Parameters>");
                        request.push("        <a:RequestId i:nil='true' />");
                        request.push("       <a:RequestName>RetrieveUnpublished</a:RequestName>");
                        request.push("      </request>");
                        request.push("    </Execute>");
                        request.push("  </s:Body>");
                        request.push("</s:Envelope>");
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    var x2Js = new X2JS();
                                    var jsonObj = x2Js.xml_str2json(req.responseText);
                                    resolve(jsonObj);
                                }
                                else {
                                    var error = _this.checkForSoapError(req.responseText);
                                    if (error !== null)
                                        reject(error);
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(request.join(""));
                    });
                };
                this.retrieveUnpublishedItemModified = function (id) {
                    return new Promise(function (resolve, reject) {
                        var request = [];
                        request.push("<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>");
                        request.push("  <s:Body>");
                        request.push("    <Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>");
                        request.push("      <request i:type='b:RetrieveUnpublishedRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>");
                        request.push("        <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>");
                        request.push("          <a:KeyValuePairOfstringanyType>");
                        request.push("            <c:key>Target</c:key>");
                        request.push("            <c:value i:type='a:EntityReference'>");
                        request.push("              <a:Id>" + id + "</a:Id>");
                        request.push("              <a:KeyAttributes xmlns:d='http://schemas.microsoft.com/xrm/7.1/Contracts' />");
                        request.push("              <a:LogicalName>webresource</a:LogicalName>");
                        request.push("              <a:Name i:nil='true' />");
                        request.push("              <a:RowVersion i:nil='true' />");
                        request.push("           </c:value>");
                        request.push("          </a:KeyValuePairOfstringanyType>");
                        request.push("          <a:KeyValuePairOfstringanyType>");
                        request.push("            <c:key>ColumnSet</c:key>");
                        request.push("            <c:value i:type='a:ColumnSet'>");
                        request.push("              <a:AllColumns>false</a:AllColumns>");
                        request.push("              <a:Columns xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/Arrays'>");
                        request.push("                <d:string>modifiedon</d:string>");
                        ;
                        request.push("              </a:Columns>");
                        request.push("            </c:value>");
                        request.push("          </a:KeyValuePairOfstringanyType>");
                        request.push("        </a:Parameters>");
                        request.push("        <a:RequestId i:nil='true' />");
                        request.push("       <a:RequestName>RetrieveUnpublished</a:RequestName>");
                        request.push("      </request>");
                        request.push("    </Execute>");
                        request.push("  </s:Body>");
                        request.push("</s:Envelope>");
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    var x2Js = new X2JS();
                                    var jsonObj = x2Js.xml_str2json(req.responseText);
                                    resolve(jsonObj);
                                }
                                else {
                                    var error = _this.checkForSoapError(req.responseText);
                                    if (error !== null)
                                        reject(error);
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(request.join(""));
                    });
                };
                this.retrievePublishedItem = function (id) {
                    return new Promise(function (resolve, reject) {
                        var req = new XMLHttpRequest();
                        req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet(guid'" +
                            id + "')?$select=Content", true);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    var result = JSON.parse(req.responseText).d;
                                    resolve(result.Content);
                                }
                                else {
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send();
                    });
                };
                this.retrieveItemByName = function (name) {
                    return new Promise(function (resolve, reject) {
                        var req = new XMLHttpRequest();
                        req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet?$select=WebResourceId&$filter=Name eq '" + name + "'", true);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    var returned = JSON.parse(req.responseText).d;
                                    var results = returned.results;
                                    if (results.length === 1)
                                        resolve(results[0].WebResourceId);
                                    resolve(null);
                                }
                                else {
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send();
                    });
                };
                this.deleteItem = function (id) {
                    return new Promise(function (resolve, reject) {
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet(guid'" + id + "')", true);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.setRequestHeader("X-HTTP-Method", "DELETE");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 204 || req.status === 1223) {
                                    resolve("Complete");
                                }
                                else {
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send();
                    });
                };
                this.getSolutions = function () {
                    return new Promise(function (resolve, reject) {
                        var req = new XMLHttpRequest();
                        req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/SolutionSet?$select=FriendlyName," +
                            "SolutionId,UniqueName,publisher_solution/CustomizationPrefix&$expand=publisher_solution&$filter=IsManaged eq false and " +
                            "IsVisible eq true&$orderby=FriendlyName asc", true);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    var returned = JSON.parse(req.responseText).d;
                                    var results = returned.results;
                                    var foundSolutions = [];
                                    for (var i = 0; i < results.length; i++) {
                                        var friendlyName = results[i].FriendlyName;
                                        var solutionId = results[i].SolutionId;
                                        var uniqueName = results[i].UniqueName;
                                        var publisherSolutionCustomizationPrefix = results[i].publisher_solution.CustomizationPrefix;
                                        foundSolutions[i] = {
                                            id: solutionId,
                                            name: friendlyName,
                                            uniquename: uniqueName,
                                            prefix: publisherSolutionCustomizationPrefix
                                        };
                                    }
                                    resolve(foundSolutions);
                                }
                                else {
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send();
                    });
                };
                this.addToSolution = function (id, solutionName) {
                    return new Promise(function (resolve, reject) {
                        var request = [];
                        request.push("<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>");
                        request.push(" <s:Body>");
                        request.push("   <Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>");
                        request.push("     <request i:type='b:AddSolutionComponentRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>");
                        request.push("       <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>");
                        request.push("         <a:KeyValuePairOfstringanyType>");
                        request.push("           <c:key>ComponentId</c:key>");
                        request.push("           <c:value i:type='d:guid' xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/'>" + id + "</c:value>");
                        request.push("         </a:KeyValuePairOfstringanyType>");
                        request.push("         <a:KeyValuePairOfstringanyType>");
                        request.push("           <c:key>ComponentType</c:key>");
                        request.push("           <c:value i:type='d:int' xmlns:d='http://www.w3.org/2001/XMLSchema'>61</c:value>");
                        request.push("         </a:KeyValuePairOfstringanyType>");
                        request.push("         <a:KeyValuePairOfstringanyType>");
                        request.push("           <c:key>SolutionUniqueName</c:key>");
                        request.push("           <c:value i:type='d:string' xmlns:d='http://www.w3.org/2001/XMLSchema'>" + solutionName + "</c:value>");
                        request.push("         </a:KeyValuePairOfstringanyType>");
                        request.push("         <a:KeyValuePairOfstringanyType>");
                        request.push("           <c:key>AddRequiredComponents</c:key>");
                        request.push("           <c:value i:type='d:boolean' xmlns:d='http://www.w3.org/2001/XMLSchema'>false</c:value>");
                        request.push("         </a:KeyValuePairOfstringanyType>");
                        request.push("       </a:Parameters>");
                        request.push("       <a:RequestId i:nil='true' />");
                        request.push("       <a:RequestName>AddSolutionComponent</a:RequestName>");
                        request.push("     </request>");
                        request.push("   </Execute>");
                        request.push(" </s:Body>");
                        request.push("</s:Envelope>");
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                        req.onreadystatechange = function () {
                            if (req.readyState === 4) {
                                req.onreadystatechange = null;
                                if (req.status === 200) {
                                    resolve("Complete");
                                }
                                else {
                                    var error = _this.checkForSoapError(req.responseText);
                                    if (error !== null)
                                        reject(error);
                                    var message = _this.checkForRestError(req);
                                    reject(message);
                                }
                            }
                        };
                        req.send(request.join(""));
                    });
                };
            }
            return CrmService;
        }());
        services.CrmService = CrmService;
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
app.registerService("CrmService", []);
"use strict";
var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var CrmCodeEditor = (function () {
            function CrmCodeEditor($scope, $timeout, $window, uiGridConstants, blockUI, CrmService, Base64, notify) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$window = $window;
                this.uiGridConstants = uiGridConstants;
                this.blockUI = blockUI;
                this.CrmService = CrmService;
                this.Base64 = Base64;
                this.notify = notify;
                this.crmVersion = null;
                this.crmService = null;
                this.mode = "grid";
                this.retrieveCount = 5000;
                this.editor = null;
                this.editor2 = null;
                this.editorMode = "edit";
                this.jsCompletionRegistered = false;
                this.tsCompletionRegistered = false;
                this.gridApi = null;
                this.workingId = null;
                this.workingType = null;
                this.wrIsManaged = true;
                this.wrIsNew = false;
                this.statusMessage = null;
                this.solutions = [];
                this.wrTypeCodes = [
                    { code: 1, name: "HTML" },
                    { code: 2, name: "CSS" },
                    { code: 3, name: "JScript" },
                    { code: 4, name: "XML" },
                    { code: 0, name: "TypeScript" }
                ];
                this.wrDescription = null;
                this.wrData = [];
                this.pagingCookie = null;
                this.pageNumber = 1;
                this.init = function () {
                    _this.block(null, "Loading...", null);
                    _this.$timeout(function () {
                        _this.getCrmVersion();
                    }, 0);
                };
                this.getCrmVersion = function () {
                    _this.CrmService.getVersion()
                        .then(function (result) {
                        _this.crmVersion = result;
                        _this.getData(null, 1, null);
                    })
                        .catch(function (err) {
                        _this.notify(err);
                        _this.$scope.$apply(function () {
                            _this.blockUI.stop();
                        });
                    });
                };
                this.handleUpload = function (value, filename) {
                    if (value === null)
                        return;
                    var decodedValue = null;
                    if (value)
                        decodedValue = _this.Base64.decode(value.split(",")[1]);
                    var extension = filename.split(".").pop();
                    _this.wrType = _this.typeToNumber(extension.toLowerCase());
                    _this.editor.getModel().dispose();
                    if (extension.toLowerCase() === "js")
                        extension = "javascript";
                    if (extension.toLowerCase() === "ts")
                        extension = "typescript";
                    _this.createEditor(decodedValue, extension.toLowerCase());
                };
                this.clearModel = function () {
                    _this.wrName = null;
                    _this.wrDisplayName = null;
                    _this.wrDescription = null;
                    _this.wrContent = null;
                    _this.wrType = 3;
                    _this.wrIsManaged = true;
                    _this.wrCreatedOn = null;
                    _this.wrCreatedBy = null;
                    _this.wrCreatedById = null;
                    _this.wrModifiedOn = null;
                    _this.wrModifiedBy = null;
                    _this.wrModifiedById = null;
                    _this.wrIsNew = false;
                };
                this.block = function (element, message, delay) {
                    if (!element) {
                        _this.blockUI.start(message);
                        if (delay) {
                            _this.$timeout(function () {
                                _this.blockUI.stop();
                            }, delay);
                        }
                    }
                    else {
                        var block_1 = _this.blockUI.instances.get(element);
                        block_1.start(message);
                        if (delay) {
                            _this.$timeout(function () {
                                block_1.stop();
                            }, delay);
                        }
                    }
                };
                this.getData = function (pagingCookie, pageNumber, gridApi) {
                    _this.pageNumber = pageNumber;
                    _this.CrmService.getItems(_this.retrieveCount, pagingCookie, pageNumber)
                        .then(function (responseText) {
                        var items = _this.CrmService.parseGetDataResponse(responseText);
                        angular.forEach(items, function (item) {
                            _this.wrData.push(item);
                        });
                        var tempPagingCookie = _this.CrmService.parseGetDataResponseForPagingCookie(responseText);
                        _this.$scope.$apply(function () {
                            _this.pagingCookie = tempPagingCookie;
                            _this.pageNumber++;
                        });
                        if (_this.pagingCookie)
                            _this.getData(_this.pagingCookie, _this.pageNumber, gridApi);
                        else {
                            _this.handleTypeScriptFiles();
                            _this.gridOptions.data = _this.wrData;
                            if (gridApi)
                                gridApi.core.refresh();
                            _this.gridApi.grid.columns[2].filters[0] = {
                                term: "false"
                            };
                            _this.blockUI.stop();
                        }
                    })
                        .catch(function (err) {
                        _this.notify(err);
                        _this.$scope.$apply(function () {
                            _this.blockUI.stop();
                        });
                    });
                };
                this.handleTypeScriptFiles = function () {
                    angular.forEach(_this.wrData, function (item) {
                        if (_this.isTypeScript(item.type, item.name))
                            item.type = "0";
                    });
                };
                this.isTypeScript = function (type, name) {
                    if (type === "4" && name.toUpperCase().substr(name.length - 3) === ".TS")
                        return true;
                    return false;
                };
                this.publishItem = function (id1, id2) {
                    _this.$scope.$apply(function () {
                        _this.blockUI.message("Publishing...");
                    });
                    _this.CrmService.publishItem(id1, id2)
                        .then(function () {
                        _this.$scope.$apply(function () {
                            _this.mode = "grid";
                            _this.editorMode = "edit";
                            _this.workingId = null;
                            _this.workingType = null;
                            _this.disposeEditor(_this.editor);
                            _this.blockUI.stop();
                        });
                    })
                        .catch(function (err) {
                        _this.notify(err);
                        _this.$scope.$apply(function () {
                            _this.blockUI.stop();
                        });
                    });
                };
                this.hidesave = function () {
                    if (_this.wrIsNew)
                        return true;
                    return _this.wrIsManaged;
                };
                this.showsave = function () {
                    if (_this.wrIsNew)
                        return false;
                    return !_this.wrIsManaged;
                };
                this.hidecreate = function () {
                    if (_this.wrIsNew)
                        return false;
                    return true;
                };
                this.showcreate = function () {
                    if (_this.wrIsNew)
                        return true;
                    return false;
                };
                this.showsxs = function () {
                    if (_this.mode === "grid")
                        return "none";
                    if (_this.editorMode === "sxs")
                        return "block";
                    return "none";
                };
                this.showeditor = function () {
                    if (_this.mode === "grid")
                        return "none";
                    if (_this.editorMode === "edit" || _this.editorMode === "diff")
                        return "block";
                    return "none";
                };
                this.gridmode = function () {
                    return (_this.mode === "grid");
                };
                this.editmode = function () {
                    return (_this.mode === "edit");
                };
                this.disablebutton = function () {
                    if (_this.editorMode === "diff" || _this.editorMode === "sxs")
                        return "buttonDisable";
                    return "";
                };
                this.disablediffbutton = function () {
                    if (_this.editorMode === "sxs")
                        return "buttonDisable";
                    return "";
                };
                this.disablesxsbutton = function () {
                    if (_this.editorMode === "diff")
                        return "buttonDisable";
                    return "";
                };
                this.validateSaveItem = function (publish) {
                    var value = _this.editor.getValue();
                    if (!value) {
                        _this.notify({ message: "You cannot use this web resource because it is empty", duration: 3000 });
                        return;
                    }
                    if (_this.workingType === "javascript") {
                        _this.validatecode(value, false, publish);
                    }
                    else {
                        _this.saveItem(publish);
                    }
                };
                this.updateModifedOn = function (id) {
                    _this.CrmService.retrieveUnpublishedItemModified(id)
                        .then(function (result) {
                        _this.$scope.$apply(function () {
                            _this.wrModifiedOn = result["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"]["KeyValuePairOfstringanyType"]["value"]["FormattedValues"]["KeyValuePairOfstringstring"]["value"]["__text"];
                        });
                    })
                        .catch(function (err) {
                        _this.notify(err);
                    });
                };
                this.saveItem = function (publish) {
                    if (_this.wrType === 0) {
                        _this.saveTsItems(publish);
                        return;
                    }
                    _this.notify.closeAll();
                    _this.block(null, "Saving...", null);
                    var value = _this.editor.getValue();
                    var b64Value = _this.Base64.encode(value);
                    ;
                    _this.CrmService.saveItem(_this.workingId, _this.wrDisplayName, b64Value, _this.wrDescription)
                        .then(function () {
                        if (publish) {
                            _this.publishItem(_this.workingId, null);
                        }
                        else {
                            _this.$scope.$apply(function () {
                                _this.updateModifedOn(_this.workingId);
                                _this.blockUI.stop();
                            });
                        }
                    })
                        .catch(function (err) {
                        _this.notify(err);
                        _this.editor.getModel().dispose();
                        _this.$scope.$apply(function () {
                            _this.blockUI.stop();
                        });
                    });
                };
                this.saveTsItems = function (publish) {
                    _this.notify.closeAll();
                    _this.block(null, "Saving...", null);
                    var tsValue = _this.editor.getValue();
                    var tsB64Value = _this.Base64.encode(tsValue);
                    var jsValue = ts.transpile(tsValue);
                    var jsB64Value = _this.Base64.encode(jsValue);
                    var jsName = _this.wrName.slice(0, -3) + ".js";
                    _this.CrmService.retrieveItemByName(jsName)
                        .then(function (result) {
                        var p1;
                        if (result === null)
                            p1 = _this.createWebResource(_this.wrDisplayName, jsName, 3, jsB64Value, _this.wrDescription);
                        else
                            p1 = _this.CrmService.saveItem(result, _this.wrDisplayName, jsB64Value, _this.wrDescription);
                        var p2 = _this.CrmService.saveItem(_this.workingId, _this.wrDisplayName, tsB64Value, _this.wrDescription);
                        Promise.all([p1, p2])
                            .then(function (values) {
                            var jsId = (result === null) ? values[0] : result;
                            if (publish) {
                                _this.publishItem(String(jsId), _this.workingId);
                            }
                            else {
                                _this.$scope.$apply(function () {
                                    _this.updateModifedOn(_this.workingId);
                                    _this.blockUI.stop();
                                });
                            }
                        })
                            .catch(function (err) {
                            _this.$scope.$apply(function () {
                                _this.blockUI.stop();
                            });
                            _this.editor.getModel().dispose();
                            _this.notify(err);
                        });
                    })
                        .catch(function (err) {
                        _this.editor.getModel().dispose();
                        _this.$scope.$apply(function () {
                            _this.blockUI.stop();
                        });
                        _this.notify(err);
                    });
                };
                this.showDiff = function () {
                    var newValue = _this.editor.getValue();
                    if (_this.editor.getEditorType() === "vs.editor.ICodeEditor") {
                        _this.editorMode = "diff";
                        _this.block(null, "Retrieving...", null);
                        _this.CrmService.retrievePublishedItem(_this.workingId)
                            .then(function (result) {
                            var currentValue = _this.Base64.decode(result);
                            _this.disposeEditor(_this.editor);
                            _this.createDiffEditor(currentValue, newValue, _this.workingType);
                            _this.$scope.$apply(function () {
                                _this.blockUI.stop();
                            });
                        })
                            .catch(function (err) {
                            _this.notify(err);
                            _this.$scope.$apply(function () {
                                _this.blockUI.stop();
                            });
                        });
                    }
                    else {
                        _this.disposeEditor(_this.editor);
                        _this.editorMode = "edit";
                        _this.createEditor(newValue, _this.workingType);
                    }
                };
                this.showJs = function () {
                    var tsValue = _this.editor.getValue();
                    var wrapper = document.getElementById("sxswrapper");
                    var ed = document.getElementById("monacoeditor");
                    if (_this.editorMode === "edit") {
                        wrapper.style.display = "block";
                        ed.style.display = "none";
                        _this.editorMode = "sxs";
                        var jsValue = ts.transpile(tsValue);
                        _this.disposeEditor(_this.editor);
                        _this.createSxsEditor(tsValue, jsValue);
                    }
                    else {
                        wrapper.style.display = "none";
                        ed.style.display = "block";
                        tsValue = _this.editor.getValue();
                        _this.disposeEditor(_this.editor);
                        _this.disposeEditor(_this.editor2);
                        _this.editorMode = "edit";
                        _this.createEditor(tsValue, "typescript");
                    }
                };
                this.addToSolution = function (id, solutionName, done) {
                    if (_this.selectedSolution !== "fd140aaf-4df4-11dd-bd17-0019b9312238") {
                        _this.CrmService.addToSolution(id, solutionName)
                            .catch(function (err) {
                            _this.notify(err);
                        });
                    }
                    if (!done)
                        return;
                    _this.editor.getModel().dispose();
                    _this.mode = "grid";
                    _this.wrIsNew = false;
                    _this.blockUI.stop();
                };
                this.validateCreateItem = function () {
                    if (!_this.wrName) {
                        _this.notify({ message: "Name is required", duration: 3000 });
                        return;
                    }
                    var pattern = new RegExp("^[a-zA-Z0-9_.\\/]*$");
                    if (!pattern.test(_this.wrName)) {
                        _this.notify({ message: "Web resource names may only include letters, numbers, periods, and nonconsecutive forward slash characters", duration: 3000 });
                        return;
                    }
                    var value = _this.editor.getValue();
                    if (!value) {
                        _this.notify({ message: "You cannot use this web resource because it is empty", duration: 3000 });
                        return;
                    }
                    if (_this.wrType === 3) {
                        _this.validatecode(value, true, false);
                    }
                    else {
                        _this.createItem();
                    }
                };
                this.createItem = function () {
                    if (_this.wrType === 0) {
                        _this.createTsItems();
                        return;
                    }
                    _this.notify.closeAll();
                    _this.block(null, "Saving...", null);
                    var value = _this.editor.getValue();
                    var b64Value = _this.Base64.encode(value);
                    _this.CrmService.createItem((!_this.wrDisplayName) ? null : _this.wrDisplayName.trim(), _this.solPrefix + _this.wrName.trim(), _this.wrType, b64Value, (!_this.wrDescription) ? null : _this.wrDescription.trim())
                        .then(function (result) {
                        var selSolution = _this.selectedSolution;
                        var solutionName = _this.solutions.filter(function (solution, index) { return solution["id"] === selSolution; })[0]["uniquename"];
                        _this.addToSolution(result, solutionName, true);
                        _this.clearModel();
                        _this.gridApi.grid.clearAllFilters();
                        _this.wrData = [];
                        _this.gridOptions.data = _this.wrData;
                        _this.gridApi.core.refresh();
                        _this.getData(null, 1, _this.gridApi);
                    })
                        .catch(function (err) {
                        _this.$scope.$apply(function () {
                            _this.blockUI.stop();
                        });
                        _this.notify(err);
                    });
                };
                this.createTsItems = function () {
                    _this.notify.closeAll();
                    _this.block(null, "Saving...", null);
                    var tsValue = _this.editor.getValue();
                    var tsB64Value = _this.Base64.encode(tsValue);
                    var jsValue = ts.transpile(tsValue);
                    var jsB64Value = _this.Base64.encode(jsValue);
                    var tsName = _this.solPrefix + _this.wrName.trim() + ".ts";
                    var jsName = _this.solPrefix + _this.wrName.trim() + ".js";
                    var tsType = 4;
                    var jsType = 3;
                    var displayName = (!_this.wrDisplayName) ? null : _this.wrDisplayName.trim();
                    var description = (!_this.wrDescription) ? null : _this.wrDescription.trim();
                    _this.CrmService.retrieveItemByName(jsName)
                        .then(function (result) {
                        if (result !== null) {
                            _this.$scope.$apply(function () {
                                _this.blockUI.stop();
                            });
                            _this.notify("A JavaScript webresource with the same name already exists. Use a different name.");
                            return;
                        }
                        var p1 = _this.createWebResource(displayName, tsName, tsType, tsB64Value, description);
                        var p2 = _this.createWebResource(displayName, jsName, jsType, jsB64Value, description);
                        Promise.all([p1, p2])
                            .then(function (values) {
                            var selSolution = _this.selectedSolution;
                            var solutionName = _this.solutions
                                .filter(function (solution, index) { return solution["id"] === selSolution; })[0]["uniquename"];
                            for (var i = 0; i < values.length; i++) {
                                var done = (i + 1 === values.length);
                                _this.addToSolution(String(values[i]), solutionName, done);
                            }
                            _this.clearModel();
                            _this.gridApi.grid.clearAllFilters();
                            _this.wrData = [];
                            _this.gridOptions.data = _this.wrData;
                            _this.gridApi.core.refresh();
                            _this.getData(null, 1, _this.gridApi);
                        })
                            .catch(function (err) {
                            _this.$scope.$apply(function () {
                                _this.blockUI.stop();
                            });
                            _this.notify(err);
                        });
                    })
                        .catch(function (err) {
                        _this.$scope.$apply(function () {
                            _this.blockUI.stop();
                        });
                        _this.notify(err);
                        return;
                    });
                };
                this.createWebResource = function (displayname, name, type, content, description) {
                    return new Promise(function (resolve, reject) {
                        _this.CrmService.createItem(displayname, name, type, content, description)
                            .then(function (result) {
                            resolve(result);
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                    });
                };
                this.validatecode = function (script, isNew, publish) {
                    try {
                        esprima.parse(script, { tolerant: true, loc: true });
                        if (isNew)
                            _this.createItem();
                        else
                            _this.saveItem(publish);
                    }
                    catch (e) {
                        var template = "<span>OK to Save? Code Errors Detected:</span></br></br><span>" + e.message + "</span></br></br><button ng-click='crmCodeEditor." +
                            ((isNew) ? "create" : "save") + "Item(" + publish +
                            ")'>OK</button><button class='confirmCancel' ng-click='crmCodeEditor.confirmCancel()'>Cancel</button>";
                        _this.notify({
                            messageTemplate: template,
                            scope: _this.$scope
                        });
                    }
                };
                this.cancel = function () {
                    _this.notify.closeAll();
                    _this.disposeEditor(_this.editor);
                    _this.mode = "grid";
                    _this.editorMode = "edit";
                    _this.clearModel();
                    _this.workingId = null;
                    _this.wrIsNew = false;
                };
                this.disposeEditor = function (editor) {
                    if (editor) {
                        if (editor.getModel()) {
                            if (typeof (editor.getModel().dispose) !== "undefined")
                                editor.getModel().dispose();
                        }
                        editor.dispose();
                        editor = null;
                        document.getElementById("monacoeditor").innerHTML = "";
                        document.getElementById("tsmonacoeditor").innerHTML = "";
                        document.getElementById("jsmonacoeditor").innerHTML = "";
                    }
                };
                this.copy = function (element, block, value) {
                    var result = new Clipboard(element, {
                        text: function () { return value; }
                    });
                    result.on("success", function () {
                        _this.block(block, "Copied", 600);
                    });
                    result.on("error", function () {
                        _this.block(block, "Error!", 900);
                    });
                };
                this.copyCode = function () {
                    _this.copy(".copycode", null, _this.editor.getValue());
                };
                this.saveAs = function () {
                    _this.clearModel();
                    var value = _this.editor.getValue().trim();
                    _this.disposeEditor(_this.editor);
                    _this.editorMode = "edit";
                    _this.statusMessage = "Creating new web resource";
                    _this.wrType = _this.typeToNumber(_this.workingType);
                    _this.wrIsNew = true;
                    _this.getSolutions(value, _this.workingType);
                };
                this.setJavaScriptCompletion = function (language) {
                    if (language === "javascript" && _this.jsCompletionRegistered)
                        return;
                    if (language === "typescript" && _this.tsCompletionRegistered)
                        return;
                    monaco.languages.registerCompletionItemProvider(language, {
                        provideCompletionItems: function (model, position) {
                            var snippets = new Snippets();
                            return snippets.getSnippets();
                        }
                    });
                    (language === "javascript") ? _this.jsCompletionRegistered = true : _this.tsCompletionRegistered = true;
                };
                this.resize = function () {
                    var wrapper = document.getElementById("sxswrapper");
                    var lhs = {
                        domNode: document.getElementById("tsmonacoeditor"),
                        editor: null
                    };
                    var rhs = {
                        domNode: document.getElementById("jsmonacoeditor"),
                        editor: null
                    };
                    var horizontalSpace = 0;
                    var wrapperSizeDiff = 25;
                    var windowHeight = window.innerHeight || document.body.offsetHeight || document.documentElement.offsetHeight;
                    wrapper.style.height = (windowHeight - wrapper.offsetTop - wrapperSizeDiff) + "px";
                    var halfWidth = Math.floor((wrapper.clientWidth - 0) / 2) - 2 - (horizontalSpace / 2);
                    var lhsSizeDiff = wrapperSizeDiff + 40;
                    lhs.domNode.style.width = halfWidth + "px";
                    lhs.domNode.style.height = (windowHeight - wrapper.offsetTop - lhsSizeDiff) + "px";
                    if (lhs.editor)
                        lhs.editor.layout();
                    var rhsSizeDiff = wrapperSizeDiff + 40;
                    rhs.domNode.style.width = halfWidth + "px";
                    rhs.domNode.style.height = (windowHeight - wrapper.offsetTop - rhsSizeDiff) + "px";
                    if (rhs.editor)
                        rhs.editor.layout();
                };
                this.createEditor = function (content, format) {
                    _this.setJavaScriptCompletion(format);
                    _this.editor = monaco.editor.create(document.getElementById("monacoeditor"), {
                        value: (content !== null) ? content : null,
                        language: format,
                        readOnly: _this.wrIsManaged,
                        wordWrap: true,
                        scrollBeyondLastLine: false,
                        parameterHints: true,
                        folding: true
                    });
                    _this.editor.layout();
                };
                this.createSxsEditor = function (ts, js) {
                    _this.editor = monaco.editor.create(document.getElementById("tsmonacoeditor"), {
                        value: ts,
                        language: "typescript",
                        readOnly: true,
                        wordWrap: true,
                        scrollBeyondLastLine: false,
                        parameterHints: true,
                        folding: true
                    });
                    _this.editor2 = monaco.editor.create(document.getElementById("jsmonacoeditor"), {
                        value: js,
                        language: "javascript",
                        readOnly: true,
                        wordWrap: true,
                        scrollBeyondLastLine: false,
                        parameterHints: true,
                        folding: true
                    });
                    _this.resize();
                };
                this.createDiffEditor = function (currentValue, newValue, format) {
                    _this.editor = monaco.editor.createDiffEditor(document.getElementById("monacoeditor"), {
                        wordWrap: true,
                        scrollBeyondLastLine: false,
                        parameterHints: true,
                        folding: true,
                        readOnly: true
                    });
                    _this.editor.setModel({
                        modified: monaco.editor.createModel(currentValue, format),
                        original: monaco.editor.createModel(newValue, format)
                    });
                };
                this.solutionChange = function () {
                    _this.solPrefix = _this.findSolutionPrefix();
                };
                this.findSolutionPrefix = function () {
                    var selSolution = _this.selectedSolution;
                    var solution = _this.solutions.filter(function (obj, index) { return obj["id"] === selSolution; });
                    return solution[0]["prefix"] + "_";
                };
                this.wrTypeChange = function () {
                    var value = _this.editor.getValue();
                    _this.disposeEditor(_this.editor);
                    switch (_this.wrType) {
                        case 2:
                            _this.createEditor(value, "css");
                            break;
                        case 3:
                            _this.createEditor(value, "javascript");
                            break;
                        case 4:
                            _this.createEditor(value, "xml");
                            break;
                        case 0:
                            _this.createEditor(value, "typescript");
                            break;
                        default:
                            _this.createEditor(value, "html");
                            break;
                    }
                };
                this.getSolutions = function (content, type) {
                    _this.CrmService.getSolutions()
                        .then(function (results) {
                        _this.solutions = _this.moveDefaultToTop(results, "fd140aaf-4df4-11dd-bd17-0019b9312238");
                        _this.$scope.$apply(function () {
                            _this.selectedSolution = "fd140aaf-4df4-11dd-bd17-0019b9312238";
                            _this.solPrefix = _this.findSolutionPrefix();
                            _this.createEditor(content, type);
                        });
                    })
                        .catch(function (err) {
                        _this.notify(err);
                    });
                };
                this.moveDefaultToTop = function (results, id) {
                    for (var i = 0; i < results.length; ++i) {
                        if (results[i].id === id) {
                            var temp = results[i];
                            results.splice(i, 1);
                            results.unshift(temp);
                            break;
                        }
                    }
                    return results;
                };
                this.new = function () {
                    _this.getSolutions(null, "javascript");
                    _this.mode = "edit";
                    _this.statusMessage = "Creating new web resource";
                    _this.wrIsNew = true;
                    _this.wrType = 3;
                    _this.wrIsManaged = false;
                };
                this.copyTag = function (event, type) {
                    var id = event.target.id;
                    var name = _this.wrData.filter(function (wrItem, index) { return wrItem["id"] === id; })[0]["name"];
                    if (type === "3")
                        _this.copy(".clipTag", null, "<script src='/WebResources/" + name + "'></script>");
                    else
                        _this.copy(".clipTag", null, "<link href='/WebResources/" + name + "' rel='stylesheet' />");
                };
                this.copyLink = function (event) {
                    var id = event.target.id;
                    var name = _this.wrData.filter(function (wrItem, index) { return wrItem["id"] === id; })[0]["name"];
                    var text = Xrm.Page.context.getClientUrl() + "/WebResources/" + name;
                    _this.copy(".clipLink", null, text);
                };
                this.showDependencies = function (event) {
                    var id = event.target.id;
                    _this.$window
                        .open(Xrm.Page.context.getClientUrl() +
                        "/tools/dependency/dependencyviewdialog.aspx?appSolutionId=%7bFD140AAF-4DF4-11DD-BD17-0019B9312238%7d&dType=1&objectid=%7b" +
                        id + "%7d&objecttype=9333&operationtype=showdependency", "", "width=900px,height=730px,top=0,left=0,menubar=no");
                };
                this.refresh = function () {
                    _this.block(null, "Loading...", null);
                    _this.gridApi.grid.clearAllFilters();
                    _this.wrData = [];
                    _this.gridOptions.data = _this.wrData;
                    _this.gridApi.core.refresh();
                    setTimeout(function () { _this.getData(null, 1, _this.gridApi); }, 500);
                };
                this.confirmCancel = function () {
                    _this.notify.closeAll();
                };
                this.deleteOk = function (id) {
                    _this.notify.closeAll();
                    _this.block(null, "Deleting...", null);
                    _this.CrmService.deleteItem(id)
                        .then(function () {
                        _this.blockUI.stop();
                        _this.refresh();
                    })
                        .catch(function (err) {
                        _this.blockUI.stop();
                        _this.notify(err);
                    });
                };
                this.deleteItem = function (event) {
                    var id = event.target.id;
                    var template = "<span>Are you sure?</br></br>Deleting items is permanent!</br></br></span><button ng-click='crmCodeEditor.deleteOk(\"" + id +
                        "\")'>OK</button><button class='confirmCancel' ng-click='crmCodeEditor.confirmCancel()'>Cancel</button>";
                    _this.notify({
                        messageTemplate: template,
                        scope: _this.$scope
                    });
                };
                this.retrieveItem = function (event) {
                    _this.block(null, "Retrieving...", null);
                    var id = event.target.id;
                    _this.workingId = id;
                    _this.CrmService.retrieveUnpublishedItem(id)
                        .then(function (result) {
                        _this.$scope.$apply(function () {
                            var attributes = result["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"]["KeyValuePairOfstringanyType"]["value"]["Attributes"]["KeyValuePairOfstringanyType"];
                            angular.forEach(attributes, function (attribute) {
                                switch (attribute["key"]["__text"]) {
                                    case "name":
                                        _this.wrName = attribute["value"]["__text"];
                                        break;
                                    case "displayname":
                                        _this.wrDisplayName = attribute["value"]["__text"];
                                        break;
                                    case "description":
                                        _this.wrDescription = attribute["value"]["__text"];
                                        break;
                                    case "content":
                                        _this.wrContent = attribute["value"]["__text"];
                                        break;
                                    case "webresourcetype":
                                        _this.wrType = parseInt(attribute["value"]["Value"]["__text"]);
                                        break;
                                    case "ismanaged":
                                        _this.wrIsManaged = JSON.parse(attribute["value"]["__text"]);
                                        break;
                                    case "modifiedby":
                                        _this.wrModifiedById = attribute["value"]["Id"]["__text"];
                                        break;
                                    case "createdby":
                                        _this.wrCreatedById = attribute["value"]["Id"]["__text"];
                                        break;
                                }
                            });
                            if (_this.isTypeScript(_this.wrType.toString(), _this.wrName))
                                _this.wrType = 0;
                            var formattedValues = result["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"]["KeyValuePairOfstringanyType"]["value"]["FormattedValues"]["KeyValuePairOfstringstring"];
                            angular.forEach(formattedValues, function (formattedValue) {
                                switch (formattedValue["key"]["__text"]) {
                                    case "modifiedon":
                                        _this.wrModifiedOn = formattedValue["value"]["__text"];
                                        break;
                                    case "createdon":
                                        _this.wrCreatedOn = formattedValue["value"]["__text"];
                                        break;
                                }
                            });
                            _this.workingType = _this.numberToType(_this.wrType, false, _this.wrName).toLowerCase();
                            _this.wrIsNew = false;
                        });
                        return _this.CrmService.retrieveUsers(_this.wrCreatedById, _this.wrModifiedById);
                    })
                        .then(function (result) {
                        _this.$scope.$apply(function () {
                            angular.forEach(result["results"], function (user) {
                                if (user["SystemUserId"].toLowerCase() === _this.wrCreatedById.toLowerCase())
                                    _this.wrCreatedBy = user["FullName"];
                                if (user["SystemUserId"].toLowerCase() === _this.wrModifiedById.toLowerCase())
                                    _this.wrModifiedBy = user["FullName"];
                            });
                            _this.mode = "edit";
                            _this.statusMessage = ((_this.wrIsManaged) ? "Viewing: " : "Editing: ");
                            _this.blockUI.stop();
                        });
                    })
                        .then(function () {
                        var decodedValue = null;
                        if (_this.wrContent)
                            decodedValue = _this.Base64.decode(_this.wrContent);
                        _this.blockUI.stop();
                        _this.createEditor(decodedValue, _this.workingType);
                    })
                        .catch(function (err) {
                        _this.blockUI.stop();
                        _this.notify(err);
                    });
                };
                this.numberToType = function (input, short, name) {
                    var types = {
                        3: (short) ? "JS" : "JavaScript",
                        1: "HTML",
                        2: "CSS",
                        4: "XML",
                        0: (short) ? "TS" : "TypeScript"
                    };
                    if (input === 4 && name.toUpperCase().substr(name.length - 3) === ".TS")
                        return (short) ? "TS" : "TypeScript";
                    return types[input];
                };
                this.typeToNumber = function (input) {
                    var types = {
                        "javascript": 3,
                        "js": 3,
                        "html": 1,
                        "css": 2,
                        "xml": 4,
                        "ts": 0,
                        "typescript": 0
                    };
                    if (!input)
                        return "";
                    return types[input];
                };
                this.transpile = function () {
                    var model = _this.editor.getModel();
                    return new Promise(function (resolve) {
                        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                            target: monaco.languages.typescript.ScriptTarget.ES5,
                            allowNonTsExtensions: true
                        });
                        monaco.languages.typescript.getTypeScriptWorker()
                            .then(function (worker) {
                            worker(model.uri)
                                .then(function (client) {
                                client.getEmitOutput(model.uri.toString()).then(function (r) {
                                    resolve(r);
                                    ;
                                });
                            });
                        });
                    });
                };
                this.gridOptions = {
                    data: this.wrData,
                    enableFiltering: true,
                    enableHorizontalScrollbar: this.uiGridConstants.scrollbars.NEVER,
                    enableVerticalScrollbar: this.uiGridConstants.scrollbars.NEVER,
                    paginationPageSizes: [],
                    paginationPageSize: 15,
                    columnDefs: [
                        {
                            field: "id",
                            cellTemplate: "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton edit' title='Edit' ng-click='grid.appScope.crmCodeEditor.retrieveItem($event)'></div><div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton delete' title='Delete' ng-click='grid.appScope.crmCodeEditor.deleteItem($event)'></div>",
                            enableColumnMenu: false,
                            width: 65,
                            cellClass: "editCell",
                            enableSorting: false,
                            displayName: "",
                            enableFiltering: false,
                            headerCellTemplate: "<div class='toolbarButton largeImageButton new' id='newWr' title='New Web Resource' ng-click='grid.appScope.crmCodeEditor.new($event)'></div>"
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
                            cellTemplate: "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton dependencies' title='Show Dependencies' ng-click='grid.appScope.crmCodeEditor.showDependencies($event)'></div>" +
                                "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton linkcopy clipLink' title='Copy Link' ng-click='grid.appScope.crmCodeEditor.copyLink($event)'></div>" +
                                "<div id='{{ COL_FIELD }}' class='toolbarButton smallImageButton codecopy clipTag' title='Copy Tag' ng-click='grid.appScope.crmCodeEditor.copyTag($event, row.entity.type)' ng-show='row.entity.type === \"2\" || row.entity.type === \"3\"'></div>",
                            enableHiding: false,
                            width: 95,
                            headerCellTemplate: "<div class='toolbarButton largeImageButton refresh' id='refresh' title='Refresh' ng-click='grid.appScope.crmCodeEditor.refresh($event)'></div>"
                        }
                    ],
                    onRegisterApi: function (gridApi) {
                        _this.gridApi = gridApi;
                    }
                };
                this.toggleFiltering = function () {
                    _this.gridOptions.enableFiltering = !_this.gridOptions.enableFiltering;
                    _this.gridApi.core.notifyDataChange(_this.uiGridConstants.dataChange.COLUMN);
                };
                $scope.crmService = CrmService;
                this.init();
                this.notify.config({ startTop: 300, maximumOpen: 1 });
                this.resize();
            }
            return CrmCodeEditor;
        }());
        controllers.CrmCodeEditor = CrmCodeEditor;
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
app.registerController("CrmCodeEditor", ["$scope", "$timeout", "$window", "uiGridConstants", "blockUI", "crmService", "base64", "notify"]);
"use strict";
var app;
(function (app) {
    var directives;
    (function (directives) {
        var fileUpload = (function () {
            function fileUpload() {
                this.restrict = "A";
                this.link = function ($scope, element, attrs) {
                    var handleDropStyle = function (add) {
                        if (!$scope.crmCodeEditor.wrIsManaged) {
                            var editor = angular.element(document.querySelector("#monacoeditor"));
                            if (add)
                                editor.addClass("drop");
                            else
                                editor.removeClass("drop");
                        }
                    };
                    var processDragOverOrEnter = function (event) {
                        if (event !== null)
                            event.preventDefault();
                        handleDropStyle(true);
                        return false;
                    };
                    var processDragOverLeave = function (event) {
                        handleDropStyle(false);
                    };
                    var validMimeTypes = attrs.fileDropzone;
                    var checkExtension = function (name) {
                        var extenion = name.split(".").pop();
                        var validExtensions = ["js", "ts", "html", "css", "xml"];
                        if (validExtensions.indexOf(extenion.toLowerCase()) !== -1)
                            return true;
                        else {
                            $scope.crmCodeEditor.notify({ message: "Invalid file type. File extension must be one of following types JS, TS, HTML, CSS, or XML", duration: 3000 });
                            return false;
                        }
                    };
                    var checkSize = function (size) {
                        var ref;
                        if (((ref = attrs.maxFileSize) === (void 0) || ref === "") || size < attrs.maxFileSize) {
                            return true;
                        }
                        else {
                            $scope.crmCodeEditor.notify({ message: "File must be smaller than " + (attrs.maxFileSize + "").replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " KB", duration: 3000 });
                            return false;
                        }
                    };
                    var isTypeValid = function (type) {
                        if ((validMimeTypes === (void 0) || validMimeTypes === "") || validMimeTypes.indexOf(type) > -1) {
                            return true;
                        }
                        else {
                            $scope.crmCodeEditor.notify({ message: "Invalid file type. File must be one of following types " + validMimeTypes, duration: 3000 });
                            return false;
                        }
                    };
                    element.bind("dragover", processDragOverOrEnter);
                    element.bind("dragenter", processDragOverOrEnter);
                    element.bind("dragleave", processDragOverLeave);
                    return element.bind("drop", function (event) {
                        var reader;
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
                        var file = event.dataTransfer.files[0];
                        var name = file.name;
                        var type = file.type;
                        var size = file.size;
                        reader = new FileReader();
                        reader.onload = function (evt) {
                            if (isTypeValid(type) && checkExtension(name) && checkSize(size)) {
                                return $scope.$apply(function () {
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
            return fileUpload;
        }());
        fileUpload.$inject = ["$scope"];
        directives.fileUpload = fileUpload;
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
app.registerDirective("fileUpload", []);
"use strict";
var app;
(function (app) {
    var services;
    (function (services) {
        var Base64 = (function () {
            function Base64() {
                this.padchar = "=";
                this.alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            }
            Base64.prototype.getByte = function (s, i) {
                var x = s.charCodeAt(i);
                return x;
            };
            Base64.prototype.getByte64 = function (s, i) {
                var idx = this.alpha.indexOf(s.charAt(i));
                return idx;
            };
            Base64.prototype.decode = function (s) {
                var pads = 0, i, b10, imax = s.length, x = [];
                s = String(s);
                if (imax === 0) {
                    return s;
                }
                if (s.charAt(imax - 1) === this.padchar) {
                    pads = 1;
                    if (s.charAt(imax - 2) === this.padchar) {
                        pads = 2;
                    }
                    imax -= 4;
                }
                for (i = 0; i < imax; i += 4) {
                    b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
                }
                switch (pads) {
                    case 1:
                        b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6);
                        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
                        break;
                    case 2:
                        b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                        x.push(String.fromCharCode(b10 >> 16));
                        break;
                }
                return x.join("");
            };
            Base64.prototype.encode = function (s) {
                s = String(s);
                var i, b10, x = [], imax = s.length - s.length % 3;
                if (s.length === 0) {
                    return s;
                }
                for (i = 0; i < imax; i += 3) {
                    b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
                    x.push(this.alpha.charAt(b10 >> 18));
                    x.push(this.alpha.charAt((b10 >> 12) & 63));
                    x.push(this.alpha.charAt((b10 >> 6) & 63));
                    x.push(this.alpha.charAt(b10 & 63));
                }
                switch (s.length - imax) {
                    case 1:
                        b10 = this.getByte(s, i) << 16;
                        x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt((b10 >> 12) & 63) + this.padchar + this.padchar);
                        break;
                    case 2:
                        b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                        x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt((b10 >> 12) & 63) + this.alpha.charAt((b10 >> 6) & 63) + this.padchar);
                        break;
                }
                return x.join("");
            };
            return Base64;
        }());
        services.Base64 = Base64;
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
app.registerService("Base64", []);
var AttributeSnippets = (function () {
    function AttributeSnippets() {
    }
    AttributeSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmAttributeAddOnChange", monaco.languages.CompletionItemKind.Function, "5.0+ Sets a function to be called when the attribute value is changed.", "Xrm.Page.getAttribute(\"fieldname\").addOnChange(functionName)"));
        collection.push(new Snippet("XrmAttributeFireOnChange", monaco.languages.CompletionItemKind.Function, "5.0+ Causes the OnChange event to occur on the attribute so that any script associated to that event can execute.", "Xrm.Page.getAttribute(\"fieldname\").fireOnChange()"));
        collection.push(new Snippet("XrmAttributeGetName", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string representing the logical name of the attribute.", "Xrm.Page.getAttribute(\"fieldname\").getName()"));
        collection.push(new Snippet("XrmAttributeGetAttributeType", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string value that represents the type of attribute.", "Xrm.Page.getAttribute(\"fieldname\").getAttributeType()"));
        collection.push(new Snippet("XrmAttributeGetFormat", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string value that represents formatting options for the attribute.", "Xrm.Page.getAttribute(\"fieldname\").getFormat()"));
        collection.push(new Snippet("XrmAttributeGetInitialValue", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value that represents the value set for an OptionSet or Boolean attribute when the form opened.", "Xrm.Page.getAttribute(\"fieldname\").getInitialValue()"));
        collection.push(new Snippet("XrmAttributeGetIsDirty", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a Boolean value indicating if there are unsaved changes to the attribute value.", "Xrm.Page.getAttribute(\"fieldname\").getIsDirty()"));
        collection.push(new Snippet("XrmAttributeGetIsPartyList", monaco.languages.CompletionItemKind.Function, " 6.0+ Returns a Boolean value indicating whether the lookup represents a partylist lookup. Partylist lookups allow for multiple records to be set, such as the To: field for an email entity record.", "Xrm.Page.getAttribute(\"fieldname\").getIsPartyList()"));
        collection.push(new Snippet("XrmAttributeGetMax", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a number indicating the maximum allowed value for an attribute.", "Xrm.Page.getAttribute(\"fieldname\").getMax()"));
        collection.push(new Snippet("XrmAttributeGetMaxLength", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a number indicating the maximum length of a string or memo attribute.", "Xrm.Page.getAttribute(\"fieldname\").getMaxLength()"));
        collection.push(new Snippet("XrmAttributeGetMin", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a number indicating the minimum allowed value for an attribute.", "Xrm.Page.getAttribute(\"fieldname\").getMin()"));
        collection.push(new Snippet("XrmAttributeGetOption", monaco.languages.CompletionItemKind.Function, "5.0+ Returns an option object with the value matching the argument passed to the method.", "Xrm.Page.getAttribute(\"fieldname\").getOption(value)"));
        collection.push(new Snippet("XrmAttributeGetOptions", monaco.languages.CompletionItemKind.Function, "5.0+ Returns an array of option objects representing the valid options for an optionset attribute.", "Xrm.Page.getAttribute(\"fieldname\").getOptions()"));
        collection.push(new Snippet("XrmAttributeGetParent", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the Xrm.Page.data.entity object that is the parent to all attributes.", "Xrm.Page.getAttribute(\"fieldname\").getParent()"));
        collection.push(new Snippet("XrmAttributeGetPrecision", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the number of digits allowed to the right of the decimal point.", "Xrm.Page.getAttribute(\"fieldname\").getPrecision()"));
        collection.push(new Snippet("XrmAttributeGetRequiredLevel", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string value indicating whether a value for the attribute is required or recommended.", "Xrm.Page.getAttribute(\"fieldname\").getRequiredLevel()"));
        collection.push(new Snippet("XrmAttributeGetSelectedOption", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the option object that is selected in an optionset attribute.", "Xrm.Page.getAttribute(\"fieldname\").getSelectedOption()"));
        collection.push(new Snippet("XrmAttributeGetSubmitMode", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string indicating when data from the attribute will be submitted when the record is saved.", "Xrm.Page.getAttribute(\"fieldname\").getSubmitMode()"));
        collection.push(new Snippet("XrmAttributeGetText", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string value of the text for the currently selected option for an optionset attribute.", "Xrm.Page.getAttribute(\"fieldname\").getText()"));
        collection.push(new Snippet("XrmAttributeGetUserPrivilege", monaco.languages.CompletionItemKind.Function, "5.0+ Returns an object with three Boolean properties corresponding to privileges indicating if the user can create, read or update data values for an attribute.", "Xrm.Page.getAttribute(\"fieldname\").getUserPrivilege()"));
        collection.push(new Snippet("XrmAttributeGetValue", monaco.languages.CompletionItemKind.Function, "5.0+ Retrieves the data value for an attribute.", "Xrm.Page.getAttribute(\"fieldname\").getValue()"));
        collection.push(new Snippet("XrmAttributeRemoveOnChange", monaco.languages.CompletionItemKind.Function, "5.0+ Removes a function from the OnChange event hander for an attribute.", "Xrm.Page.getAttribute(\"fieldname\").removeOnChange(functionName)"));
        collection.push(new Snippet("XrmAttributeSetRequiredLevel", monaco.languages.CompletionItemKind.Function, "5.0+ Sets whether data is required or recommended for the attribute before the record can be saved.", "Xrm.Page.getAttribute(\"fieldname\").setRequiredLevel(\"none|required|recommended\")"));
        collection.push(new Snippet("XrmAttributeSetSubmitMode", monaco.languages.CompletionItemKind.Function, "5.0+ Sets whether data from the attribute will be submitted when the record is saved.", "Xrm.Page.getAttribute(\"fieldname\").setSubmitMode(\"always|never|dirty\")"));
        collection.push(new Snippet("XrmAttributeSetValue", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the data value for an attribute.", "Xrm.Page.getAttribute(\"fieldname\").setValue(\"value\")"));
        return collection;
    };
    return AttributeSnippets;
}());
var ContextSnippets = (function () {
    function ContextSnippets() {
    }
    ContextSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmContextClientGetClient", monaco.languages.CompletionItemKind.Function, "6.0+ Returns a value to indicate which client the script is executing in.", "Xrm.Page.context.client.getClient()"));
        collection.push(new Snippet("XrmContextClientGetClientState", monaco.languages.CompletionItemKind.Function, "6.0+ Returns a value to indicate the state of the client.", "Xrm.Page.context.client.getClientState()"));
        collection.push(new Snippet("XrmContextGetClientUrl", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the base URL that was used to access the application.", "Xrm.Page.context.getClientUrl()"));
        collection.push(new Snippet("XrmContextGetCurrentTheme", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string representing the current Microsoft Office Outlook theme chosen by the user.", "Xrm.Page.context.getCurrentTheme()"));
        collection.push(new Snippet("XrmContextClientGetFormFactor", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get information about the kind of device the user is using.", "Xrm.Page.context.client.getFormFactor()"));
        collection.push(new Snippet("XrmContextGetIsAutoSaveEnabled", monaco.languages.CompletionItemKind.Function, "7.0+ Returns whether Autosave is enabled for the organization.", "Xrm.Page.context.getIsAutoSaveEnabled()"));
        collection.push(new Snippet("XrmContextGetOrgLcid", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the LCID value that represents the language pack that is the base language for the organization.", "Xrm.Page.context.getOrgLcid()"));
        collection.push(new Snippet("XrmContextGetOrgUniqueName", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the unique text value of the organization’s name.", "Xrm.Page.context.getOrgUniqueName()"));
        collection.push(new Snippet("XrmContextGetQueryStringParameters", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a dictionary object of key value pairs that represent the query string arguments that were passed to the page.", "Xrm.Page.context.getQueryStringParameters()"));
        collection.push(new Snippet("XrmContextGetTimeZoneOffsetMinutes", monaco.languages.CompletionItemKind.Function, " 7.1+ Returns the difference between the local time and Coordinated Universal Time (UTC).", "Xrm.Page.context.getTimeZoneOffsetMinutes()"));
        collection.push(new Snippet("XrmContextGetUserId", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the GUID of the SystemUser.Id value for the current user.", "Xrm.Page.context.getUserId()"));
        collection.push(new Snippet("XrmContextGetUserLcid", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the LCID value that represents the language pack that is the user selected as their preferred language.", "Xrm.Page.context.getUserLcid()"));
        collection.push(new Snippet("XrmContextGetUserName", monaco.languages.CompletionItemKind.Function, "6.0+ Returns the name of the current user.", "Xrm.Page.context.getUserName()"));
        collection.push(new Snippet("XrmContextGetUserRoles", monaco.languages.CompletionItemKind.Function, "5.0+ Returns an array of strings that represent the GUID values of each of the security roles that the user is associated with and any teams that the user is associated with.", "Xrm.Page.context.getUserRoles()"));
        collection.push(new Snippet("XrmContextIsOutlookClient", monaco.languages.CompletionItemKind.Function, "5.0-6.1 Returns a Boolean value indicating if the user is using CRM for Outlook.", "Xrm.Page.context.isOutlookClient()"));
        collection.push(new Snippet("XrmContextIsOutlookOnline", monaco.languages.CompletionItemKind.Function, "5.0-6.1 Returns a Boolean value that indicates whether the user is connected to the server while using CRM for Outlook with Offline Access. When this function returns false, the user is working offline without a connection to the server.", "Xrm.Page.context.isOutlookOnline()"));
        collection.push(new Snippet("XrmContextPrependOrgName", monaco.languages.CompletionItemKind.Function, "5.0+ Prepends the organization name to the specified path.", "Xrm.Page.context.prependOrgName(\"path\")"));
        return collection;
    };
    return ContextSnippets;
}());
var ControlsSnippets = (function () {
    function ControlsSnippets() {
    }
    ControlsSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmControlsForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of controls.", "Xrm.Page.ui.controls.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmControls", monaco.languages.CompletionItemKind.Function, "5.0+ A collection of all the controls on the page.", "Xrm.Page.ui.controls.get()"));
        collection.push(new Snippet("XrmControlsGetLength", monaco.languages.CompletionItemKind.Function, "5.0+ Get the number of items in the collection of controls.", "Xrm.Page.ui.controls.getLength()"));
        collection.push(new Snippet("XrmControlsAddCustomFilter", monaco.languages.CompletionItemKind.Function, "6.0+ Use to add filters to the results displayed in the lookup. Each filter will be combined with any previously added filters as an 'AND' condition.", "var entityName = \"account\";\n" +
            "var filter = \"<filter type='and'><condition attribute='name' operator='eq' value='test' /></filter>\";\n" +
            "\n" +
            "Xrm.Page.getControl(\"fieldname\").addCustomFilter(filter, entityName);"));
        collection.push(new Snippet("XrmControlsAddCustomView", monaco.languages.CompletionItemKind.Function, "5.0+ Adds a new view for the lookup dialog box.", "var viewId = \"F0EE06F5-BB78-465F-BADA-FC3F5CF05300\";\n" +
            "var entityName = \"account\";\n" +
            "var viewDisplayName = \"Custom View\";\n" +
            "var fetchXml = \"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\" +\n" +
            "\t\"<entity name='account'>\" +\n" +
            "\t\"<attribute name='name' />\" +\n" +
            "\t\"<attribute name='accountid' />\" +\n" +
            "\t\"<filter type='and'>\" +" +
            "\t\"<condition attribute='name' operator='eq' value='test' />\" +\n" +
            "\t\"</filter>\" +\n" +
            "\t\"</entity>\" +\n" +
            "\t\"</fetch>\";\n" +
            "\n" +
            "var layoutXml = \"<grid name='resultset' object='1' jump='accountid' select='1' icon='1' preview='1'>\" +\n" +
            "\t\"<row name='result' id='accountid'>\" +\n" +
            "\t\"<cell name='name' width='150' />\" +\n" +
            "\t\"</row>\" +\n" +
            "\t\"</grid>\";\n" +
            "var isDefault = true;\n" +
            "\n" +
            "Xrm.Page.getControl(\"fieldname\").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, isDefault);"));
        collection.push(new Snippet("XrmControlsAddOnKeyPress", monaco.languages.CompletionItemKind.Function, "8.0+ Use this to add a function as an event handler for the keypress event so that the function is called when you type a character in the specific text or number field.", "Xrm.Page.getControl(\"controlname\").addOnKeyPress(functionName)"));
        collection.push(new Snippet("XrmControlsAddOption", monaco.languages.CompletionItemKind.Function, "5.0+ Adds an option to an option set control.", "Xrm.Page.getControl(\"fieldname\").addOption(option, index)"));
        collection.push(new Snippet("XrmControlsAddPreSearch", monaco.languages.CompletionItemKind.Function, "6.0+ Use this method to apply changes to lookups based on values current just as the user is about to view results for the lookup.", "Xrm.Page.getControl(\"fieldname\").addPreSearch(functionName)"));
        collection.push(new Snippet("XrmControlsClearNotification", monaco.languages.CompletionItemKind.Function, "6.0+ Remove a message already displayed for a control.", "Xrm.Page.getControl(\"controlname\").clearNotification(\"uniqueId\")"));
        collection.push(new Snippet("XrmControlsClearOptions", monaco.languages.CompletionItemKind.Function, "5.0+ Clears all options from an option set control.", "Xrm.Page.getControl(\"fieldname\").clearOptions()"));
        collection.push(new Snippet("XrmControlsFireOnKeyPress", monaco.languages.CompletionItemKind.Function, "8.0+ Use this to manually fire an event handler that you created for a specific text or number field to be executed on the keypress event.", "Xrm.Page.getControl(\"controlname\").fireOnKeyPress()"));
        collection.push(new Snippet("XrmControlsGetAttribute", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the attribute that the control is bound to.", "Xrm.Page.getControl(\"controlname\").getAttribute()"));
        collection.push(new Snippet("XrmControlsGetControlType", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value that categorizes controls.", "Xrm.Page.getControl(\"controlname\").getControlType()"));
        collection.push(new Snippet("XrmControlsGetData", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the value of the data query string parameter passed to a Silverlight web resource.", "Xrm.Page.getControl(\"controlname\").getData()"));
        collection.push(new Snippet("XrmControlsGetDefaultView", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the Id value of the default lookup dialog view.", "Xrm.Page.getControl(\"fieldname\").getDefaultView()"));
        collection.push(new Snippet("XrmControlsGetDisabled", monaco.languages.CompletionItemKind.Function, "5.0+ Returns whether the control is disabled.", "Xrm.Page.getControl(\"controlname\").getDisabled()"));
        collection.push(new Snippet("XrmControlsGetInitialUrl", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the default URL that an IFRAME control is configured to display. This method is not available for web resources.", "Xrm.Page.getControl(\"controlname\").getInitialUrl()"));
        collection.push(new Snippet("XrmControlsGetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the label for the control.", "Xrm.Page.getControl(\"controlname\").getLabel()"));
        collection.push(new Snippet("XrmControlsGetName", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the name assigned to the control.", "Xrm.Page.getControl(\"controlname\").getName()"));
        collection.push(new Snippet("XrmControlsGetObject", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the object in the form that represents an IFRAME or web resource.", "Xrm.Page.getControl(\"controlname\").getObject()"));
        collection.push(new Snippet("XrmControlsGetParent", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a reference to the section object that contains the control.", "Xrm.Page.getControl(\"controlname\").getParent()"));
        collection.push(new Snippet("XrmControlsGetShowTime", monaco.languages.CompletionItemKind.Function, "7.1+ Get whether a date control shows the time portion of the date.", "Xrm.Page.getControl(\"fieldname\").getShowTime()"));
        collection.push(new Snippet("XrmControlsGetSrc", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the current URL being displayed in an IFRAME or web resource.", "Xrm.Page.getControl(\"controlname\").getSrc()"));
        collection.push(new Snippet("XrmControlsGetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value that indicates whether the control is currently visible.", "Xrm.Page.getControl(\"controlname\").getVisible()"));
        collection.push(new Snippet("XrmControlsHideAutoComplete", monaco.languages.CompletionItemKind.Function, "8.0+ Use this function to hide the auto-completion drop-down list you configured for a specific text field.", "Xrm.Page.getControl(\"controlname\").hideAutoComplete()"));
        collection.push(new Snippet("XrmControlsRemoveOnKeyPress", monaco.languages.CompletionItemKind.Function, "8.0+ Use this to remove an event handler for a text or number field that you added using addOnKeyPress.", "Xrm.Page.getControl(\"controlname\").removeOnKeyPress(functionName)"));
        collection.push(new Snippet("XrmControlsRemoveOption", monaco.languages.CompletionItemKind.Function, "5.0+ Removes an option from an option set control.", "Xrm.Page.getControl(\"fieldname\").removeOption(number)"));
        collection.push(new Snippet("XrmControlsRemovePreSearch", monaco.languages.CompletionItemKind.Function, "6.0+ Use this method to remove event handler functions that have previously been set for the PreSearch event.", "Xrm.Page.getControl(\"fieldname\").removePreSearch(functionName)"));
        collection.push(new Snippet("XrmControlsSetData", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the value of the data query string parameter passed to a Silverlight web resource.", "Xrm.Page.getControl(\"controlname\").setData(value)"));
        collection.push(new Snippet("XrmControlsSetDefaultView", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the default view for the lookup control dialog.", "Xrm.Page.getControl(\"fieldname\").setDefaultView(\"viewId\")"));
        collection.push(new Snippet("XrmControlsSetDisabled", monaco.languages.CompletionItemKind.Function, "5.0+ Sets whether the control is disabled.", "Xrm.Page.getControl(\"controlname\").setDisabled(true|false)"));
        collection.push(new Snippet("XrmControlsSetFocus", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the focus on the control.", "Xrm.Page.getControl(\"controlname\").setFocus()"));
        collection.push(new Snippet("XrmControlsSetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the label for the control.", "Xrm.Page.getControl(\"fieldname\").setLabel(\"value\")"));
        collection.push(new Snippet("XrmControlsSetNotification", monaco.languages.CompletionItemKind.Function, "6.0+ Display a message near the control to indicate that data isn’t valid.", "Xrm.Page.getControl(\"controlname\").setNotification(\"message\", \"uniqueId\")"));
        collection.push(new Snippet("XrmControlsSetShowTime", monaco.languages.CompletionItemKind.Function, "6.0+ Specify whether a date control should show the time portion of the date.", "Xrm.Page.getControl(\"fieldname\").setShowTime(true|false)"));
        collection.push(new Snippet("XrmControlsSetSrc", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the URL to be displayed in an IFRAME or web resource.", "Xrm.Page.getControl(\"controlname\").setSrc(\"value\")"));
        collection.push(new Snippet("XrmControlsSetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Sets a value that indicates whether the control is visible.", "Xrm.Page.getControl(\"controlname\").setVisible(true|false)"));
        collection.push(new Snippet("XrmControlsShowAutoComplete", monaco.languages.CompletionItemKind.Function, "8.0+ Use this to show up to 10 matching strings in a drop-down list as users press keys to type character in a specific text field. You can also add a custom command with an icon at the bottom of the drop-down list.", "Xrm.Page.getControl(\"controlname\").showAutoComplete(object)"));
        collection.push(new Snippet("XrmControlsAddOnPostSearch", monaco.languages.CompletionItemKind.Function, "8.1+ Use this method to add an event handler to the PostSearch event.", "Xrm.Page.getControl(\"controlname\").addOnPostSearch(functionName)"));
        collection.push(new Snippet("XrmControlsAddOnResultOpened", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to add an event handler to the OnResultOpened event.", "Xrm.Page.getControl(\"controlname\").addOnResultOpened(functionName)"));
        collection.push(new Snippet("XrmControlsAddOnSelection", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to add an event handler to the OnSelection event.", "Xrm.Page.getControl(\"controlname\").addOnSelection(functionName)"));
        collection.push(new Snippet("XrmControlsGetSearchQuery", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get the text used as the search criteria for the knowledge base management control.", "Xrm.Page.getControl(\"controlname\").getSearchQuery()"));
        collection.push(new Snippet("XrmControlsGetSelectedResult", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get the currently selected result of the search control. The currently selected result also represents the result that is currently open.", "Xrm.Page.getControl(\"controlname\").getSelectedResult()"));
        collection.push(new Snippet("XrmControlsGetTotalResultCount", monaco.languages.CompletionItemKind.Function, "8.1+ Gets the count of results found in the search control.", "Xrm.Page.getControl(\"controlname\").getTotalResultCount()"));
        collection.push(new Snippet("XrmControlsOpenSearchResult", monaco.languages.CompletionItemKind.Function, "8.1+ Opens a search result in the search control by specifying the result number.", "Xrm.Page.getControl(\"controlname\").openSearchResult(index, \"Inline|Popout\")"));
        collection.push(new Snippet("XrmControlsRemoveOnPostSearch", monaco.languages.CompletionItemKind.Function, "8.1+ Use this method to remove an event handler from the PostSearch event.", "Xrm.Page.getControl(\"controlname\").removeOnPostSearch(functionName)"));
        collection.push(new Snippet("XrmControlsRemoveOnResultOpened", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to remove an event handler from the OnResultOpened event.", "Xrm.Page.getControl(\"controlname\").removeOnResultOpened(functionName)"));
        collection.push(new Snippet("XrmControlsRemoveOnSelection", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to remove an event handler from the OnSelection event.", "Xrm.Page.getControl(\"controlname\").removeOnSelection(functionName)"));
        collection.push(new Snippet("XrmControlsSetSearchQuery", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to set the text used as the search criteria for the knowledge base management control.", "Xrm.Page.getControl(\"controlname\").setSearchQuery(\"value\")"));
        collection.push(new Snippet("XrmControlsAddOnLoad", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to add event handlers to the GridControlOnLoad event.", "Xrm.Page.getControl(\"controlname\").addOnLoad(functionName)"));
        collection.push(new Snippet("XrmControlsGetGrid", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get access to the Grid available in the GridControl.", "Xrm.Page.getControl(\"controlname\").getGrid()"));
        collection.push(new Snippet("XrmControlsGetControl", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the grid or knowledge base search control.", "Xrm.Page.getControl(\"controlname\")"));
        collection.push(new Snippet("XrmControlsGetViewSelectorGetCurrentView", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get a reference to the current view.", "Xrm.Page.getControl(\"controlname\").getViewSelector().getCurrentView()"));
        collection.push(new Snippet("XrmControlsGetEntityName", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get the logical name of the entity data displayed in the grid.", "Xrm.Page.getControl(\"controlname\").getEntityName()"));
        collection.push(new Snippet("XrmControlsGetViewSelector", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get access to the ViewSelector available for the GridControl.", "Xrm.Page.getControl(\"controlname\").getViewSelector()"));
        collection.push(new Snippet("XrmControlsGetViewSelectorIsVisible", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to determine whether the view selector is visible.", "Xrm.Page.getControl(\"controlname\").getViewSelector().isVisible()"));
        collection.push(new Snippet("XrmControlsRefresh", monaco.languages.CompletionItemKind.Function, "5.0+ Refreshes the data displayed in a subgrid.", "Xrm.Page.getControl(\"controlname\").refresh()"));
        collection.push(new Snippet("XrmControlsRemoveOnLoad", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to remove event handlers from the GridControlOnLoad event.", "Xrm.Page.getControl(\"controlname\").removeOnLoad(functionName)"));
        collection.push(new Snippet("XrmControlsGetViewSelectorSetCurrentView", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to set the current view.", "var contactSavedQuery = {\n" +
            "	entityType: 1039, // SavedQuery\n" +
            "	id: \"3A282DA1-5D90-E011-95AE-00155D9CFA02\",\n" +
            "	name: \"Contacts Saved Query\"\n" +
            "}\n" +
            "\n" +
            "Xrm.Page.getControl(\"controlname\").getViewSelector().setCurrentView(contactSavedQuery);"));
        collection.push(new Snippet("XrmControlsAddNotification", monaco.languages.CompletionItemKind.Function, "8.2+ Displays an error or recommendation notification for a control, and lets you specify actions to execute based on the notification.", "var actionCollection = {\n" +
            "   message: \"message\",\n" +
            "	actions: null\n" +
            "}\n" +
            "\n" +
            "actionCollection.actions = [function () {\n" +
            "\n" +
            "}];\n" +
            "\n" +
            "Xrm.Page.getControl(\"fieldname\").addNotification({\n" +
            "   messages: [\"message\"],\n" +
            "   notificationLevel: \"RECOMMENDATION|ERROR\",\n" +
            "   uniqueId: \"uniqueId\",\n" +
            "   actions: [actionCollection]\n" +
            "});"));
        return collection;
    };
    return ControlsSnippets;
}());
var EntitySnippets = (function () {
    function EntitySnippets() {
    }
    EntitySnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmEntityAttributesForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of attributes.", "Xrm.Page.data.entity.attributes.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmEntityAttributes", monaco.languages.CompletionItemKind.Function, "5.0+ A collection of all the attributes on the page.", "Xrm.Page.data.entity.attributes.get()"));
        collection.push(new Snippet("XrmEntityAttributesGetLength", monaco.languages.CompletionItemKind.Function, "5.0+ Get the number of items in the collection of attributes.", "Xrm.Page.data.entity.attributes.getLength()"));
        collection.push(new Snippet("XrmEntityAddOnSave", monaco.languages.CompletionItemKind.Function, "5.0+ Sets a function to be called when the record is saved.", "Xrm.Page.data.entity.addOnSave(functionName)"));
        collection.push(new Snippet("XrmEntityGetDataXml", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string representing the XML that will be sent to the server when the record is saved. Only data in fields that have changed are set to the server.", "Xrm.Page.data.entity.getDataXml()"));
        collection.push(new Snippet("XrmEntityGetEntityName", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string representing the logical name of the entity for the record.", "Xrm.Page.data.entity.getEntityName()"));
        collection.push(new Snippet("XrmEntityGetId", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a string representing the GUID id value for the record.", "Xrm.Page.data.entity.getId()"));
        collection.push(new Snippet("XrmEntityGetIsDirty", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a Boolean value that indicates if any fields in the form have been modified.", "Xrm.Page.data.entity.getIsDirty()"));
        collection.push(new Snippet("XrmEntityGetPrimaryAttributeValue", monaco.languages.CompletionItemKind.Function, "6.0+ Gets a string for the value of the primary attribute of the entity.", "Xrm.Page.data.entity.getPrimaryAttributeValue()"));
        collection.push(new Snippet("XrmEntityRemoveOnSave", monaco.languages.CompletionItemKind.Function, "5.0+ Removes a function to be called when the record is saved.", "Xrm.Page.data.entity.removeOnSave(functionName)"));
        collection.push(new Snippet("XrmEntitySave", monaco.languages.CompletionItemKind.Function, "5.0+ Saves the record synchronously with the options to close the form or open a new form after the save is completed.", "Xrm.Page.data.entity.save(null|\"saveandclose\"|\"saveandnew\")"));
        return collection;
    };
    return EntitySnippets;
}());
var ExecObjSnippets = (function () {
    function ExecObjSnippets() {
    }
    ExecObjSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmExecObjGetEventArgs()GetSaveMode", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value indicating how the save event was initiated by the user.", "execObj.getEventArgs().getSaveMode()"));
        collection.push(new Snippet("XrmExecObjGetEventArgs()IsDefaultPrevented", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value indicating whether the save event has been canceled because the preventDefault method was used in this event handler or a previous event handler.", "execObj.getEventArgs().isDefaultPrevented()"));
        collection.push(new Snippet("XrmExecObjGetEventArgs()PreventDefault", monaco.languages.CompletionItemKind.Function, "5.0+ Cancels the save operation, but all remaining handlers for the event will still be executed.", "execObj.getEventArgs().preventDefault()"));
        collection.push(new Snippet("XrmExecObjGetContext", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the Xrm.Page.context object.", "execObj.getContext()"));
        collection.push(new Snippet("XrmExecObjGetDepth", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value that indicates the order in which this handler is executed.", "execObj.getDepth()"));
        collection.push(new Snippet("XrmExecObjGetEventSource", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a reference to the object that the event occurred on.", "execObj.getEventSource()"));
        collection.push(new Snippet("XrmExecObjGetSharedVariable", monaco.languages.CompletionItemKind.Function, "5.0+ Retrieves a variable set using setSharedVariable.", "execObj.getSharedVariable(\"key\")"));
        collection.push(new Snippet("XrmExecObjSetSharedVariable", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the value of a variable to be used by a handler after the current handler completes.", "execObj.setSharedVariable(\"key\", value)"));
        collection.push(new Snippet("XrmExecObjGetFormContext", monaco.languages.CompletionItemKind.Function, "8.2+ Method that returns a reference to either the form (Xrm.Page) or editable grid depending on where the method was called.", "execObj.getFormContext()"));
        return collection;
    };
    return ExecObjSnippets;
}());
var FormSelectorSnippets = (function () {
    function FormSelectorSnippets() {
    }
    FormSelectorSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmFormSelectorItemsForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of forms.", "Xrm.Page.ui.formSelector.items.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmFormSelectorItems", monaco.languages.CompletionItemKind.Function, "5.0+ A collection of all the forms on the page.", "Xrm.Page.ui.formSelector.items.get()"));
        collection.push(new Snippet("XrmFormSelectorItemsGetLength", monaco.languages.CompletionItemKind.Function, "5.0+ Get the number of items in the collection of forms.", "Xrm.Page.ui.formSelector.items.getLength()"));
        collection.push(new Snippet("XrmFormSelectorItemsGetId", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the GUID ID of the form.", "Xrm.Page.ui.formSelector.items.get(\"formindex\").getId()"));
        collection.push(new Snippet("XrmFormSelectorItemsGetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the label of the form.", "Xrm.Page.ui.formSelector.items.get(\"formindex\").getLabel()"));
        collection.push(new Snippet("XrmFormSelectorItemsNavigate", monaco.languages.CompletionItemKind.Function, "5.0+ Opens the specified form.", "Xrm.Page.ui.formSelector.items.get(\"formindex\").navigate()"));
        return collection;
    };
    return FormSelectorSnippets;
}());
var GridSnippets = (function () {
    function GridSnippets() {
    }
    GridSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmGridGetRowsGetData", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the GridRowData for the GridRow.", "Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData()"));
        collection.push(new Snippet("XrmGridGetRowsGetEntity", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the GridEntity for the GridRowData.", "Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity()"));
        collection.push(new Snippet("XrmGridGetRowsGetEntityGetEntityGetId", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the id for the record in the row.", "Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getId()"));
        collection.push(new Snippet("XrmGridGetRowsGetEntityGetEntityName", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the logical name for the record in the row.", "Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getEntityName()"));
        collection.push(new Snippet("XrmGridGetRowsGetEntityGetPrimaryAttributeValue", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the primary attribute value for the record in the row.", "Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getPrimaryAttributeValue()"));
        collection.push(new Snippet("XrmGridGetRowsGetEntityGetEntityReference", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the entity reference for the record in the row.", "Xrm.Page.getControl(\"controlname\").getGrid().getRows().get(rowindex).getData().getEntity().getEntityReference()"));
        collection.push(new Snippet("XrmGridGetRows", monaco.languages.CompletionItemKind.Function, "7.1+ Returns a collection of every GridRow in the Grid.", "Xrm.Page.getControl(\"controlname\").getGrid().getRows()"));
        collection.push(new Snippet("XrmGridGetSelectedRows", monaco.languages.CompletionItemKind.Function, "7.1+ Returns a collection of every selected GridRow in the Grid.", "Xrm.Page.getControl(\"controlname\").getGrid().getSelectedRows()"));
        collection.push(new Snippet("XrmGridGetTotalRecordCount", monaco.languages.CompletionItemKind.Function, "7.1+ Returns the total number of records that match the filter criteria of the view, not limited by the number visible in a single page.", "Xrm.Page.getControl(\"controlname\").getGrid().getTotalRecordCount()"));
        return collection;
    };
    return GridSnippets;
}());
var MobileSnippets = (function () {
    function MobileSnippets() {
    }
    MobileSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmMobileIsOfflineEnabled", monaco.languages.CompletionItemKind.Function, "8.2+ Returns whether an entity is offline enabled.", "Xrm.Mobile.offline.isOfflineEnabled(\"entityName\")"));
        collection.push(new Snippet("XrmMobileCreateOfflineRecord", monaco.languages.CompletionItemKind.Function, "8.2+ Creates an entity record in Dynamics 365 mobile clients while working in the offline mode.", "var entity = {};\n" +
            "entity.name = \"test\";\n" +
            "\n" +
            "Xrm.Mobile.offline.createRecord(\"entityName\", entity).then([successFunction], [errorFunction]);"));
        collection.push(new Snippet("XrmMobileRetrieveOfflineRecord", monaco.languages.CompletionItemKind.Function, "8.2+ Retrieves an entity record in Dynamics 365 mobile clients while working in the offline mode.", "var options = \"?$select=name&$expand=primarycontactid($select=contactid,fullname)\";\n" +
            "\n" +
            "Xrm.Mobile.offline.retrieveRecord(\"entityName\", \"id\", options).then([successFunction], [errorFunction]);"));
        collection.push(new Snippet("XrmMobileRetrieveMultipleOfflineRecords", monaco.languages.CompletionItemKind.Function, "8.2+ Retrieves a collection of entity records in Dynamics 365 mobile clients while working in the offline mode.", "var options = \"?$select=name&$expand=primarycontactid($select=contactid,fullname)\";\n" +
            "var maxPageSize = 100;\n" +
            "\n" +
            "Xrm.Mobile.offline.retrieveMultipleRecords(\"entityName\", options, maxPageSize).then([successFunction], [errorFunction]);"));
        collection.push(new Snippet("XrmMobileUpdateOfflineRecord", monaco.languages.CompletionItemKind.Function, "8.2+ Updates an entity record in Dynamics 365 mobile clients while working in the offline mode.", "var entity = {};\n" +
            "entity.name = \"test\";\n" +
            "" +
            "Xrm.Mobile.offline.updateRecord(\"entityName\", \"id\", entity).then([successFunction], [errorFunction]);"));
        collection.push(new Snippet("XrmMobileDeleteOfflineRecord", monaco.languages.CompletionItemKind.Function, "8.2+ Deletes an entity record in Dynamics 365 mobile clients while working in the offline mode.", "Xrm.Mobile.offline.deleteRecord(\"entityName\", \"id\").then([successFunction], [errorFunction]);"));
        return collection;
    };
    return MobileSnippets;
}());
var NavigationSnippets = (function () {
    function NavigationSnippets() {
    }
    NavigationSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmNavigationItemsForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of navigation items.", "Xrm.Page.ui.navigation.items.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmNavigationItems", monaco.languages.CompletionItemKind.Function, "5.0+ A collection of all the navigation items on the page.", "Xrm.Page.ui.navigation.items.get()"));
        collection.push(new Snippet("XrmNavigationItemsGetLength", monaco.languages.CompletionItemKind.Function, "5.0+ Get the number of items in the collection of navigation items.", "Xrm.Page.ui.navigation.items.getLength()"));
        collection.push(new Snippet("XrmNavigationItemsGetId", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the name of the item.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getId()"));
        collection.push(new Snippet("XrmNavigationItemsGetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the label for the item.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getLabel()"));
        collection.push(new Snippet("XrmNavigationItemsGetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value that indicates whether the item is currently visible.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getVisible()"));
        collection.push(new Snippet("XrmNavigationItemsSetFocus", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the focus on the item.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setFocus()"));
        collection.push(new Snippet("XrmNavigationItemsSetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the label for the item.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setLabel(\"value\")"));
        collection.push(new Snippet("XrmNavigationItemsSetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Sets a value that indicates whether the item is visible.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setVisible(true|false)"));
        collection.push(new Snippet("XrmNavigationItemsGetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the label for the item.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getLabel()"));
        collection.push(new Snippet("XrmNavigationItemsGetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value that indicates whether the item is currently visible.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").getVisible()"));
        collection.push(new Snippet("XrmNavigationItemsSetFocus", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the focus on the item.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setFocus()"));
        collection.push(new Snippet("XrmNavigationItemsSetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the label for the item.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setLabel(\"value\")"));
        collection.push(new Snippet("XrmNavigationItemsSetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Sets a value that indicates whether the item is visible.", "Xrm.Page.ui.navigation.items.get(navigationindex|\"navigationname\").setVisible(true|false)"));
        return collection;
    };
    return NavigationSnippets;
}());
var PanelSnippets = (function () {
    function PanelSnippets() {
    }
    PanelSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmPanelLoadPanel", monaco.languages.CompletionItemKind.Function, "8.2+ Displays the web page represented by a URL in the static area in the side pane, which appears on all pages in the Dynamics 365 web client.", "Xrm.Panel.LoadPanel(\"url\", \"title\")"));
        return collection;
    };
    return PanelSnippets;
}());
var ProcessSnippets = (function () {
    function ProcessSnippets() {
    }
    ProcessSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmProcessAddOnStageChange", monaco.languages.CompletionItemKind.Function, "7.0+ Use these methods to add or remove event handlers for the business process flow control.", "Xrm.Page.data.process.addOnStageChange(functionName)"));
        collection.push(new Snippet("XrmProcessAddOnStageSelected", monaco.languages.CompletionItemKind.Function, "7.0+ Use this to add a function as an event handler for the OnStageSelected event so that it will be called when a business process flow stage is selected.", "Xrm.Page.data.process.addOnStageSelected(functionName)"));
        collection.push(new Snippet("XrmProcessGetActivePath", monaco.languages.CompletionItemKind.Function, "7.0+ Use this method to get a collection of stages currently in the active path with methods to interact with the stages displayed in the business process flow control.", "Xrm.Page.data.process.getActivePath()"));
        collection.push(new Snippet("XrmProcessGetActiveProcess", monaco.languages.CompletionItemKind.Function, "7.0+ Returns a Process object representing the active process.", "Xrm.Page.data.process.getActiveProcess()"));
        collection.push(new Snippet("XrmProcessGetActiveStage", monaco.languages.CompletionItemKind.Function, "7.0+ Use getActiveStage to retrieve information about the active stage and setActiveStage to set a different stage as the active stage.", "Xrm.Page.data.process.getActiveStage()"));
        collection.push(new Snippet("XrmProcessGetDisplayState", monaco.languages.CompletionItemKind.Function, "7.1+ Retrieve the display state for the business process control.", "Xrm.Page.ui.process.getDisplayState()"));
        collection.push(new Snippet("XrmProcessGetEnabledProcesses", monaco.languages.CompletionItemKind.Function, "7.0+ Use this method to asynchronously retrieve the enabled business process flows that the user can switch to for an entity.", "Xrm.Page.data.process.getEnabledProcesses(callbackfunctionName(enabledProcesses))"));
        collection.push(new Snippet("XrmProcessGetSelectedStage", monaco.languages.CompletionItemKind.Function, "7.1+ Use this method to get the currently selected stage.", "Xrm.Page.data.process.getSelectedStage()"));
        collection.push(new Snippet("XrmProcessGetVisible", monaco.languages.CompletionItemKind.Function, "7.1+ Retrieve whether the business process control is visible.", "Xrm.Page.ui.process.getVisible()"));
        collection.push(new Snippet("XrmProcessMoveNext", monaco.languages.CompletionItemKind.Function, "7.0+ Progresses to the next stage.", "Xrm.Page.data.process.moveNext(callbackfunctionName)"));
        collection.push(new Snippet("XrmProcessMovePrevious", monaco.languages.CompletionItemKind.Function, "7.0+ Moves to the previous stage. Use movePrevious to a previous stage in a different entity.", "Xrm.Page.data.process.movePrevious(callbackfunctionName)"));
        collection.push(new Snippet("XrmProcessRemoveOnStageChange", monaco.languages.CompletionItemKind.Function, "7.0+ Use this to remove a function as an event handler for the OnStageChange event.", "Xrm.Page.data.process.removeOnStageChange(functionName)"));
        collection.push(new Snippet("XrmProcessRemoveOnStageSelected", monaco.languages.CompletionItemKind.Function, "7.0+ Use this to remove a function as an event handler for the OnStageSelected event.", "Xrm.Page.data.process.removeOnStageSelected(functionName)"));
        collection.push(new Snippet("XrmProcessSetActiveProcess", monaco.languages.CompletionItemKind.Function, "7.0+ Set a Process as the active process.", "Xrm.Page.data.process.setActiveProcess(\"processId\", callbackfunctionName)"));
        collection.push(new Snippet("XrmProcessSetActiveStage", monaco.languages.CompletionItemKind.Function, "7.0+ Set a completed stage as the active stage.", "Xrm.Page.data.process.setActiveStage(\"stageId\", callbackfunctionName)"));
        collection.push(new Snippet("XrmProcessSetDisplayState", monaco.languages.CompletionItemKind.Function, "7.0+ Use this method to expand or collapse the business process flow control.", "Xrm.Page.ui.process.setDisplayState(\"expanded|collapsed\")"));
        collection.push(new Snippet("70+ XrmProcessSetVisible", monaco.languages.CompletionItemKind.Function, "Use this method to show or hide the business process flow control.", "Xrm.Page.ui.process.setVisible(true|false)"));
        collection.push(new Snippet("XrmProcessGetId", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the unique identifier of the process.", "Xrm.Page.data.process.getActiveProcess().getId()"));
        collection.push(new Snippet("XrmProcessGetId", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the unique identifier of the process.", "Xrm.Page.data.process.getActiveProcess().getId()"));
        collection.push(new Snippet("XrmProcessGetName", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the name of the process.", "Xrm.Page.data.process.getActiveProcess().getName()"));
        collection.push(new Snippet("XrmProcessGetStages", monaco.languages.CompletionItemKind.Function, "7.0+ Returns an collection of stages in the process.", "Xrm.Page.data.process.getActiveProcess().getStages()"));
        collection.push(new Snippet("XrmProcessIsRendered", monaco.languages.CompletionItemKind.Function, "7.0+ Returns true if the process is rendered, false if not.", "Xrm.Page.data.process.getActiveProcess().isRendered()"));
        collection.push(new Snippet("XrmProcessGetStagesGetCategoryGetValue", monaco.languages.CompletionItemKind.Function, "7.0+ Returns an object with a getValue method which will return the integer value of the business process flow category.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getCategory().getValue()"));
        collection.push(new Snippet("XrmProcessGetStagesGetCategoryGetValueGetEntityName", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the logical name of the entity associated with the stage.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getEntityName()"));
        collection.push(new Snippet("XrmProcessGetStagesGetId", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the unique identifier of the stage.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getId()"));
        collection.push(new Snippet("XrmProcessGetStagesGetName", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the name of the stage.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getName()"));
        collection.push(new Snippet("XrmProcessGetStagesGetStatus", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the status of the stage.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getStatus()"));
        collection.push(new Snippet("XrmProcessGetStagesGetSteps", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the status of the stage.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps()"));
        collection.push(new Snippet("XrmProcessGetStagesGetStepsGetAttribute", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the logical name of the attribute associated to the step.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps().get(stepindex).getAttribute()"));
        collection.push(new Snippet("XrmProcessGetStagesGetStepsGetAttributeGetName", monaco.languages.CompletionItemKind.Function, "7.0+ Returns the name of the step.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps().get(stepindex).getName()"));
        collection.push(new Snippet("XrmProcessGetStagesGetStepsGetAttributeIsRequired", monaco.languages.CompletionItemKind.Function, "7.0+ Returns whether the step is required in the business process flow.", "Xrm.Page.data.process.getActiveProcess().getStages().get(stageindex).getSteps().get(stepindex).isRequired()"));
        collection.push(new Snippet("XrmProcessGetProcessInstances", monaco.languages.CompletionItemKind.Function, "8.2+ Returns all the process instances for the entity record that the calling user has access to.", "Xrm.Page.data.process.getProcessInstances(callbackfunctionName(object))"));
        collection.push(new Snippet("XrmProcessSetActiveProcessInstance", monaco.languages.CompletionItemKind.Function, "8.2+ Sets a process instance as the active instance.", "Xrm.Page.data.process.setActiveProcessInstance(\"processInstanceId\", callbackfunctionName)"));
        collection.push(new Snippet("XrmProcessAddOnProcessStatusChange", monaco.languages.CompletionItemKind.Function, "8.2+ Use this to add a function as an event handler for the OnProcessStatusChange event event so that it will be called when the business process flow status changes.", "Xrm.Page.data.process.addOnProcessStatusChange(functionName)"));
        collection.push(new Snippet("XrmProcessRemoveOnProcessStatusChange", monaco.languages.CompletionItemKind.Function, "8.2+ Use this to remove a function as an event handler for the OnProcessStatusChange event event.", "Xrm.Page.data.process.removeOnProcessStatusChange(functionName)"));
        collection.push(new Snippet("XrmProcessGetInstanceId", monaco.languages.CompletionItemKind.Function, "8.2+ Returns the unique identifier of the process instance.", "Xrm.Page.data.process.getInstanceId()"));
        collection.push(new Snippet("XrmProcessGetInstanceName", monaco.languages.CompletionItemKind.Function, "8.2+ Returns the name of the process instance.", "Xrm.Page.data.process.getInstanceName()"));
        collection.push(new Snippet("XrmProcessGetStatus", monaco.languages.CompletionItemKind.Function, "8.2+ Returns the current status of the process instance.", "Xrm.Page.data.process.getStatus()"));
        collection.push(new Snippet("XrmProcessSetStatus", monaco.languages.CompletionItemKind.Function, "8.2+ Sets the current status of the active process instance.", "Xrm.Page.data.process.setStatus(\"status\", callbackFunction)"));
        return collection;
    };
    return ProcessSnippets;
}());
var Snippets = (function () {
    function Snippets() {
    }
    Snippets.prototype.getSnippets = function () {
        var collection = [];
        var attrbiuteSnippets = new AttributeSnippets();
        var a1 = attrbiuteSnippets.getSnippets();
        for (var _i = 0, a1_1 = a1; _i < a1_1.length; _i++) {
            var item = a1_1[_i];
            collection.push(item);
        }
        var contextSnippets = new ContextSnippets();
        var a2 = contextSnippets.getSnippets();
        for (var _a = 0, a2_1 = a2; _a < a2_1.length; _a++) {
            var item = a2_1[_a];
            collection.push(item);
        }
        var controlsSnippets = new ControlsSnippets();
        var a3 = controlsSnippets.getSnippets();
        for (var _b = 0, a3_1 = a3; _b < a3_1.length; _b++) {
            var item = a3_1[_b];
            collection.push(item);
        }
        var entitySnippets = new EntitySnippets();
        var a4 = entitySnippets.getSnippets();
        for (var _c = 0, a4_1 = a4; _c < a4_1.length; _c++) {
            var item = a4_1[_c];
            collection.push(item);
        }
        var execObjSnippets = new ExecObjSnippets();
        var a5 = execObjSnippets.getSnippets();
        for (var _d = 0, a5_1 = a5; _d < a5_1.length; _d++) {
            var item = a5_1[_d];
            collection.push(item);
        }
        var formSelectorSnippets = new FormSelectorSnippets();
        var a6 = formSelectorSnippets.getSnippets();
        for (var _e = 0, a6_1 = a6; _e < a6_1.length; _e++) {
            var item = a6_1[_e];
            collection.push(item);
        }
        var gridSnippets = new GridSnippets();
        var a7 = gridSnippets.getSnippets();
        for (var _f = 0, a7_1 = a7; _f < a7_1.length; _f++) {
            var item = a7_1[_f];
            collection.push(item);
        }
        var navigationSnippets = new NavigationSnippets();
        var a8 = navigationSnippets.getSnippets();
        for (var _g = 0, a8_1 = a8; _g < a8_1.length; _g++) {
            var item = a8_1[_g];
            collection.push(item);
        }
        var processSnippets = new ProcessSnippets();
        var a9 = processSnippets.getSnippets();
        for (var _h = 0, a9_1 = a9; _h < a9_1.length; _h++) {
            var item = a9_1[_h];
            collection.push(item);
        }
        var tabsSnippets = new TabsSnippets();
        var a10 = tabsSnippets.getSnippets();
        for (var _j = 0, a10_1 = a10; _j < a10_1.length; _j++) {
            var item = a10_1[_j];
            collection.push(item);
        }
        var uiSnippets = new UiSnippets();
        var a11 = uiSnippets.getSnippets();
        for (var _k = 0, a11_1 = a11; _k < a11_1.length; _k++) {
            var item = a11_1[_k];
            collection.push(item);
        }
        var utilitySnippets = new UtilitySnippets();
        var a12 = utilitySnippets.getSnippets();
        for (var _l = 0, a12_1 = a12; _l < a12_1.length; _l++) {
            var item = a12_1[_l];
            collection.push(item);
        }
        var mobileSnippets = new MobileSnippets();
        var a13 = mobileSnippets.getSnippets();
        for (var _m = 0, a13_1 = a13; _m < a13_1.length; _m++) {
            var item = a13_1[_m];
            collection.push(item);
        }
        var panelSnippets = new PanelSnippets();
        var a14 = panelSnippets.getSnippets();
        for (var _o = 0, a14_1 = a14; _o < a14_1.length; _o++) {
            var item = a14_1[_o];
            collection.push(item);
        }
        return collection;
    };
    return Snippets;
}());
var Snippet = (function () {
    function Snippet(labelIn, kindIn, documentationIn, insertTextIn) {
        this.label = labelIn;
        this.kind = kindIn;
        this.documentation = documentationIn;
        this.insertText = insertTextIn;
    }
    return Snippet;
}());
var TabsSnippets = (function () {
    function TabsSnippets() {
    }
    TabsSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmTabsSectionsForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of sections.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmTabsSectionsForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of sections.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmTabsSectionsControlsForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of controls in a section.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).controls.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmTabsForEach", monaco.languages.CompletionItemKind.Function, "5.0+ Apply an action in a delegate function to each object in the collection of tabs.", "Xrm.Page.ui.tabs.forEach(function (control, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmTabsSectionsControls", monaco.languages.CompletionItemKind.Function, "5.0+ A collection of all the controls in the section.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).controls.get()"));
        collection.push(new Snippet("XrmTabsSections", monaco.languages.CompletionItemKind.Function, "5.0+ A collection of all the sections in a tab.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get()"));
        collection.push(new Snippet("XrmTabsSectionsGetLength", monaco.languages.CompletionItemKind.Function, "5.0+ Get the number of items in the collection of sections.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.getLength()"));
        collection.push(new Snippet("XrmTabs", monaco.languages.CompletionItemKind.Function, "5.0+ A collection of all the tabs on the page.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex)"));
        collection.push(new Snippet("XrmTabsGetLength", monaco.languages.CompletionItemKind.Function, "5.0+ Get the number of items in the collection of tabs.", "Xrm.Page.ui.tabs.getLength()"));
        collection.push(new Snippet("XrmTabsSectionsGetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the label for the section.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getLabel()"));
        collection.push(new Snippet("XrmTabsSectionsGetName", monaco.languages.CompletionItemKind.Function, "5.0+ Method to return the name of the section.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getName()"));
        collection.push(new Snippet("XrmTabsSectionsGetParent", monaco.languages.CompletionItemKind.Function, "5.0+ Method to return the tab containing the section.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getParent()"));
        collection.push(new Snippet("XrmTabsSectionsGetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Returns true if the section is visible, otherwise returns false.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).getVisible()"));
        collection.push(new Snippet("XrmTabsSectionsSetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the label for the section.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).setLabel(\"value\")"));
        collection.push(new Snippet("XrmTabsSectionsSetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Sets a value to show or hide the section.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).sections.get(null|\"sectionname\"|sectionindex).setVisible(true|false)"));
        collection.push(new Snippet("XrmTabsGetDisplayState", monaco.languages.CompletionItemKind.Function, "5.0+ Returns a value that indicates whether the tab is collapsed or expanded.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).getDisplayState()"));
        collection.push(new Snippet("XrmTabsGetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the tab label.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).getLabel()"));
        collection.push(new Snippet("XrmTabsGetParent", monaco.languages.CompletionItemKind.Function, "5.0+ Returns the Xrm.Page.ui (client-side reference) object.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).getParent()"));
        collection.push(new Snippet("XrmTabsSetDisplayState", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the tab to be collapsed or expanded.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setDisplayState(\"expanded|collapsed\")"));
        collection.push(new Snippet("XrmTabsSetFocus", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the focus on the tab.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setFocus()"));
        collection.push(new Snippet("XrmTabsSetLabel", monaco.languages.CompletionItemKind.Function, "5.0+ Sets the label for the tab.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setLabel(\"value\")"));
        collection.push(new Snippet("XrmTabsSetVisible", monaco.languages.CompletionItemKind.Function, "5.0+ Sets a value that indicates whether the control is visible.", "Xrm.Page.ui.tabs.get(null|\"tabname\"|tabindex).setVisible(true|false)"));
        return collection;
    };
    return TabsSnippets;
}());
var UiSnippets = (function () {
    function UiSnippets() {
    }
    UiSnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmUiClearFormNotification", monaco.languages.CompletionItemKind.Function, "6.0+ Use this method to remove form level notifications.", "Xrm.Page.ui.clearFormNotification(\"uniqueId\")"));
        collection.push(new Snippet("XrmUiGetCurrentControl", monaco.languages.CompletionItemKind.Function, "5.0+ Method to get the control object that currently has focus on the form. Web Resource and IFRAME controls are not returned by this method.", "Xrm.Page.ui.getCurrentControl()"));
        collection.push(new Snippet("XrmUiClose", monaco.languages.CompletionItemKind.Function, "5.0+ Method to close the form.", "Xrm.Page.ui.close()"));
        collection.push(new Snippet("XrmUiGetFormType", monaco.languages.CompletionItemKind.Function, "5.0+ Method to get the form context for the record.", "Xrm.Page.ui.getFormType()"));
        collection.push(new Snippet("XrmUiGetViewPortWidth", monaco.languages.CompletionItemKind.Function, "5.0+ Method to get the width of the viewport in pixels.", "Xrm.Page.ui.getViewPortWidth()"));
        collection.push(new Snippet("XrmUiGetViewPortHeight", monaco.languages.CompletionItemKind.Function, "5.0+ Method to get the height of the viewport in pixels.", "Xrm.Page.ui.getViewPortHeight()"));
        collection.push(new Snippet("XrmUiRefreshRibbon", monaco.languages.CompletionItemKind.Function, "5.0+ Method to cause the ribbon to re-evaluate data that controls what is displayed in it.", "Xrm.Page.ui.refreshRibbon()"));
        collection.push(new Snippet("XrmUiSetFormNotification", monaco.languages.CompletionItemKind.Function, "6.0+ Use this method to display form level notifications.", "Xrm.Page.ui.setFormNotification(\"message\", \"ERROR|WARNING|INFO\", \"uniqueId\")"));
        collection.push(new Snippet("XrmUiQuickFormControls", monaco.languages.CompletionItemKind.Function, "8.1+ A collection of all quick view controls on a form.", "Xrm.Page.ui.quickForms"));
        collection.push(new Snippet("XrmUiQuickFormControlsForEach", monaco.languages.CompletionItemKind.Function, "8.1+ Apply an action in a delegate function to each object in the collection of quick view controls on a form.", "Xrm.Page.ui.quickForms.forEach(function (qvcontrol, index) {\n" +
            "\n" +
            "})"));
        collection.push(new Snippet("XrmUiQuickFormGetControl", monaco.languages.CompletionItemKind.Function, "8.1+ Gets the constituent controls in a quick view control.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getControl(\"controlname\")"));
        collection.push(new Snippet("XrmUiQuickFormGetControlType", monaco.languages.CompletionItemKind.Function, "8.1+ Returns a string value that categorizes quick view controls.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getControlType()"));
        collection.push(new Snippet("XrmUiQuickFormGetName", monaco.languages.CompletionItemKind.Function, "8.1+ Returns the name assigned to the quick view control.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getName()"));
        collection.push(new Snippet("XrmUiQuickFormGetParent", monaco.languages.CompletionItemKind.Function, "8.1+ Returns a reference to the section object that contains the control.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getParent()"));
        collection.push(new Snippet("XrmUiQuickFormGetVisible", monaco.languages.CompletionItemKind.Function, "8.1+ Returns a value that indicates whether the quick view control is currently visible.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getVisible()"));
        collection.push(new Snippet("XrmUiQuickFormGetLabel", monaco.languages.CompletionItemKind.Function, "8.1+ Returns the label for the quick view control.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").getLabel()"));
        collection.push(new Snippet("XrmUiQuickFormSetLabel", monaco.languages.CompletionItemKind.Function, "8.1+ Sets the label for the quick view control.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").setLabel(\"value\")"));
        collection.push(new Snippet("XrmUiQuickFormIsLoaded", monaco.languages.CompletionItemKind.Function, "8.1+ Returns whether the data binding for the constituent controls in a quick view control is complete.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").isLoaded()"));
        collection.push(new Snippet("XrmUiQuickFormRefresh", monaco.languages.CompletionItemKind.Function, "8.1+ Refreshes the data displayed in a quick view control.", "Xrm.Page.ui.quickForms.get(\"qvcontrolname\").refresh()"));
        return collection;
    };
    return UiSnippets;
}());
var UtilitySnippets = (function () {
    function UtilitySnippets() {
    }
    UtilitySnippets.prototype.getSnippets = function () {
        var collection = [];
        collection.push(new Snippet("XrmUtilityAlertDialog", monaco.languages.CompletionItemKind.Function, "6.0+ Displays a dialog box containing an application-defined message.", "Xrm.Utility.alertDialog(\"message\", functionName)"));
        collection.push(new Snippet("XrmUtilityConfirmDialog", monaco.languages.CompletionItemKind.Function, "6.0+ Displays a confirmation dialog box that contains an optional message as well as OK and Cancel buttons.", "Xrm.Utility.confirmDialog(\"message\", yesfunctionName, nofunctionName)"));
        collection.push(new Snippet("XrmUtilityIsActivityType", monaco.languages.CompletionItemKind.Function, "6.0+ Determine if an entity is an activity entity.", "Xrm.Utility.isActivityType(\"entityName\")"));
        collection.push(new Snippet("XrmUtilityOpenEntityForm", monaco.languages.CompletionItemKind.Function, "5.0+ Opens an entity form.", "var name = \"account\";\n" +
            "var id = \"5D24B2A7-957A-4D08-8723-2CEF5219FFA0\";\n" +
            "var parameters = {};\n" +
            "parameters[\"formid\"] = \"b053a39a-041a-4356-acef-ddf00182762b\";\n" +
            "parameters[\"name\"] = \"Test\";\n" +
            "var windowOptions = {\n" +
            "	openInNewWindow: true\n" +
            "};\n" +
            "\n" +
            "Xrm.Utility.openEntityForm(name, id, parameters, windowOptions);"));
        collection.push(new Snippet("XrmUtilityOpenQuickCreate", monaco.languages.CompletionItemKind.Function, "7.1+ Opens a new quick create form.", "var entityName = \"account\";\n" +
            "var createFromEntity = { entityType: \"account\", id: Xrm.Page.data.entity.getId() };\n" +
            "var parameters = {};\n" +
            "parameters[\"name\"] = \"Test\";\n" +
            "\n" +
            "Xrm.Utility.openQuickCreate(entityName, createFromEntity, parameters).then(successFunction, errorFunction);"));
        collection.push(new Snippet("XrmUtilityOpenWebResource", monaco.languages.CompletionItemKind.Function, "5.0+ Opens an HTML web resource.", "var webResourceName = \"new_webResource.htm\";\n" +
            "var webResourceData = encodeURIComponent(\"first=First Value&second=Second Value\");\n" +
            "var parameters = {};\n" +
            "var width = 300;\n" +
            "var height = 300;\n" +
            "\n" +
            "Xrm.Utility.openWebResource(webResourceName, webResourceData, width, height);"));
        collection.push(new Snippet("XrmUtilityGetBarcodeValue", monaco.languages.CompletionItemKind.Function, "8.2+ Returns the barcode information, such as a product number, scanned using the device camera.", "Xrm.Utility.getBarcodeValue().then([successFunction], [errorFunction])"));
        collection.push(new Snippet("XrmUtilityGetCurrentPosition", monaco.languages.CompletionItemKind.Function, "8.2+ Returns the current location using the device geolocation capability.", "Xrm.Utility.getCurrentPosition().then([successFunction], [errorFunction])"));
        return collection;
    };
    return UtilitySnippets;
}());
