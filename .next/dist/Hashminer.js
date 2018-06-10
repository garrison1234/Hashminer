'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _web = require('./web3');

var _web2 = _interopRequireDefault(_web);

var _Hashminer = require('./build/contracts/Hashminer.json');

var _Hashminer2 = _interopRequireDefault(_Hashminer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = new _web2.default.eth.Contract(JSON.parse(_Hashminer2.default.interface), '0x190D632Dfa964BDF8108d05F87e8e59b97931E7F');

exports.default = instance;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhhc2htaW5lci5qcyJdLCJuYW1lcyI6WyJ3ZWIzIiwiSGFzaG1pbmVyIiwiaW5zdGFuY2UiLCJldGgiLCJDb250cmFjdCIsIkpTT04iLCJwYXJzZSIsImludGVyZmFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQUFBTyxBQUFQLEFBQWlCLEFBQWpCOzs7O0FBQ0EsQUFBTyxBQUFQLEFBQXNCLEFBQXRCOzs7Ozs7QUFFQSxJQUFNLFdBQVcsSUFBSSxjQUFLLEFBQUwsSUFBUyxBQUFiLFNBQ2YsS0FBSyxBQUFMLE1BQVcsb0JBQVUsQUFBckIsQUFEZSxZQUVmLEFBRmUsQUFBakIsQUFLQTs7a0JBQWUsQUFBZiIsImZpbGUiOiJIYXNobWluZXIuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvaGFuZHIvR2Fycmlzb24vSGFzaG1pbmVyIn0=