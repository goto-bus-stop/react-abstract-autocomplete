import * as React from 'react';
import Completion from './Completion';
import escapeStringRegExp from 'escape-string-regexp';

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
    inputComponent: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]),
    /**
     * Props to pass to the input component.
     */
    inputProps: React.PropTypes.object,
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
     * @returns {element}
     */
    renderSuggestion: React.PropTypes.func,
    /**
     * Function that renders the suggestions list.
     *
     * @default `<div>{suggestions}</div>`
     *
     * @param {Array} suggestions - Array of children rendered by
     *     `renderSuggestion`.
     * @returns {element}
     */
    renderSuggestions: React.PropTypes.func,
    /**
     * Completion types as [`<Completion />`][Completion] elements.
     */
    children: React.PropTypes.node,
    /**
     * The maximum amount of suggestions to show.
     */
    limit: React.PropTypes.number,
    /**
     * Current string value of the input component. Optional, useful for
     * controlled inputs. Passed down to the input component as the value prop.
     */
    value: React.PropTypes.string,
    /**
     * Initial string value for uncontrolled inputs.
     */
    defaultValue: React.PropTypes.string,
    /**
     * Fired when the input component's value changes. Use this for controlled
     * inputs.
     *
     * @param {string} newValue
     */
    onUpdate: React.PropTypes.func,
  };

  static defaultProps = {
    inputComponent: 'input',
    inputProps: {
      type: 'text',
    },
    renderSuggestion: ({ key, value, selected, select }) => (
      <div
        key={key}
        style={{ fontWeight: selected ? 'bold' : 'normal' }}
        onClick={select}
      >
        {value}
      </div>
    ),
    renderSuggestions: suggestions => <div>{suggestions}</div>,
    children: [],
    limit: 15,
  };

  state = {
    value: this.props.defaultValue || '',
    currentSuggestions: [],
    selectedSuggestion: 0,
  };

  sendUpdate(value) {
    const { onUpdate } = this.props;
    if (onUpdate) {
      onUpdate(value);
    }
  }

  handleChange = event => {
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
      currentSuggestions,
      selectedSuggestion: 0,
    });

    const { inputProps } = this.props;
    if (inputProps.onChange && !event.defaultPrevented) {
      inputProps.onChange(event);
    }

    this.sendUpdate(value);
  };

  handleKeyDown = event => {
    const { selectedSuggestion, currentSuggestions } = this.state;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (selectedSuggestion > 0) {
        this.setState({ selectedSuggestion: selectedSuggestion - 1 });
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (selectedSuggestion < currentSuggestions.length - 1) {
        this.setState({ selectedSuggestion: selectedSuggestion + 1 });
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
        1
      );
    }

    // Bubble up manually if necessary
    const { inputProps } = this.props;
    if (inputProps.onKeyDown && !event.defaultPrevented) {
      inputProps.onKeyDown(event);
    }
  };

  select = (idx, input) => {
    const { currentSuggestions, value } = this.state;
    const cursorPosition = input.selectionEnd;
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
        setCursor(input, before.length + insertValue.length);
      });

      this.sendUpdate(newValue);
    }
  };

  renderSuggestion({ type, completion }, idx) {
    const { selectedSuggestion } = this.state;
    // Use the Completion type's suggestion renderer, or the default if it
    // doesn't have a custom one.
    const render = type.renderSuggestion || this.props.renderSuggestion;
    return render({
      key: `${idx}`,
      value: completion,
      selected: idx === selectedSuggestion,
      select: () => this.select(idx),
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
      currentSuggestions,
    } = this.state;
    const {
      inputComponent: InputComponent,
      inputProps,
    } = this.props;

    const value = 'value' in this.props ? this.props.value : this.state.value;

    return (
      <span>
        <InputComponent
          {...inputProps}
          value={value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        {currentSuggestions.length > 0 ? this.renderSuggestions() : null}
      </span>
    );
  }
}

export { Completion };
export default AutoComplete;
