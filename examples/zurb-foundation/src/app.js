import * as React from 'react';
import { render } from 'react-dom';
import AutoComplete, { Completion } from 'react-abstract-autocomplete';
import { users } from '../../exampleData';

/* eslint-disable react/prop-types, jsx-a11y/href-no-hash */
const renderSuggestion = ({ key, selected, value, select }) => (
  <li key={key} className={selected ? 'active' : ''}>
    <a href="#" onClick={select}>{value}</a>
  </li>
);
/* eslint-enable react/prop-types, jsx-a11y/href-no-hash */

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
        <Completion
          trigger="@"
          completions={users}
          minLength={1}
          getText={name => `User: ${name} `}
        />
      </AutoComplete>
    </div>
  </div>
);

render(<App />, document.querySelector('#app'));
