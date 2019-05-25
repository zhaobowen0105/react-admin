import React from 'react'
import PropTypes from 'prop-types'
/*
 1)react-redux向外暴露了2个API
 a. Provider组件类
 b. connect函数
 2)Provider组件
 接收store属性
 让所有容器组件都可以看到store, 从而通过store读取/更新状态
 3)connect函数
 接收2个参数: mapStateToProps和mapDispatchToProps
 mapStateToProps: 为一个函数, 用来指定向UI组件传递哪些一般属性
 mapDispatchToProps: 为一个函数或对象, 用来指定向UI组件传递哪些函数属性
 connect()执行的返回值为一个高阶组件: 包装UI组件, 返回一个新的容器组件
 容器组件会向UI传入前面指定的一般/函数类型属性
 */


export class Provider extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  }


  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return this.props.children
  }
}

export function connect(mapStateToProps, mapDispatchToProps) {
  return (UIComponent) => {
    return class ContainerComponent extends React.Component {

      static contextTypes = {
        store: PropTypes.object
      }

      constructor(props, context) {
        super(props)
        console.log('ContainerComponent constructor()', context.store)


        const {store} = context
        const stateProps = mapStateToProps(store.getState())

        this.state = {...stateProps}

        let dispatchProps
        if (typeof mapDispatchToProps === 'function') {
          dispatchProps = mapDispatchToProps(store.dispatch)
        } else {
          dispatchProps = Object.keys(mapDispatchToProps).reduce((pre, key) => {
            const actionCreator = mapDispatchToProps[key]
            pre[key] = (...args) => store.dispatch(actionCreator(...args))
            return pre
          }, {})
        }
        this.dispatchProps = dispatchProps

        store.subscribe(() => {
          this.setState({...mapStateToProps(store.getState())})
        })
      }

      render() {
        return <UIComponent {...this.state} {...this.dispatchProps}/>
      }
    }
  }
}



































