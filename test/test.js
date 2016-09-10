import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AutoComplete from '../src';

describe('<AutoComplete />', () => {
  it('renders a normal text input by default', () => {
    const ac = shallow(<AutoComplete />);
    expect(ac.find('input')).to.have.length(1);
    expect(ac.find('input').props()).to.have.property('type', 'text');
  });
});
