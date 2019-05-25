/*
 1)redux库向外暴露下面几个函数
 createStore(): 接收的参数为reducer函数, 返回为store对象
 combineReducers(): 接收包含n个reducer方法的对象, 返回一个新的reducer函数
 applyMiddleware() // 暂不实现

 2)store对象的内部结构
 getState(): 返回值为内部保存的state数据
 dispatch(): 参数为action对象
 subscribe(): 参数为监听内部state更新的回调函数
 */

export function createStore(reducer) {
  let state = reducer(undefined, {type: '@@redux/init'})

  const listeners = []

  function getState() {
    return state
  }

  function dispatch(action) {
    const newState = reducer(state, action)
    state = newState
    listeners.forEach(listener => listener())
  }

  function subscribe(listener) {
    listeners.push(listener)
  }

  return {
    getState,
    dispatch,
    subscribe
  }
}

export function combineReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((totalState, key) => {
      totalState[key] = reducers[key](state[key], action)
      return totalState
    }, {})
  }
}
