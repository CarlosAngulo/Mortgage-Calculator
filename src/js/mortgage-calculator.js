"use strict";

var mgCalc = function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  /**
   * Initial values set up
   */

  var RANGE_CONFIG = [{
    name: 'Years of mortgage',
    min: 1,
    max: 40,
    step: 1,
    value: 3
  }, {
    name: 'Rate of interest (%)',
    min: 0.1,
    max: 10,
    step: 0.1,
    value: 3
  }];
  var INPUT_VALUES = [{
    name: 'Loan Amount',
    value: 0
  }, {
    name: 'Annual Tax',
    value: 0
  }, {
    name: 'Annual Insurance',
    value: 0
  }];
  var RESULT_VALUES = {
    interest: 0,
    tax: 0,
    insurance: 0,
    total: 0
  };
  var MANDATORY_MESSAGE = ['Mandatory field', ' is mandatory'];
  var ERROR_KEY = 'error';
  var PRISTINE_KEY = 'pristine';
  /**
   * Working with mediaqueries
   */

  var matchMobile = window.matchMedia('(max-width: 768px)');
  matchMobile.addListener(evalMobile);

  function evalMobile(x) {
    return x.matches ? true : false;
  }
  /**
   * Dom elements seeking
   */


  var _R = document.querySelectorAll('[type=range]');

  var _I = document.querySelectorAll('.controls__input');

  var _B = document.querySelectorAll('.controls__range__background');

  var _IPT = document.querySelectorAll('input.insert');

  var _IEM = document.querySelectorAll('.errormessage');

  var _RT = document.querySelector('.results-table');

  var elementOriginalHeight = _RT.scrollHeight;
  var updatedHeight = 0;
  /**
   * Iterates over rangeConfig array to add EventListeners to the Range Input Controls
   */

  RANGE_CONFIG.map(function (item, i) {
    updateRangeValues(item.value, i);

    _R[i].addEventListener('input', function (e) {
      updateRangeValues(e.target.value, i);
    }, false);
  });
  INPUT_VALUES.map(function (item, i) {
    _IPT[i].addEventListener('keydown', function (e) {
      e.target.classList.remove(ERROR_KEY);
      _IEM[i].innerHTML = '';
    });
  });
  /**
   * Updates the values in the range components and in the rangeConfig Object
   * @param {number} val: new values
   * @param {number} i: index
   */

  function updateRangeValues(val, i) {
    val = parseFloat(val);

    if (val < RANGE_CONFIG[i].min || isNaN(val)) {
      val = RANGE_CONFIG[i].min;
    }

    if (val > RANGE_CONFIG[i].max) {
      val = RANGE_CONFIG[i].max;
    }

    _R[i].value = _I[i].value = RANGE_CONFIG[i].value = val;
    var leftShadow = 100 * val / RANGE_CONFIG[i].max;
    _B[i].style.background = "linear-gradient(to right, #1091cc ".concat(leftShadow, "%, #CACACA ").concat(leftShadow, "%)");
  }
  /**
   * Validates every fieldset not to be empty
   */


  function validate() {
    var validated = true;

    _IPT.forEach(function (el, i) {
      if (el.value === '') {
        el.classList.add(ERROR_KEY);
        _IEM[i].innerHTML = evalMobile(matchMobile) ? MANDATORY_MESSAGE[0] : INPUT_VALUES[i].name + MANDATORY_MESSAGE[1];
        validated = false;
      } else {
        INPUT_VALUES[i].value = el.value;
      }
    });

    return validated;
  }

  function calculate() {
    if (!validate()) {
      return;
    }

    _RT.classList.remove(PRISTINE_KEY);

    expandSection(); // Calculating the Principle & Interest

    var yearsOfMortgage = RANGE_CONFIG[0].value;
    var interestRate = RANGE_CONFIG[1].value;
    var loanAmount = _IPT[0].value;
    RESULT_VALUES.interest = interestRate / 100 / 12 * loanAmount / (1 - Math.pow(1 + interestRate / 100 / 12, -yearsOfMortgage * 12)); // Calculating The tax

    RESULT_VALUES.tax = INPUT_VALUES[1].value / 12; // Calculating The insurance

    RESULT_VALUES.insurance = INPUT_VALUES[2].value / 12; // Calculating the Monthly payment

    RESULT_VALUES.total = RESULT_VALUES.interest + RESULT_VALUES.tax + RESULT_VALUES.insurance;

    for (var id in RESULT_VALUES) {
      document.getElementById(id).innerHTML = RESULT_VALUES[id].toFixed(2);
    }
  }

  var displacementRate = 30;

  function expandSection() {
    if (!evalMobile(matchMobile) || _RT.classList.contains(PRISTINE_KEY)) {
      return;
    }

    if (updatedHeight < elementOriginalHeight) {
      updatedHeight += displacementRate;
      document.documentElement.scrollTop += displacementRate * 0.5;
      displacementRate *= 0.9;
      _RT.style.height = updatedHeight + 'px';
      window.requestAnimationFrame(expandSection);
    } else {
      _RT.style.height = null;
    }
  }

  return {
    calculate: calculate
  };
}();