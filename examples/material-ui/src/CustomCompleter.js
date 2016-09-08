import * as React from 'react';
import AutoComplete, { Completion } from 'react-abstract-autocomplete';
import TextField from 'material-ui/TextField';
import UserSuggestion from './UserSuggestion';
import EmojiSuggestion from './EmojiSuggestion';
import SuggestionsList from './SuggestionsList';

const CustomCompleter = ({
  emojiNames,
  users,
}) => (
  <AutoComplete
    inputComponent={TextField}
    inputProps={{ id: 'input', floatingLabelText: 'Type here...' }}
    renderSuggestion={props => <UserSuggestion {...props} />}
    renderSuggestions={children => <SuggestionsList>{children}</SuggestionsList>}
  >
    <Completion
      trigger="@"
      completions={users}
      minLength={1}
    />
    <Completion
      trigger=":"
      completions={emojiNames}
      getCompletions={(value, { completions }) => {
        const compare = value.toLowerCase();
        return completions.filter(completion => (
          completion.substr(0, compare.length).toLowerCase() === compare
        )).slice(0, 20);
      }}
      getText={value => `${value} `}
      renderSuggestion={props => <EmojiSuggestion {...props} />}
    />
  </AutoComplete>
);

CustomCompleter.propTypes = {
  users: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  emojiNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
};

export default CustomCompleter;
