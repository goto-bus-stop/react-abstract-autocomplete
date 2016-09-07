/* global emojione */
import * as React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import CustomCompleter from './CustomCompleter';
import { users } from '../../exampleData';

injectTapEventPlugin();

const emojiNames = Object.keys(emojione.emojioneList);

class App extends React.Component {
  state = {
    theme: lightBaseTheme,
  };

  get isDark() {
    return this.state.theme === darkBaseTheme;
  }

  switchTheme = () => {
    this.setState({
      theme: this.isDark ? lightBaseTheme : darkBaseTheme,
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.theme)}>
        <div style={{ background: this.isDark ? '#222' : '#ddd' }}>
          <div>
            <RaisedButton label="Change theme" onClick={this.switchTheme} />
          </div>
          <div>
            <CustomCompleter users={users} emojiNames={emojiNames} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

render(<App />, document.querySelector('#app'));
