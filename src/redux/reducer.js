import { combineReducers } from 'redux'

import { SET_HEAD_TITLE } from './action-type'
import storageUtils from '../utils/storageUtils'

const initHeadTitle = '首页'

function headTitle(state = initHeadTitle, action) {
  switch (action.type){
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}

const initUser = storageUtils.getUser()

function user(state = initUser, action) {
  switch (action.type){
    default:
      return state
  }
}

export default combineReducers({
  headTitle,
  user
})