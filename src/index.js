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
     *
     */
    inputComponent: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]),
    /**
     *
     */
    inputProps: React.PropTypes.object,
    /**
     *
     */
    renderSuggestion: React.PropTypes.func,
    /**
     *
     */
    renderSuggestions: React.PropTypes.func,
    /**
     *
     */
    children: React.PropTypes.node,
    /**
     *
     */
    limit: React.PropTypes.number,
  };

  static defaultProps = {
    inputComponent: 'input',
    inputProps: {},
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
    limit: 15,
  };

  state = {
    value: '',
    currentSuggestions: [],
    selectedSuggestion: 0,
  };

  handleInput = event => {
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
          ...childProps
        })),
      ];
    }, []);

    this.setState({
      value,
      currentSuggestions,
      selectedSuggestion: 0,
    });
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
        () => this.handleInput({ target }),
        1
      );
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
      const newValue = type.getValue(completion.completion, type);
      this.setState({
        value: `${before}${newValue}${after}`,
        currentSuggestions: [],
      }, () => {
        setCursor(input, before.length + newValue.length);
      });
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
      value,
      currentSuggestions,
    } = this.state;
    const {
      inputComponent: InputComponent,
      inputProps,
    } = this.props;

    return (
      <span>
        <InputComponent
          type="text"
          {...inputProps}
          value={value}
          onChange={this.handleInput}
          onKeyDown={this.handleKeyDown}
        />
        {currentSuggestions.length > 0 ? this.renderSuggestions() : null}
      </span>
    );
  }
}

export { Completion };
export default AutoComplete;
