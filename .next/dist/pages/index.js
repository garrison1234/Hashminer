'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Hashminer = require('../Hashminer');

var _Hashminer2 = _interopRequireDefault(_Hashminer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'C:\\Users\\handr\\Garrison\\Hashminer\\pages\\index.js?entry';


var PlayerIndex = function (_Component) {
  (0, _inherits3.default)(PlayerIndex, _Component);

  function PlayerIndex() {
    (0, _classCallCheck3.default)(this, PlayerIndex);

    return (0, _possibleConstructorReturn3.default)(this, (PlayerIndex.__proto__ || (0, _getPrototypeOf2.default)(PlayerIndex)).apply(this, arguments));
  }

  (0, _createClass3.default)(PlayerIndex, [{
    key: 'componentdidMount',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var playersInfo;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _Hashminer2.default.methods.getPlayersInfo().call();

              case 2:
                playersInfo = _context.sent;

                console.log(playersInfo);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentdidMount() {
        return _ref.apply(this, arguments);
      }

      return componentdidMount;
    }()
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 12
        }
      }, 'Players Info!');
    }
  }]);

  return PlayerIndex;
}(_react.Component);

exports.default = PlayerIndex;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIkhhc2htaW5lciIsIlBsYXllckluZGV4IiwibWV0aG9kcyIsImdldFBsYXllcnNJbmZvIiwiY2FsbCIsInBsYXllcnNJbmZvIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQU8sQUFBUzs7OztBQUNoQixBQUFPLEFBQWU7Ozs7Ozs7OztJQUVoQixBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQUV3QixvQkFBQSxBQUFVLFFBQVYsQUFBa0IsaUJBQWxCLEFBQW1DLEE7O21CQUF2RDtBLHVDQUVOOzt3QkFBQSxBQUFRLElBQVIsQUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQUdMLEFBQ1A7NkJBQU8sY0FBQTs7b0JBQUE7c0JBQUE7QUFBQTtBQUFBLE9BQUEsRUFBUCxBQUFPLEFBQ1I7Ozs7O0FBVHVCLEEsQUFZMUI7O2tCQUFBLEFBQWUiLCJmaWxlIjoiaW5kZXguanM/ZW50cnkiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvaGFuZHIvR2Fycmlzb24vSGFzaG1pbmVyIn0=