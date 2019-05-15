import React, {Component} from 'react';

import storageUtils from '../../utils/storageUtils';

import './index.less';

export default class Header extends Component {

  render() {
    const user = storageUtils.getUser();

    return <div>header</div>
  }
}