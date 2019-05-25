import {INCREMENT, DECREMENT} from './action-types'
import {combineReducers} from '../lib/redux'

/*
 管理count状态数据的reducer
 */
function count(state = 1, action) {

  switch(action.type){
    case INCREMENT:
      return state + action.data
    case DECREMENT:
      return state - action.data
    default:
      return state
  }
}

function user(state={}, action) {
  console.log('user()', state, action)
  switch (action.type) {
    default:
      return state
  }
}

/*
 返回一个整合后总的reducer
 总的状态: {count: 1, user: {}}
 */
export default combineReducers({
  count,
  user
})