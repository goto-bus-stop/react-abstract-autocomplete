import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  mount,
  shallow,
} from 'enzyme';
import AutoComplete, { Completion } from '../src';

function type(input, value) {
  const cursorPosition = value.indexOf('|');
  const selectionEnd = cursorPosition === -1 ? value.length : cursorPosition;

  input.simulate('focus');

  Object.assign(input.node, {
    value: value.replace('|', ''),
    selectionEnd,
  });

  input.simulate('change', { target: input.node });
}

describe('<AutoComplete />', () => {
  it('renders a normal text input by default', () => {
    const ac = shallow(<AutoComplete />);
    expect(ac.find('input')).to.have.length(1);
    expect(ac.containsMatchingElement(<input type="text" />)).to.equal(true);
  });

  it('renders custom input components', () => {
    const CustomInput = props => (
      <div className="Super Special Input">
        Your text: <input type="email" {...props} />
      </div>
    );
    const ac = shallow(
      <AutoComplete inputComponent={CustomInput} />
    );
    expect(ac.containsMatchingElement(<CustomInput />)).to.equal(true);
  });

  it('renders the defaultValue by default', () => {
    const testValue = 'Test Value';
    const ac = shallow(
      <AutoComplete defaultValue={testValue} />
    );
    expect(ac.find('input').props().value).to.equal(testValue);
  });

  it('responds to controlled-style value props', () => {
    const valueOne = 'Value One';
    const valueTwo = 'Value Two';
    const ac = mount(
      <AutoComplete value={valueOne} />
    );
    expect(ac.find('input').props().value).to.equal(valueOne);
    ac.setProps({ value: valueTwo });
    expect(ac.find('input').props().value).to.equal(valueTwo);
  });

  it('fires onUpdate events when the input value is changed', () => {
    const onUpdate = spy();
    const ac = mount(
      <AutoComplete defaultValue="Text" onUpdate={onUpdate} />
    );
    type(ac.find('input'), 'Text Edited');
    expect(onUpdate).to.have.been.calledWith('Text Edited');
  });

  it('asks for completions when the input value contains a trigger character', () => {
    const getCompletions = spy(() => []);
    const ac = mount(
      <AutoComplete>
        <Completion
          trigger="@"
          getCompletions={getCompletions}
        />
      </AutoComplete>
    );
    const testValue = 'Hello @Som';
    type(ac.find('input'), testValue);
    expect(getCompletions).to.have.been.calledWithMatch('@Som', {});
  });

  it('renders Suggestions when a Completion responds', () => {
    const getCompletions = spy(() => [
      'Autocompleted!',
    ]);
    const renderSuggestions = spy(suggestions => (
      <div className="Suggestions">{suggestions}</div>
    ));
    const ac = mount(
      <AutoComplete renderSuggestions={renderSuggestions}>
        <Completion trigger="?" getCompletions={getCompletions} />
      </AutoComplete>
    );
    type(ac.find('input'), 'Something');
    expect(renderSuggestions).to.not.have.been.calledWith();
    type(ac.find('input'), 'Now ?Autoc');
    expect(renderSuggestions).to.have.been.calledWith();
  });

  it('hides suggestions when input is unfocused', () => {
    const renderSuggestions = suggestions => (
      <div className="Suggestions">{suggestions}</div>
    );
    const ac = mount(
      <AutoComplete renderSuggestions={renderSuggestions}>
        <Completion trigger="!" getCompletions={() => ['a', 'b', 'c']} />
      </AutoComplete>
    );
    const input = ac.find('input');
    type(input, 'Something');
    input.simulate('blur');
    expect(ac.find('.Suggestions')).to.have.length(0);
  });

  it('inserts completions when pressing Tab/Enter', () => {
    const getText = spy(value => value);
    const completions = ['Completed'];
    const ac = mount(
      <AutoComplete>
        <Completion trigger="!" completions={completions} getText={getText} />
      </AutoComplete>
    );

    const input = ac.find('input');
    type(input, 'This Is !Compl');
    input.simulate('keydown', { key: 'Enter' });
    expect(getText).to.have.been.calledWith('Completed');
    expect(input.prop('value')).to.equal('This Is Completed');

    getText.reset();
    type(input, 'This Is !Compl');
    input.simulate('keydown', { key: 'Tab' });
    expect(getText).to.have.been.calledWith('Completed');
    expect(input.prop('value')).to.equal('This Is Completed');
  });

  it('inserts completions when clicking a suggestion element', () => {
    // eslint-disable-next-line react/prop-types
    const renderSuggestion = ({ key, select }) => (
      <div className="suggestion" key={key} onClick={select} />
    );
    const getText = spy(value => value);
    const completions = ['complete'];
    const ac = mount(
      <AutoComplete renderSuggestion={renderSuggestion}>
        <Completion trigger="!" completions={completions} getText={getText} />
      </AutoComplete>
    );

    type(ac.find('input'), 'Click will !com');
    ac.find('.suggestion').simulate('click');

    expect(getText).to.have.been.calledWith('complete');
    expect(ac.find('input').prop('value')).to.equal('Click will complete');
  });

  it('allows selecting the desired suggestion using up/down keys', () => {
    const completions = ['abc', 'abcabc', 'abcabcabc'];
    const ac = mount(
      <AutoComplete>
        <Completion trigger="!" minLength={2} completions={completions} />
      </AutoComplete>
    );

    const input = ac.find('input');
    type(input, '!a');
    expect(ac.state('selectedSuggestion')).to.equal(0);
    input.simulate('keydown', { key: 'ArrowDown' });
    expect(ac.state('selectedSuggestion')).to.equal(1);
    input.simulate('keydown', { key: 'ArrowDown' });
    expect(ac.state('selectedSuggestion')).to.equal(2);
    input.simulate('keydown', { key: 'ArrowUp' });
    expect(ac.state('selectedSuggestion')).to.equal(1);
  });

  it('wraps around when using up/down keys to navigate beyond first/last items', () => {
    const completions = ['abc', 'abcabc', 'abcabcabc'];
    const ac = mount(
      <AutoComplete>
        <Completion trigger="!" minLength={2} completions={completions} />
      </AutoComplete>
    );

    const input = ac.find('input');
    type(input, '!a');
    expect(ac.state('selectedSuggestion')).to.equal(0);
    input.simulate('keydown', { key: 'ArrowUp' });
    expect(ac.state('selectedSuggestion')).to.equal(2);
    input.simulate('keydown', { key: 'ArrowDown' });
    expect(ac.state('selectedSuggestion')).to.equal(0);
  });
});

describe('<Completion />', () => {
  it('searches the `completions` prop if no `getCompletions` is given', () => {
    const usernames = [
      'Test',
      'More test',
      'Test Two',
    ];
    const cp = shallow(
      <Completion trigger="@" completions={usernames} />
    ).instance();
    expect(
      cp.props.getCompletions('@Tes', cp.props)
    ).to.eql(['Test', 'Test Two']);
    expect(
      cp.props.getCompletions('@Nothing', cp.props)
    ).to.eql([]);
    // case insensitive
    expect(
      cp.props.getCompletions('@MORE TE', cp.props)
    ).to.eql(['More test']);
  });
});
