# react-abstract-autocomplete

Bring-Your-Own-UI autocomplete component for React.

[Examples] - [Examples source code] - [Installation] - [Usage] - [License]

## Installation

```bash
npm install --save react-abstract-autocomplete
```

## Usage

For usage examples, check out the [Examples] page, and the projects in the
[examples/][Examples source code] directory.

<!-- Docs are generated using `npm run docs` and copy-pasted here: -->

### AutoComplete
| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| inputComponent | one of:<br>&nbsp;string<br>&nbsp;function<br> | 'input' | Component to use for rendering the input element. Uses native `<input />` by default.<br>The component should accept `value`, `onChange` and `onKeyDown` props. |
| inputProps | object | {} | Props to pass to the input component. |
| renderSuggestion | function | `<div key={key} onClick={select}>{value}</div>` | Function that renders a single suggestion. This can be overridden for individual Completion types, in case they need custom rendering.<br><br>**Signature:**<br>`function(suggestion: Object) => element`<br>*suggestion:* Suggestion descriptor.<br>*suggestion.key:* Unique key for the suggestion element.     See [Dynamic Children](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children)     for details.<br>*suggestion.value:* Completion value of this suggestion.<br>*suggestion.selected:* Whether this suggestion is     currently selected.<br>*suggestion.select:* Autocomplete this suggestion. |
| renderSuggestions | function | `<div>{suggestions}</div>` | Function that renders the suggestions list.<br><br>**Signature:**<br>`function(suggestions: Array) => element`<br>*suggestions:* Array of children rendered by     `renderSuggestion`. |
| children | node |  | Completion types as [`<Completion />`][Completion] elements. |
| limit | number | 15 | The maximum amount of suggestions to show. |

### Completion

`<Completion />` elements describe different data sources. Multiple can be
used in the same [`<AutoComplete />`][AutoComplete] component.

| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| trigger _(required)_ | one of:<br>&nbsp;string<br>&nbsp;RegExp<br> |  | String that triggers this completion type. |
| minLength | number | 3 | Minimum amount of characters typed before suggestions will be given. |
| regex | RegExp |  | Regex to extract the current completion value from the input. Can also be used to "validate" the current completion value, so no suggestions will be provided if it's "invalid".<br>Uses the first capture group as the value to be completed, or the full match if there are no capture groups. For example:  - /.*(@.*?)$/ + "Hello @ReA" → "@ReA"  - /\w+$/ + "This is sp" → "sp" |
| renderSuggestion | function |  | Function that renders a single suggestion.<br><br>**Signature:**<br>`function(suggestion: Object) => element`<br>*suggestion:* Suggestion descriptor.<br>*suggestion.key:* Unique key for the suggestion element.     See [Dynamic Children](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children)     for details.<br>*suggestion.value:* Completion value of this suggestion.<br>*suggestion.selected:* Whether this suggestion is     currently selected.<br>*suggestion.select:* Autocomplete this suggestion. |
| getCompletions | function | Searches the `completions` prop. | Get an array of possible completions.<br><br>**Signature:**<br>`function(matchingValue: string, props: Object) => undefined`<br>*matchingValue:* Current value to be completed, as     extracted using `props.regex`.<br>*props:* Props of this `<Completion />` element. |
| completions | array |  | Optional array of completion values. This can be used if all possible completions are known beforehand. If provided, a default `getCompletions` function that searches this array will be used. |
| getText | function | (value, { trigger }) => `${trigger}${value} ` | Transform a completion value to a string that will be inserted into the input component. By default, uses `${props.trigger}${value} `. (Note the space at the end! If you want to add a space once a completion is inserted, add it here.)<br><br>**Signature:**<br>`function(value: undefined, props: Object) => string`<br>*value:* Completion value.<br>*props:* Props of this `<Completion />` element. |

## License

[MIT]

[Examples]: https://goto-bus-stop.github.io/react-abstract-autocomplete/examples
[Examples source code]: ./examples
[Installation]: #installation
[Usage]: #usage
[AutoComplete]: #autocomplete
[Completion]: #completion
[License]: #license
[Dynamic Children]: https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
[MIT]: ./LICENSE
