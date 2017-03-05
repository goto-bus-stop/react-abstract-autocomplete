import * as React from 'react';

/**
 * `<Completion />` elements describe different data sources. Multiple can be
 * used in the same [`<AutoComplete />`][AutoComplete] component.
 */
class Completion extends React.Component {
  static propTypes = {
    /**
     * String that triggers this completion type.
     */
    trigger: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(RegExp),
    ]).isRequired,

    /**
     * Minimum amount of characters typed before suggestions will be given.
     */
    minLength: React.PropTypes.number,

    /**
     * Regex to extract the current completion value from the input. Can also be
     * used to "validate" the current completion value, so no suggestions will
     * be provided if it's "invalid".
     *
     * Uses the first capture group as the value to be completed, or the full
     * match if there are no capture groups. For example:
     *  - `/.*(@.*?)$/` + "Hello @ReA" → "@ReA"
     *  - `/\w+$/` + "This is sp" → "sp"
     */
    regex: React.PropTypes.instanceOf(RegExp),

    /**
     * Function that renders a single suggestion.
     *
     * @param {Object} suggestion - Suggestion descriptor.
     * @param {string} suggestion.key - Unique key for the suggestion element.
     *     See [Dynamic Children](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children)
     *     for details.
     * @param {*} suggestion.value - Completion value of this suggestion.
     * @param {boolean} suggestion.selected - Whether this suggestion is
     *     currently selected.
     * @param {function} suggestion.select - Autocomplete this suggestion.
     * @returns {ReactElement}
     */
    renderSuggestion: React.PropTypes.func,

    /**
     * Get an array of possible completions.
     *
     * @default Searches the `completions` prop.
     *
     * @param {string} matchingValue - Current value to be completed, as
     *     extracted using `props.regex`.
     * @param {Object} props - Props of this `<Completion />` element.
     * @returns {Array.<*>}
     */
    getCompletions: React.PropTypes.func,

    /**
     * Optional array of completion values. This can be used if all possible
     * completions are known beforehand. If provided, a default `getCompletions`
     * function that searches this array will be used.
     */
    completions: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types

    /**
     * Transform a completion value to a string that will be inserted into the
     * input component. By default, uses ``` `${props.trigger}${value} ` ```.
     * (Note the space at the end! If you want to add a space once a completion
     * is inserted, add it here.)
     *
     * @param {*} value - Completion value.
     * @param {Object} props - Props of this `<Completion />` element.
     * @returns {string}
     */
    getText: React.PropTypes.func,
  };

  static defaultProps = {
    minLength: 3,
    regex: null,
    renderSuggestion: null,
    getCompletions: (value, { trigger, completions }) => {
      const compare = value.substr(trigger.length).toLowerCase();
      return completions.filter(completion => (
        completion.substr(0, compare.length).toLowerCase() === compare
      ));
    },
    completions: [],
    getText: (value, { trigger }) => `${trigger}${value} `,
  };

  render() {
    return null;
  }
}

export default Completion;
