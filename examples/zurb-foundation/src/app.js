import * as React from 'react';
import { render } from 'react-dom';
import AutoComplete, { Completion } from 'react-abstract-autocomplete';
import { users } from '../../exampleData';

// eslint-disable-next-line react/prop-types
const renderSuggestion = ({ key, selected, label, select }) => (
  <li key={key} className={selected ? 'active' : ''}>
    <a href="#" onClick={select}>{label}</a>
  </li>
);

const App = () => (
  <div className="row">
    <div className="small-12 columns">
      <h1>Zurb Foundation example</h1>
      <AutoComplete
        renderSuggestion={renderSuggestion}
        renderSuggestions={suggestions => (
          <ul className="vertical menu">{suggestions}</ul>
        )}
      >
        <Completion trigger="@" completions={users} />
      </AutoComplete>
    </div>
  </div>
);

render(<App />, document.querySelector('#app'));
