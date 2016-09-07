import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';

const UserSuggestion = ({
  label,
  value,
  selected,
  select,
}) => (
  <ListItem
    value={value}
    leftAvatar={
      <Avatar src={`https://sigil.cupcake.io/${btoa(label)}`} />
    }
    primaryText={label}
    onTouchTap={select}
    style={selected ? { background: 'rgba(127, 127, 127, 0.1)' } : {}}
  />
);

UserSuggestion.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  selected: React.PropTypes.bool.isRequired,
  select: React.PropTypes.func.isRequired,
};

export default UserSuggestion;
