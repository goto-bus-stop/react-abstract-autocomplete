import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';

const UserSuggestion = ({
  value,
  selected,
  select,
}) => (
  <ListItem
    value={value}
    leftAvatar={
      <Avatar src={`https://sigil.cupcake.io/${btoa(value)}`} />
    }
    primaryText={value}
    onTouchTap={select}
    style={selected ? { background: 'rgba(127, 127, 127, 0.1)' } : {}}
  />
);

UserSuggestion.propTypes = {
  value: React.PropTypes.string.isRequired,
  selected: React.PropTypes.bool.isRequired,
  select: React.PropTypes.func.isRequired,
};

export default UserSuggestion;
