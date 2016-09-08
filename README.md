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

### AutoComplete

<!--
  Whelp… HTML tables, because GFM doesn't do multiline cell content, I think?
-->

<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`inputComponent`</td>
      <td>`'input'`</td>
      <td>
        Component to use for rendering the input element. Uses native `<input />`
        by default. <br>
        The component should accept `value`, `onChange` and `onKeyDown` props.
      </td>
    </tr>
    <tr>
      <td>`inputProps`</td>
      <td>`{}`</td>
      <td>Props to pass to the input component.</td>
    </tr>
    <tr>
      <td>`children`</td>
      <td></td>
      <td>[Completion types][#completion] as `<Completion />` elements.</td>
    </tr>
    <tr>
      <td>`limit`</td>
      <td>15</td>
      <td>The maximum amount of suggestions to show.</td>
    </tr>
    <tr>
      <td>`renderSuggestions`</td>
      <td>`<div>{suggestions}</div>`</td>
      <td>
        Function that renders the suggestions list. <br>
        Signature: `(suggestions: Array<element>) => element` <br>
      </td>
    </tr>
    <tr>
      <td>`renderSuggestion`</td>
      <td>
        `<div key={key} onClick={select}>{value}</div>`
      </td>
      <td>
        Function that renders a single suggestion. This can be overridden for
        individual Completion types, in case they need custom rendering. <br>
        Signature: `(suggestion: object) => element` <br>
        _suggestion.key_ `string` - Unique key for the suggestion element. See
          [Dynamic Children] for details. <br>
        _suggestion.value_ `any` - Completion value of this suggestion. <br>
        _suggestion.selected_ `boolean` - Whether this suggestion is currently
        selected. <br>
        _suggestion.select_ `function` - Autocomplete this suggestion.
      </td>
    </tr>
  </tbody>
</table>

### Completion

`<Completion />` elements describe different data sources. Multiple can be used
in the same [`<AutoComplete />`][AutoComplete] component.

<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`trigger` (required)</td>
      <td></td>
      <td>String that triggers this completion type.</td>
    </tr>
    <tr>
      <td>`minLength`</td>
      <td>3</td>
      <td>Minimum amount of characters typed before suggestions will be given.</td>
    </tr>
    <tr>
      <td>`regex`</td>
      <td>`/.*(<trigger>.*?)$/`</td>
      <td>
        <p>Regex to extract the current completion value from the input. Can also
        be used to "validate" the current completion value, so no suggestions
        will be provided if it's "invalid".</p>

        <p>Uses the first capture group as the value to be completed, or the full
        match if there are no capture groups. For example:</p>

        <ul>
          <li>`/.*(@.*?)$/` + `"Hello @ReA"` → `"@ReA"`</li>
          <li>`/\w+$/` + `"This is sp"` → `"sp"`</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>`limit`</td>
      <td>15</td>
      <td>The maximum amount of suggestions to show.</td>
    </tr>
    <tr>
      <td>`renderSuggestion`</td>
      <td></td>
      <td>
        Optional override of the [`<AutoComplete />`][AutoComplete]'s
        `renderSuggestion` prop, with the same behaviour.
      </td>
    </tr>
    <tr>
      <td>`getCompletions`</td>
      <td>Searches `completions` prop by default</td>
      <td>
        Get an array of possible completions. <br>
        Signature: `(matchingValue: string, props: object) => array` <br>
        _matchingValue_ - Current value to be completed, as extracted using
        `props.regex`. <br>
        _props_ - Props passed to this `<Completion />` element.
      </td>
    </tr>
    <tr>
      <td>`completions`</td>
      <td></td>
      <td>
        Optional array of completion values. This can be used if all possible
        completions are known beforehand. If provided, a default `getCompletions`
        function that searches this array will be used.
      </td>
    </tr>
    <tr>
      <td>`getText`</td>
      <td>
        `(value, props) => props.trigger + value + ' '`
      </td>
      <td>
        Transform a completion value to a string that will be inserted into the
        input component. By default, uses `${props.trigger}${value} `. (Note the
        space at the end! If you want to add a space once a completion is
        inserted, add it here.) <br>
        Signature: `(value: any, props: object) => string` <br>
        _value_ - Completion value. <br>
        _props_ - Props of this `<Completion />` element.
      </td>
    </tr>
  </tbody>
</table>

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
