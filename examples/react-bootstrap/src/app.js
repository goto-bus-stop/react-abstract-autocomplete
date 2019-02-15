import React from 'react';
import { render } from 'react-dom';
import AutoComplete, { Completion } from 'react-abstract-autocomplete';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import FormControl from 'react-bootstrap/lib/FormControl';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { users } from '../../exampleData';

// eslint-disable-next-line react/prop-types
const renderSuggestion = ({ key, selected, value }) => (
  <MenuItem key={key} active={selected}>
    {value}
  </MenuItem>
);

const renderSuggestions = suggestions => (
  <div className="dropdown open">
    <ul className="dropdown-menu">
      {suggestions}
    </ul>
  </div>
);

class App extends React.Component {
  state = {
    value: 'Type something here',
  };

  handleUpdate = (value) => {
    this.setState({
      value,
    });
  };

  render() {
    const { value } = this.state;

    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <PageHeader>
              React-Bootstrap example
            </PageHeader>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <AutoComplete
              inputComponent={FormControl}
              value={value}
              onUpdate={this.handleUpdate}
              renderSuggestion={renderSuggestion}
              renderSuggestions={renderSuggestions}
            >
              <Completion trigger="@" completions={users} minLength={1} />
            </AutoComplete>
          </Col>
        </Row>
      </Grid>
    );
  }
}

render(<App />, document.querySelector('#app'));
