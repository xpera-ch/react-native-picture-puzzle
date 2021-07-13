"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = throwOnInvalidPuzzlePieces;

var _isSquare = _interopRequireDefault(require("./isSquare"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function throwOnInvalidPuzzlePieces(pieces) {
  if (!Array.isArray(pieces)) {
    throw new Error("[PicturePuzzle]: Expected Array pieces, encountered ".concat(pieces, "."));
  } else if (!(0, _isSquare["default"])(pieces.length)) {
    throw new Error("[PicturePuzzle]: The length of pieces should be a square i.e. 4, 9, but it was ".concat(pieces.length, "."));
  }

  var _pieces$filter = pieces.filter(function (e) {
    return typeof e !== 'number' || !Number.isInteger(e);
  }),
      _pieces$filter2 = _toArray(_pieces$filter),
      piecesWhichArentIntegers = _pieces$filter2.slice(0);

  if (piecesWhichArentIntegers.length) {
    throw new Error("[PicturePuzzle]: Encountered ".concat(piecesWhichArentIntegers.length, " puzzle pieces which aren't integers: ").concat(pieces.map(function (e) {
      return JSON.stringify(e);
    }).join(','), "."));
  }

  var _sort = _toConsumableArray(pieces).sort(function (a, b) {
    return a - b;
  }),
      _sort2 = _toArray(_sort),
      sortedPieces = _sort2.slice(0);

  if (sortedPieces[0] !== 0) {
    throw new Error('[PicturePuzzle]: Pieces must be zero indexed.');
  }

  for (var i = 0; i < sortedPieces.length - 1; i += 1) {
    var a = sortedPieces[i];
    var b = sortedPieces[i + 1];

    if (b - a !== 1) {
      throw new Error('[PicturePuzzle]: Puzzle pieces must be consecutive.');
    }
  }
}