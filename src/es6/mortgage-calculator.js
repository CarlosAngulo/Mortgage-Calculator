const mortageCalculator = (function(){

    const rangeConfig = [
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
    ]

    const _R = document.querySelectorAll('[type=range]');
    const _I = document.querySelectorAll('.controls__input');
    const _B = document.querySelectorAll('.controls__range__background');

    /**
     * Iterates over rangeConfig array to add EventListeners to the Range Input Controls
     */
    rangeConfig.forEach((item, i) => {
        updateRangeValues(item.value, i);
        _R[i].addEventListener('input', e => {
            updateRangeValues(e.target.value, i);
        }, false);
        _I[i].addEventListener('change', e => {
            updateRangeValues(e.target.value, i);
        })
    });

    /**
     * Updates the values in the range components and in the rangeConfig Object
     * @param {number} val: new values
     * @param {number} i: index
     */
    function updateRangeValues(val, i) {

        val = parseFloat(val);

        if ( val < rangeConfig[i].min || isNaN(val) ) {
            val = rangeConfig[i].min;
        }
        if ( val > rangeConfig[i].max) {
            val = rangeConfig[i].max;
        }
        
        _R[i].value = _I[i].value = rangeConfig[i].value = val;
        let leftShadow = 100*val/(rangeConfig[i].max - rangeConfig[i].min);

        _B[i].style.background =`linear-gradient(to right, #1091cc ${leftShadow}%, #CACACA ${leftShadow}%)`;
    }

    function showVal(e) {
        console.log(e)
    }

    return {
        showval: showVal
    }
})();

