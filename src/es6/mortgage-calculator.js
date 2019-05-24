const mgCalc = (function(){

    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    /**
     * Initial values set up
     */

    const RANGE_CONFIG = [
        {
            name: 'Years of mortgage',
            min: 1,
            max: 40,
            step: 1,
            value: 3
        },
        {
            name: 'Rate of interest (%)',
            min: 0.1,
            max: 10,
            step: 0.1,
            value: 3
        }
    ];

    const INPUT_VALUES = [
        {
            name: 'Loan Amount',
            value: 0,
        },
        {
            name: 'Annual Tax',
            value: 0,
        },
        {
            name: 'Annual Insurance',
            value: 0,
        },
    ];

    const RESULT_VALUES = {
        interest: 0,
        tax: 0,
        insurance: 0,
        total: 0
    }

    const MANDATORY_MESSAGE = [ 'Mandatory field', ' is mandatory' ];
    const ERROR_KEY = 'error';
    const PRISTINE_KEY = 'pristine';

    
    /**
     * Working with mediaqueries
     */
    
    let matchMobile = window.matchMedia('(max-width: 768px)');

    matchMobile.addListener( evalMobile );

    function evalMobile(x) {
        return x.matches ? true : false;
    }

    /**
     * Dom elements seeking
     */

    const _R = document.querySelectorAll('[type=range]');
    const _I = document.querySelectorAll('.controls__input');
    const _B = document.querySelectorAll('.controls__range__background');
    const _IPT = document.querySelectorAll('input.insert');
    const _IEM = document.querySelectorAll('.errormessage');
    const _RT = document.querySelector('.results-table');

    const elementOriginalHeight = _RT.scrollHeight;
    let updatedHeight = 0;

    /**
     * Iterates over rangeConfig array to add EventListeners to the Range Input Controls
     */

    RANGE_CONFIG.map( (item, i) => {
        updateRangeValues(item.value, i);
        _R[i].addEventListener('input', e => {
            updateRangeValues(e.target.value, i);
        }, false);
    });

    INPUT_VALUES.map( (item, i) => {
        _IPT[i].addEventListener('keydown', e => {
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

        if ( val < RANGE_CONFIG[i].min || isNaN(val) ) {
            val = RANGE_CONFIG[i].min;
        }
        if ( val > RANGE_CONFIG[i].max ) {
            val = RANGE_CONFIG[i].max;
        }

        _R[i].value = _I[i].value = RANGE_CONFIG[i].value = val;

        let leftShadow = 100 * val / ( RANGE_CONFIG[i].max );

        _B[i].style.background =`linear-gradient(to right, #1091cc ${leftShadow}%, #CACACA ${leftShadow}%)`;
    }

    /**
     * Validates every fieldset not to be empty
     */

    function validate() {
        let validated = true;
        _IPT.forEach( ( el, i ) => {
            if ( el.value === '' ) {
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
        
        if ( ! validate() ) {
            return;
        }
        
        _RT.classList.remove(PRISTINE_KEY);

        expandSection();

        // Calculating the Principle & Interest

        const yearsOfMortgage = RANGE_CONFIG[0].value;
        const interestRate = RANGE_CONFIG[1].value;
        const loanAmount = _IPT[0].value;

        RESULT_VALUES.interest = ((interestRate / 100 ) / 12) * loanAmount / ( 1 - Math.pow(( 1 + ((interestRate / 100) / 12)), - yearsOfMortgage * 12));

        // Calculating The tax

        RESULT_VALUES.tax = INPUT_VALUES[1].value / 12;

        // Calculating The insurance

        RESULT_VALUES.insurance = INPUT_VALUES[2].value / 12;

        // Calculating the Monthly payment

        RESULT_VALUES.total = RESULT_VALUES.interest + RESULT_VALUES.tax + RESULT_VALUES.insurance;

        for ( let id in RESULT_VALUES ) {
            document.getElementById(id).innerHTML = RESULT_VALUES[id].toFixed(2);
        }
    }

    let displacementRate = 30;

    function expandSection() {

        if ( !evalMobile(matchMobile) ||  _RT.classList.contains(PRISTINE_KEY) ) { 
            return;
        }

        if ( updatedHeight < elementOriginalHeight ) {
            updatedHeight += displacementRate;
            document.documentElement.scrollTop += displacementRate * 0.5;
            displacementRate *=  0.9;
            _RT.style.height = updatedHeight + 'px';
            window.requestAnimationFrame(expandSection);
        } else {
            _RT.style.height = null;
        }

    }

    return {
        calculate
    }

})();