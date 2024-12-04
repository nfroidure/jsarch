[//]: # ( )
[//]: # (This file is automatically generated by a `metapak`)
[//]: # (module. Do not change it  except between the)
[//]: # (`content:start/end` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# jsarch
> A simple module to extract architecture notes from your code.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nfroidure/jsarch/blob/main/LICENSE)


[//]: # (::contents:start)

## Usage

To generate any project's architecture notes:

```
jsarch src/*.js > ARCHITECTURE.md

```

### Configuration

You can set your own configuration by adding a `jsarch` property in your
`package.json` file (see
[the defaults](https://github.com/nfroidure/jsarch/blob/master/src/jsarch.js#L20-L36)).

For example, if you which to have TypeScript support and you use Gitlab instead
of GitHub, just add this:

```js
{
    // (...)
    "jsarch": {
        "gitProvider": "bitbucket",
        "parserOptions": {
          "plugins": ["typescript"]
        }
    }
    // (...)
}
```

Per default, the Babel parser is used, but you can change it with the `parser`
option. You'll have to install it before using it.

## Development

To get involved into this module's development:
```sh
npm i -g jsarch

git clone git@github.com:nfroidure/jsarch.git

cd jsarch

npm it
npm run build

node bin/jsarch **/*.js > ARCHITECTURE.md
```

## Architecture Notes

You can see [this repository architecture notes](./ARCHITECTURE.md) for an
example of the kind of content generated by this module.


[//]: # (::contents:end)

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
| services.parser | <code>Object</code> |  | Parser service |
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


# Authors
- [Nicolas Froidure](http://insertafter.com/en/index.html)


# License
[MIT](https://github.com/nfroidure/jsarch/blob/main/LICENSE)
