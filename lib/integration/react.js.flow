// @flow
import React, { PureComponent } from 'react' // eslint-disable-line import/no-unresolved
import type { Node } from 'react' // eslint-disable-line import/no-unresolved
import type { Persistor } from '../types'

type Props = {
  onBeforeLift?: Function,
  children?: Node | Function,
  loading?: Node,
  persistor: Persistor,
  delaySeconds?: number
}

type State = {
  bootstrapped: boolean,
  delayDone: boolean
}

export class PersistGate extends PureComponent<Props, State> {
  static defaultProps = {
    loading: null,
    delaySeconds: 0
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      bootstrapped: false,
      delayDone: !props.delaySeconds
    }
  }

  _unsubscribe: ?Function

  componentDidMount() {
    this.handleDelay()

    this._unsubscribe = this.props.persistor.subscribe(
      this.handlePersistorState
    )
    this.handlePersistorState()
  }

  handleDelay() {
    console.log(`[PG handleDelay] gonna wait ${this.props.delaySeconds} s`)
    if (this.props.delaySeconds) {
      setTimeout(() => {
        console.log(`[PG handleDelay timeout] waited ${this.props.delaySeconds} s`)        
        this.setState({ delayDone: true })
      }, this.props.delaySeconds * 1000)
    }
  }

  handlePersistorState = () => {
    const { persistor } = this.props
    let { bootstrapped } = persistor.getState()
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }))
      } else {
        this.setState({ bootstrapped: true })
      }
      this._unsubscribe && this._unsubscribe()
    }
  }

  componentWillUnmount() {
    this._unsubscribe && this._unsubscribe()
  }

  render() {
    console.log({ me: "PG RENDER", state: this.state, d: this.props.delaySeconds })

    if (process.env.NODE_ENV !== 'production') {
      if (typeof this.props.children === 'function' && this.props.loading)
        console.error(
          'redux-persist: PersistGate expects either a function child or loading prop, but not both. The loading prop will be ignored.'
        )
    }
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state.bootstrapped && this.state.delayDone)
    }

    return (
      this.state.bootstrapped && this.state.delayDone 
      ? this.props.children 
      : this.props.loading
    )
  }
}
