import * as React from 'react';

/**
 *
 */
class Completion extends React.Component {
  static propTypes = {
    /**
     *
     */
    trigger: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(RegExp),
    ]).isRequired,
    /**
     *
     */
    regex: React.PropTypes.instanceOf(RegExp),
    /**
     *
     */
    renderSuggestion: React.PropTypes.func,
    /**
     *
     */
    getCompletions: React.PropTypes.func.isRequired,
    /**
     *
     */
    completions: React.PropTypes.array,
    /**
     *
     */
    getValue: React.PropTypes.func,
  };

  static defaultProps = {
    getCompletions: (value, { trigger, completions }) => {
      const compare = value.substr(trigger.length).toLowerCase();
      return completions.filter(completion => (
        completion.substr(0, compare.length).toLowerCase() === compare
      ));
    },
    getValue: (value, { trigger }) => `${trigger}${value} `,
  };

  render() {
    return null;
  }
}

export default Completion;
