/* global emojione */
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';

const emojiCode = name =>
  emojione.emojioneList[name].unicode[0];
const emojiUrl = name =>
  `https://cdn.jsdelivr.net/emojione/assets/png/${emojiCode(name)}.png`;

const EmojiSuggestion = ({
  value,
  selected,
  select,
}) => (
  <ListItem
    value={value}
    leftAvatar={
      <Avatar src={emojiUrl(value)} />
    }
    primaryText={value}
    onTouchTap={select}
    style={selected ? { background: 'rgba(127, 127, 127, 0.1)' } : {}}
  />
);

EmojiSuggestion.propTypes = {
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  select: PropTypes.func.isRequired,
};

export default EmojiSuggestion;
