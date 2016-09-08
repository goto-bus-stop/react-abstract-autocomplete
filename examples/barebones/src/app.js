import * as React from 'react';
import { render } from 'react-dom';
import AutoComplete, { Completion } from 'react-abstract-autocomplete';
import { users } from '../../exampleData';

const App = () => (
  <div>
    <h1>Barebones example</h1>
    <AutoComplete>
      <Completion trigger="@" completions={users} minLength={1} />
    </AutoComplete>
  </div>
);

render(<App />, document.querySelector('#app'));
