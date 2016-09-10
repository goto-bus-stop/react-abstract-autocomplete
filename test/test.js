import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  mount,
  shallow,
} from 'enzyme';
import AutoComplete, { Completion } from '../src';

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
    ac.find('input').simulate('change', {
      target: { value: 'Text Edited' },
    });
    expect(onUpdate).to.have.been.calledWith('Text Edited');
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
