# API
<a name="initJSArch"></a>

## initJSArch(services) ⇒ <code>Promise.&lt;function()&gt;</code>
Declare jsArch in the dependency injection system

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| services | <code>Object</code> |  | Services (provided by the dependency injector) |
| services.CONFIG | <code>Object</code> |  | The JSArch config |
| services.EOL | <code>Object</code> |  | The OS EOL chars |
| services.glob | <code>Object</code> |  | Globbing service |
| services.fs | <code>Object</code> |  | File system service |
| [services.log] | <code>Object</code> | <code>noop</code> | Logging service |

<a name="initJSArch..jsArch"></a>

### initJSArch~jsArch(options) ⇒ <code>Promise.&lt;String&gt;</code>
Compile an run a template

**Kind**: inner method of [<code>initJSArch</code>](#initJSArch)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Computed architecture notes as a markdown file  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options (destructured) |
| options.cwd | <code>Object</code> | Current working directory |
| options.patterns | <code>Object</code> | Patterns to look files for (see node-glob) |
| options.eol | <code>Object</code> | End of line character (default to the OS one) |
| options.titleLevel | <code>Object</code> | The base title level of the output makdown document |
| options.base | <code>Object</code> | The base directory for the ARCHITECTURE.md references |

