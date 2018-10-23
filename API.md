# API
## Functions

<dl>
<dt><a href="#initJSArch">initJSArch($, [name], [dependencies])</a> ⇒ <code>undefined</code></dt>
<dd><p>Declare jsArch in the dependency injection system</p>
</dd>
<dt><a href="#jsArch">jsArch(services, options)</a> ⇒ <code>String</code></dt>
<dd><p>Compile an run a template</p>
</dd>
</dl>

<a name="initJSArch"></a>

## initJSArch($, [name], [dependencies]) ⇒ <code>undefined</code>
Declare jsArch in the dependency injection system

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| $ | <code>Knifecycle</code> |  | The knifecycle instance |
| [name] | <code>String</code> | <code>&#x27;jsArch&#x27;</code> | The name of the service |
| [dependencies] | <code>Array</code> | <code>[&#x27;glob&#x27;, &#x27;fs&#x27;, &#x27;log&#x27;]</code> | The dependencies to inject |

<a name="jsArch"></a>

## jsArch(services, options) ⇒ <code>String</code>
Compile an run a template

**Kind**: global function  
**Returns**: <code>String</code> - Computed architecture notes as a markdown file  

| Param | Type | Description |
| --- | --- | --- |
| services | <code>Object</code> | Services (provided by the dependency injector) |
| services.glob | <code>Object</code> | Globbing service |
| services.fs | <code>Object</code> | File system service |
| services.log | <code>Object</code> | Logging service |
| options | <code>Object</code> | Options (destructured) |
| options.cwd | <code>Object</code> | Current working directory |
| options.patterns | <code>Object</code> | Patterns to look files for (see node-glob) |
| options.eol | <code>Object</code> | End of line character (default to the OS one) |
| options.titleLevel | <code>Object</code> | The base title level of the output makdown document |
| options.base | <code>Object</code> | The base directory for the ARCHITECTURE.md references |

