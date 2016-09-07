import * as React from 'react';
import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';

const SuggestionsList = ({
  children,
}) => (
  <Paper>
    <List>
      {children}
    </List>
  </Paper>
);

SuggestionsList.propTypes = {
  children: React.PropTypes.node.isRequired,
};

export default SuggestionsList;
