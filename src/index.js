import React from 'react';
import PropTypes from 'prop-types';
import escapeStringRegExp from 'escape-string-regexp';
import Completion from './Completion';

function getRegex({ regex, trigger }) {
  if (regex) {
    return regex;
  }
  const t = escapeStringRegExp(trigger);
  return new RegExp(`.*(${t}.*?)$`);
}

function setCursor(input, position) {
  input.setSelectionRange(position, position);
}

/**
 *
 */
class AutoComplete extends React.Component {
  static propTypes = {
    /**
     * Component to use for rendering the input element. Uses native `<input />`
     * by default.
     *
     * The component should accept `value`, `onChange` and `onKeyDown` props.
     */
    inputComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),

    /**
     * Props to pass to the input component.
     */
    inputProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    /**
     * Function that renders a single suggestion. This can be overridden for
     * individual Completion types, in case they need custom rendering.
     *
     * @default `<div key={key} onClick={select}>{value}</div>`
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
    renderSuggestion: PropTypes.func,

    /**
     * Function that renders the suggestions list.
     *
     * @default `<div>{suggestions}</div>`
     *
     * @param {Array} suggestions - Array of children rendered by
     *     `renderSuggestion`.
     * @returns {ReactElement}
     */
    renderSuggestions: PropTypes.func,

    /**
     * Completion types as [`<Completion />`][Completion] elements.
     */
    children: PropTypes.node,

    /**
     * The maximum amount of suggestions to show.
     */
    limit: PropTypes.number,

    /**
     * Current string value of the input component. Optional, useful for
     * controlled inputs. Passed down to the input component as the value prop.
     */
    value: PropTypes.string, // eslint-disable-line react/require-default-props

    /**
     * Initial string value for uncontrolled inputs.
     */
    defaultValue: PropTypes.string,

    /**
     * Fired when the input component's value changes. Use this for controlled
     * inputs.
     *
     * @param {string} newValue
     */
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    inputComponent: 'input',
    inputProps: {
      type: 'text',
    },
    renderSuggestion: ({
      key,
      value,
      selected,
      select,
    }) => (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        key={key}
        style={{ fontWeight: selected ? 'bold' : 'normal' }}
        onClick={select}
        onKeyDown={event => event.key === 'Enter' && select()}
      >
        {value}
      </div>
    ),
    renderSuggestions: suggestions => (
      <div>
        {suggestions}
      </div>
    ),
    children: [],
    limit: 15,
    defaultValue: '',
    onUpdate: () => {},
  };

  state = {
    open: false,
    // eslint-disable-next-line react/destructuring-assignment
    value: this.props.defaultValue || '',
    input: null,
    currentSuggestions: [],
    selectedSuggestion: 0,
  };

  handleChange = (event) => {
    const { children, limit } = this.props;
    const { value, selectionEnd } = event.target;
    const completingValue = value.slice(0, selectionEnd);

    const completionTypes = React.Children
      .map(children, child => child.props)
      .reduce((types, completionType) => {
        const rx = getRegex(completionType);
        const match = rx.exec(completingValue);
        if (match) {
          const matchingValue = match[1] || match[0];
          if (matchingValue.length >= completionType.minLength) {
            types.push({
              type: completionType,
              regex: rx,
              matchingValue,
            });
          }
        }
        return types;
      }, []);

    const currentSuggestions = completionTypes.reduce((available, childProps) => {
      const { type, matchingValue } = childProps;
      const currentLimit = limit - available.length;
      // Don't even ask for more completions if we've already reached our max.
      if (currentLimit <= 0) {
        return available;
      }
      const completions = type.getCompletions(matchingValue, type).slice(0, currentLimit);
      return [
        ...available,
        ...completions.map(completion => ({
          completion,
          ...childProps,
        })),
      ];
    }, []);

    this.setState({
      value,
      input: event.target,
      currentSuggestions,
      selectedSuggestion: 0,
    });

    const { inputProps } = this.props;
    if (inputProps.onChange && !event.defaultPrevented) {
      inputProps.onChange(event);
    }

    this.sendUpdate(value);
  };

  handleKeyDown = (event) => {
    const { selectedSuggestion, currentSuggestions } = this.state;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (currentSuggestions.length > 0) {
        const nextSuggestion = selectedSuggestion > 0
          ? selectedSuggestion - 1
          : currentSuggestions.length - 1;
        this.setState({ selectedSuggestion: nextSuggestion });
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (currentSuggestions.length > 0) {
        const nextSuggestion = (selectedSuggestion + 1) % currentSuggestions.length;
        this.setState({ selectedSuggestion: nextSuggestion });
      }
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      if (currentSuggestions[selectedSuggestion]) {
        event.preventDefault();
        this.select(selectedSuggestion, event.target);
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const { target } = event;
      setTimeout(
        () => this.handleChange({ target }),
        1,
      );
    }

    // Bubble up manually if necessary
    const { inputProps } = this.props;
    if (inputProps.onKeyDown && !event.defaultPrevented) {
      inputProps.onKeyDown(event);
    }
  };

  handleFocus = (event) => {
    this.setState({ open: true });
    const { inputProps } = this.props;
    if (inputProps.onFocus) {
      inputProps.onFocus(event);
    }
  };

  handleBlur = (event) => {
    // Make sure the blur event is handled _after_ any possible suggestion click
    // events. Otherwise, the suggestions list might close before a click event
    // is registered, and click-completing would be impossible.
    // It's a bit of a hack and hopefully there is a better way!
    setTimeout(() => {
      this.setState({ open: false });
      const { inputProps } = this.props;
      if (inputProps.onBlur) {
        inputProps.onBlur(event);
      }
    }, 16);
  };

  select = (idx, input) => {
    const { currentSuggestions, value } = this.state;
    const cursorPosition = input ? input.selectionEnd : value.length;
    const completion = currentSuggestions[idx];
    if (input) {
      const { type, matchingValue } = completion;
      const before = value.slice(0, cursorPosition - matchingValue.length);
      const after = value.slice(cursorPosition);
      const insertValue = type.getText(completion.completion, type);
      const newValue = `${before}${insertValue}${after}`;

      this.setState({
        value: newValue,
        currentSuggestions: [],
      }, () => {
        input.focus();
        setCursor(input, before.length + insertValue.length);
      });

      this.sendUpdate(newValue);
    }
  };

  sendUpdate(value) {
    const { onUpdate } = this.props;

    onUpdate(value);
  }

  renderSuggestion({ type, completion }, idx) {
    const { renderSuggestion } = this.props;
    const { input, selectedSuggestion } = this.state;

    // Use the Completion type's suggestion renderer, or the default if it
    // doesn't have a custom one.
    const render = type.renderSuggestion || renderSuggestion;
    return render({
      key: `${idx}`,
      value: completion,
      selected: idx === selectedSuggestion,
      select: () => this.select(idx, input),
    });
  }

  renderSuggestions() {
    const { renderSuggestions } = this.props;
    const { currentSuggestions } = this.state;

    const suggestions = currentSuggestions.map(this.renderSuggestion, this);
    return renderSuggestions(suggestions);
  }

  render() {
    const {
      open,
      currentSuggestions,
      value: stateValue,
    } = this.state;
    const {
      inputComponent: InputComponent,
      inputProps,
      value: propsValue,
    } = this.props;

    const value = propsValue !== undefined ? propsValue : stateValue;

    return (
      <span>
        <InputComponent
          {...inputProps}
          value={value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {open && currentSuggestions.length > 0 ? this.renderSuggestions() : null}
      </span>
    );
  }
}

export { Completion };
export default AutoComplete;
