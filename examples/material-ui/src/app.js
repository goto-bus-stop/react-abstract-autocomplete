/* global emojione */
import React from 'react';
import { render } from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import CustomCompleter from './CustomCompleter';
import { users } from '../../exampleData';

const emojiNames = Object.keys(emojione.emojioneList);

function getStyles(theme, isDark) {
  return {
    wrapper: {
      background: isDark ? '#222' : '#ddd',
      width: '100%',
      height: '100%',
      padding: 20,
      boxSizing: 'border-box',
    },
    header: {
      font: '16pt roboto, sans-serif',
      color: theme.palette.textColor,
    },
  };
}

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
    const styles = getStyles(this.state.theme, this.isDark);
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.theme)}>
        <div style={styles.wrapper}>
          <h1 style={styles.header}>Material-ui example</h1>
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
