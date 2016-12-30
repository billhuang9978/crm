/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-languages version: 0.6.0(4dd22f337d2512d8bb03edfdb565ebe2529b7f84)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
define("vs/basiclanguages/src/lua",["require","exports"],function(e,n){n.conf={comments:{lineComment:"--",blockComment:["--[[","]]"]},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:'"',close:'"',notIn:["string","comment"]},{open:"'",close:"'",notIn:["string","comment"]},{open:"{",close:"}",notIn:["string","comment"]},{open:"[",close:"]",notIn:["string","comment"]},{open:"(",close:")",notIn:["string","comment"]}]},n.language={defaultToken:"",tokenPostfix:".lua",keywords:["and","break","do","else","elseif","end","false","for","function","goto","if","in","local","nil","not","or","repeat","return","then","true","until","while"],brackets:[{token:"delimiter.bracket",open:"{",close:"}"},{token:"delimiter.array",open:"[",close:"]"},{token:"delimiter.parenthesis",open:"(",close:")"}],operators:["+","-","*","/","%","^","#","==","~=","<=",">=","<",">","=",";",":",",",".","..","..."],symbols:/[=><!~?:&|+\-*\/\^%]+/,escapes:/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,tokenizer:{root:[[/[a-zA-Z_]\w*/,{cases:{"@keywords":{token:"keyword.$0"},"@default":"identifier"}}],{include:"@whitespace"},[/(,)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/,["delimiter","","key","","delimiter"]],[/({)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/,["@brackets","","key","","delimiter"]],[/[{}()\[\]]/,"@brackets"],[/@symbols/,{cases:{"@operators":"delimiter","@default":""}}],[/\d*\.\d+([eE][\-+]?\d+)?/,"number.float"],[/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/,"number.hex"],[/\d+?/,"number"],[/[;,.]/,"delimiter"],[/"([^"\\]|\\.)*$/,"string.invalid"],[/'([^'\\]|\\.)*$/,"string.invalid"],[/"/,"string",'@string."'],[/'/,"string","@string.'"]],whitespace:[[/[ \t\r\n]+/,""],[/--\[([=]*)\[/,"comment","@comment.$1"],[/--.*$/,"comment"]],comment:[[/[^\]]+/,"comment"],[/\]([=]*)\]/,{cases:{"$1==$S2":{token:"comment",next:"@pop"},"@default":"comment"}}],[/./,"comment"]],string:[[/[^\\"']+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/["']/,{cases:{"$#==$S2":{token:"string",next:"@pop"},"@default":"string"}}]]}}});
