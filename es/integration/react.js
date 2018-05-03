var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PureComponent } from 'react'; // eslint-disable-line import/no-unresolved
// eslint-disable-line import/no-unresolved


export var PersistGate = function (_PureComponent) {
  _inherits(PersistGate, _PureComponent);

  function PersistGate(props) {
    _classCallCheck(this, PersistGate);

    var _this = _possibleConstructorReturn(this, (PersistGate.__proto__ || Object.getPrototypeOf(PersistGate)).call(this, props));

    _this.handlePersistorState = function () {
      var persistor = _this.props.persistor;

      var _persistor$getState = persistor.getState(),
          bootstrapped = _persistor$getState.bootstrapped;

      if (bootstrapped) {
        if (_this.props.onBeforeLift) {
          Promise.resolve(_this.props.onBeforeLift()).then(function () {
            return _this.setState({ bootstrapped: true });
          }).catch(function () {
            return _this.setState({ bootstrapped: true });
          });
        } else {
          _this.setState({ bootstrapped: true });
        }
        _this._unsubscribe && _this._unsubscribe();
      }
    };

    _this.state = {
      bootstrapped: false,
      delayDone: !props.delaySeconds
    };
    return _this;
  }

  _createClass(PersistGate, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleDelay();

      this._unsubscribe = this.props.persistor.subscribe(this.handlePersistorState);
      this.handlePersistorState();
    }
  }, {
    key: 'handleDelay',
    value: function handleDelay() {
      var _this2 = this;

      console.log('[PG handleDelay] gonna wait ' + this.props.delaySeconds + ' s');
      if (this.props.delaySeconds) {
        setTimeout(function () {
          console.log('[PG handleDelay timeout] waited ' + _this2.props.delaySeconds + ' s');
          _this2.setState({ delayDone: true });
        }, this.props.delaySeconds * 1000);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unsubscribe && this._unsubscribe();
    }
  }, {
    key: 'render',
    value: function render() {
      console.log({ me: "PG RENDER", state: this.state, d: this.props.delaySeconds });

      if (process.env.NODE_ENV !== 'production') {
        if (typeof this.props.children === 'function' && this.props.loading) console.error('redux-persist: PersistGate expects either a function child or loading prop, but not both. The loading prop will be ignored.');
      }
      if (typeof this.props.children === 'function') {
        return this.props.children(this.state.bootstrapped && this.state.delayDone);
      }

      return this.state.bootstrapped && this.state.delayDone ? this.props.children : this.props.loading;
    }
  }]);

  return PersistGate;
}(PureComponent);
PersistGate.defaultProps = {
  loading: null,
  delaySeconds: 0
};