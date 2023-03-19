$(document).ready(function(){

    const url = 'http://localhost:6578';
    let activeState = ''

    const fixedRateButton = $('#fixed-rate-button')
    const fixedRate = $('#fixed-rate')
    const timeOfUseButton = $('#time-of-use-button')
    const timeOfUse = $('#time-of-use');
    const calculate = $('#calculate');
    
    fixedRateButton.click(() => {
        fixedRate.css('display', 'block');
        timeOfUse.css('display', 'none');
        activeState = 'fixed-rate';
    });
    
    timeOfUseButton.click(() => {
        fixedRate.css('display', 'none');
        timeOfUse.css('display', 'block');
        activeState = 'time-of-use';
    });

    // Create data array from file
    async function createDataArray() {
        const data = await readXlsxFile($('#file-input').prop('files')[0]);
        return data;
    };
    
    function ensureFormFilled(activeState) {
        console.log('ensure')
        const stndItems = '#date-start, #date-end, #solar-collected, #solar-tariff-rate, #daily-charge'
        if (activeState == 'fixed-rate') {
            console.log('fixed-rate')
            const items = $(stndItems + ', #fixed-rate-input')
            let r = true;
            items.each(function() {
                // console.log($(this))
                if ($(this).val() == '') {
                    r = false;
                    return false
                }
            })
            return r;
        } else {
            return false;
        }
    }
    
    calculate.click(async () => {

        if (!ensureFormFilled(activeState)) {
            $('#fill-form').css('display', 'block')
            console.log('poo')
            return
        } else {
            console.log('no')
            $('#fill-form').css('display', 'none')
        }

        const dataArray = await createDataArray();

        const getVals = new Promise((res, rej) => {
            
            let d = {
                'state': activeState,
                'dateStart': $('#date-start').val(),
                'dateEnd': $('#date-end').val(),
                'data': dataArray,
                'solarCollected': +$('#solar-collected').val(),
                'solarTariff': +$('#solar-tariff-rate').val(),
                'dailyCharge': +$('#daily-charge').val(),
            };

            if (activeState == 'fixed-rate') {
                d = {
                    ...d,
                    'fixedRate': +$('#fixed-rate-input').val(),
                }
            } else if (activeState == 'time-of-use') {
                d = {
                    ...d,
                }
            } else {
                throw new Error('Invalid active state');
            }
        
            res(d);
        })
        
        getVals.then(d => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                },
                body: JSON.stringify(d)
            }).then(res => res.json())
            .then(res => console.log(res))
            .catch((e) => {
                throw new Error(e);
            })
        });
    })



});
