import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import memoryUtils from '../../utils/memoryUtils';

export default class Admin extends Component{

  render() {
    if (!memoryUtils.user || !memoryUtils.user._id) {
      return <Redirect to='/login'/>
    }

    return <div>admin</div>
  }
}
