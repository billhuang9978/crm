/// <reference path="../app.ts" />

"use strict";

module app.services {
    declare function escape(s: string): string;
    export class CrmService implements IService {

        private checkForSoapError = (response) => {
            let x2Js = new X2JS();
            let jsonObj = x2Js.xml_str2json(response);

            if (!jsonObj["Envelope"])
                return null;

            if (jsonObj["Envelope"]["Body"]["Fault"]) {
                return jsonObj["Envelope"]["Body"]["Fault"]["faultcode"]["__text"] + "\n\n" +
                    jsonObj["Envelope"]["Body"]["Fault"]["faultstring"]["__text"];
            }

            return null;
        }

        private checkForRestError = (req) => {
            try {
                let response = JSON.parse(req.response);
                return req.statusText + "\n\n" + response["error"]["message"]["value"]
            } catch (e) {
                return req.response;
            }
        }

        public parseGetDataResponse = (result: string) => {
            let data = [];
            let x2Js = new X2JS();
            let jsonObj = x2Js.xml_str2json(result);

            let webResourceId: string, displayNameValue: string, nameValue: string,
                webResourceType: number, isManaged: boolean;

            let entities = jsonObj["Envelope"]["Body"]["RetrieveMultipleResponse"]["RetrieveMultipleResult"]["Entities"]["Entity"];
            angular.forEach(entities,
                (value) => {
                    let attributes = value["Attributes"]["KeyValuePairOfstringanyType"];
                    angular.forEach(attributes,
                        (value2) => {
                            let k = value2["key"]["__text"];
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
        }

        private parseGetDataResponseForPagingCookie = (result: string) => {
            let pagingCookie: string = null;

            let x2Js = new X2JS();
            let jsonObj = x2Js.xml_str2json(result);
            let moreRecords = jsonObj["Envelope"]["Body"]["RetrieveMultipleResponse"]["RetrieveMultipleResult"]["MoreRecords"]["__text"] as boolean;
            if (moreRecords)
                pagingCookie = jsonObj["Envelope"]["Body"]["RetrieveMultipleResponse"]["RetrieveMultipleResult"]["PagingCookie"]["__text"];

            if (pagingCookie != null)
                pagingCookie = this.escapeXml(pagingCookie);

            return pagingCookie;
        }

        private escapeXml = (unsafe) => {
            return unsafe.replace(/[<>&'"]/g, c => {
                switch (c) {
                    case "<": return "&lt;";
                    case ">": return "&gt;";
                    case "&": return "&amp;";
                    case "'": return "&apos;";
                    case '"': return "&quot;";
                }
            });
        }

        public getVersion = () => {
            return new Promise((resolve, reject) => {
                let request = [];
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

                let req = new XMLHttpRequest();
                req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            let x2Js = new X2JS();
                            let jsonObj = x2Js.xml_str2json(req.responseText);
                            let version = jsonObj["Envelope"]["Body"]["ExecuteResponse"]["ExecuteResult"]["Results"][
                                "KeyValuePairOfstringanyType"]["value"]["__text"];
                            resolve(version.split("."));
                        } else {
                            let error = this.checkForSoapError(req.responseText);
                            if (error !== null)
                                reject(error);

                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(request.join(""));
            });
        }

        public saveItem = (id: string, displayName: string, content: string, description: string) => {
            return new Promise((resolve, reject) => {
                let entity = {
                    Content: content,
                    DisplayName: displayName,
                    Description: description
                };

                let req = new XMLHttpRequest();
                req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet(guid'" + id + "')", true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("X-HTTP-Method", "MERGE");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 204 || req.status === 1223) {
                            resolve("Complete");
                        } else {
                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(JSON.stringify(entity));
            });
        }

        public createItem = (displayName: string, name: string, webResourceType: number, content: string, description: string) => {
            return new Promise((resolve, reject) => {
                let entity = {};
                entity["DisplayName"] = displayName;
                entity["Name"] = name;
                entity["WebResourceType"] = {
                    Value: webResourceType
                };
                entity["Content"] = content;
                entity["Description"] = description;

                let req = new XMLHttpRequest();
                req.open("POST", encodeURI(Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet"), true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 201) {
                            let result = JSON.parse(req.responseText).d;
                            let newEntityId: string = result.WebResourceId;
                            resolve(newEntityId);
                        } else {
                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(JSON.stringify(entity));
            });
        }

        public publishItem = (id: string) => {
            return new Promise((resolve, reject) => {
                let request = [];
                request.push("<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>");
                request.push("  <s:Body>");
                request.push("    <Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>");
                request.push("      <request i:type='b:PublishXmlRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>");
                request.push("        <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>");
                request.push("          <a:KeyValuePairOfstringanyType>");
                request.push("            <c:key>ParameterXml</c:key>");
                request.push("            <c:value i:type='d:string' xmlns:d='http://www.w3.org/2001/XMLSchema'>&lt;importexportxml&gt;&lt;webresources&gt;&lt;webresource&gt;{" + id + "}&lt;/webresource&gt;&lt;/webresources&gt;&lt;/importexportxml&gt;</c:value>");
                request.push("          </a:KeyValuePairOfstringanyType>");
                request.push("        </a:Parameters>");
                request.push("        <a:RequestId i:nil='true' />");
                request.push("        <a:RequestName>PublishXml</a:RequestName>");
                request.push("      </request>");
                request.push("    </Execute>");
                request.push("  </s:Body>");
                request.push("</s:Envelope>");

                let req = new XMLHttpRequest();
                req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            resolve("Complete");
                        } else {
                            let error = this.checkForSoapError(req.responseText);
                            if (error !== null)
                                reject(error);

                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(request.join(""));
            });
        }

        public getItems = (retrieveCount: number, pagingCookie: string, pageNumber: number) => {
            return new Promise((resolve, reject) => {
                let request = [];
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

                let serverUrl = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
                let req = new XMLHttpRequest();
                req.open("POST", serverUrl, false);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/RetrieveMultiple");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        if (req.status === 200) {
                            resolve(req.responseText);
                        } else {
                            let error = this.checkForSoapError(req.responseText);
                            if (error !== null)
                                reject(error);

                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(request.join(""));
            });
        }

        public retrieveUsers = (id1: string, id2: string) => {
            return new Promise((resolve, reject) => {
                let req = new XMLHttpRequest();
                req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/SystemUserSet?$select=FullName,SystemUserId&$filter=SystemUserId " +
                    "eq (guid'" + id1 + "') or SystemUserId eq (guid'" + id2 + "')", true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            let result = JSON.parse(req.responseText).d;
                            resolve(result);
                        } else {
                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send();
            });
        }

        public retrieveUnpublishedItem = (id: string) => {
            return new Promise((resolve, reject) => {
                let request = [];
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

                let req = new XMLHttpRequest();
                req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            let x2Js = new X2JS();
                            let jsonObj = x2Js.xml_str2json(req.responseText);
                            resolve(jsonObj);
                        } else {
                            let error = this.checkForSoapError(req.responseText);
                            if (error !== null)
                                reject(error);

                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(request.join(""));
            });
        };

        public retrieveUnpublishedItemModified = (id: string) => {
            return new Promise((resolve, reject) => {
                let request = [];
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
                request.push("                <d:string>modifiedon</d:string>");;
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

                let req = new XMLHttpRequest();
                req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            let x2Js = new X2JS();
                            let jsonObj = x2Js.xml_str2json(req.responseText);
                            resolve(jsonObj);
                        } else {
                            let error = this.checkForSoapError(req.responseText);
                            if (error !== null)
                                reject(error);

                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(request.join(""));
            });
        };

        public retrievePublishedItem = (id: string) => {
            return new Promise((resolve, reject) => {
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet(guid'" +
                    id + "')?$select=Content", true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            var result = JSON.parse(req.responseText).d;
                            resolve(result.Content);
                        } else {
                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send();
            });
        }

        public deleteItem = (id: string) => {
            return new Promise((resolve, reject) => {
                let req = new XMLHttpRequest();
                req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/WebResourceSet(guid'" + id + "')", true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("X-HTTP-Method", "DELETE");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 204 || req.status === 1223) {
                            resolve("Complete");
                        } else {
                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send();
            });
        }

        public getSolutions = () => {
            return new Promise((resolve, reject) => {
                let req = new XMLHttpRequest();
                req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/SolutionSet?$select=FriendlyName," +
                    "SolutionId,UniqueName,publisher_solution/CustomizationPrefix&$expand=publisher_solution&$filter=IsManaged eq false and " +
                    "IsVisible eq true&$orderby=FriendlyName asc", true);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            let returned = JSON.parse(req.responseText).d;
                            let results = returned.results;
                            let foundSolutions = [];

                            for (let i = 0; i < results.length; i++) {
                                let friendlyName: string = results[i].FriendlyName;
                                let solutionId: string = results[i].SolutionId;
                                let uniqueName: string = results[i].UniqueName;
                                let publisherSolutionCustomizationPrefix: string = results[i].publisher_solution.CustomizationPrefix;

                                foundSolutions[i] = {
                                    id: solutionId,
                                    name: friendlyName,
                                    uniquename: uniqueName,
                                    prefix: publisherSolutionCustomizationPrefix
                                };
                            }

                            resolve(foundSolutions);
                        } else {
                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send();
            });
        }

        public addToSolution = (id: string, solutionName: string) => {
            return new Promise((resolve, reject) => {
                let request = [];
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

                let req = new XMLHttpRequest();
                req.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        req.onreadystatechange = null;
                        if (req.status === 200) {
                            resolve("Complete");
                        } else {
                            let error = this.checkForSoapError(req.responseText);
                            if (error !== null)
                                reject(error);

                            let message = this.checkForRestError(req);
                            reject(message);
                        }
                    }
                };
                req.send(request.join(""));
            });
        }
    }
}

app.registerService("CrmService", []);