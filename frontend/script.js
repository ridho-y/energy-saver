// Radio group functionality
$(document).ready(function(){

    const url = 'http://localhost:6578';

    let activeState = '';
    
    const fixedRateButton = $('#fixed-rate-button')
    const fixedRate = $('#fixed-rate')
    const timeOfUseButton = $('#time-of-use-button')
    const timeOfUse = $('#time-of-use');
    const calculate = $('#calculate');
    
    fixedRateButton.click(() => {
        fixedRate.css('display', 'block');
        timeOfUse.css('display', 'none');
        activeState = 'fixed-rate';
        calculate.prop('disabled', false);
    });
    
    timeOfUseButton.click(() => {
        fixedRate.css('display', 'none');
        timeOfUse.css('display', 'block');
        activeState = 'time-of-use';
        calculate.prop('disabled', false);
    });

    // Create data array from file
    async function createDataArray() {
        const data = await readXlsxFile($('#file-input').prop('files')[0]);
        return data;
    };

    calculate.click(async () => {

        const dataArray = await createDataArray();

        const getVals = new Promise((res, rej) => {
            
            let d = {
                'state': activeState,
                'dateStart': $('#date-start').val(),
                'dateEnd': $('#date-end').val(),
                'data': dataArray,
                'solarCollected': parseInt($('#solar-collected').val(), 10),
                'solarTariff': parseInt($('#solar-tariff-rate').val(), 10),
            };

            if (activeState == 'fixed-rate') {
                d = {
                    ...d,
                    'fixed-rate': parseInt($('#fixed-rate-input').val(), 10),
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

