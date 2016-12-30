/// <reference path="../app.ts" />

"use strict";

//http://www.codegists.com/code/typescript%20base64%20encode/
module app.services {

    declare function escape(s: string): string;
    declare function unescape(s: string): string;

    export class Base64 implements IService {

        private padchar: string = "=";
        private alpha: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        private getByte(s: string, i: number): number {
            const x = s.charCodeAt(i);
            return x;
        }

        private getByte64(s: string, i: number): number {
            const idx = this.alpha.indexOf(s.charAt(i));
            return idx;
        }

        public decode(s: string): string {
            let pads = 0,
                i, b10, imax = s.length,
                x = [];

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
        }

        public encode(s: string): string {
            s = String(s);

            let i, b10, x = [],
                imax = s.length - s.length % 3;

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
        }
    }
}

app.registerService("Base64", []);