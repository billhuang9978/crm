/// <reference path="libs/typings/angularjs/angular.d.ts" />

"use strict";

var modules = ["app.controllers", "app.directives", "app.services"];
modules.forEach((module) => angular.module(module, ["ngRoute", "ui.grid", "ui.grid.pagination", "blockUI", "cgNotify"]));
angular.module("app", modules);

module app {
    export module controllers { }
    export module directives { }
    export module services { }

    export interface IController { }
    export interface IDirective {
        restrict: string;
        link($scope: ng.IScope, element: JQuery, attrs: ng.IAttributes): any;
    }

    export interface IService { }

    export function registerController(className: string, services: string[]) {
        var controller = "app.controllers." + className;
        services.push(app.controllers[className]);
        angular.module("app.controllers").controller(controller, services);
    }

    export function registerDirective(className: string, services: string[]) {
        var directive = className[0].toLowerCase() + className.slice(1);
        services.push((() => new app.directives[className]()) as any);
        angular.module("app.directives").directive(directive, services);
    }

    export function registerService(className: string, services: string[]) {
        var service = className[0].toLowerCase() + className.slice(1);
        services.push((() => new app.services[className]()) as any);
        angular.module("app.services").factory(service, services);
    }
}
