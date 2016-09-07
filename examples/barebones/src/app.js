import * as React from 'react';
import { render } from 'react-dom';
import AutoComplete, { Completion } from 'react-abstract-autocomplete';
import { users } from '../../exampleData';

const App = () => (
  <AutoComplete>
    <Completion trigger="@" completions={users} />
  </AutoComplete>
);

render(<App />, document.querySelector('#app'));
