import { costCalculator } from "./calculator.js";

$(document).ready(function(){

    // ToolTips
    $('[data-toggle="tooltip"]').tooltip();

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
    
    function formFilled(activeState) {

        const stndItems = '#date-start, #date-end, #solar-collected, #solar-tariff-rate, #daily-charge'
        if (activeState === 'fixed-rate') {
            const items = $(stndItems + ', #fixed-rate-input')
            let r = true
            items.each(function() {
                if ($(this).val() === '') {
                    r = false
                    return false
                }
            })
            return r;
        } else if (activeState === 'time-of-use') {
            const items = $(stndItems + ', .sum, .aut, .win, .spr')
            let r = true
            items.each(function() {
                if ($(this).val() === '') {
                    r = false
                    return false
                } 
            })
            return r
        } else {
            return false;
        }
    }

    function timeOfUseData() {

        const timeLister = (num) => {
            let times = []
            if (num.includes(',')) {
                let commsep = num.split(',');
                for (let i = 0; i < commsep.length; i++) {
                    if (commsep[i].includes('-')) {
                        let t = commsep[i].split('-')
                        for (let j = +t[0]; j <= t[1]; j++) {
                            times.push(j)
                        }
                    } else {
                        times.push(+commsep[i])
                    }
                }
            } else {
                if (num.includes('-')) {
                    let t = num.split('-')
                    for (let j = +t[0]; j <= t[1]; j++) {
                        times.push(j)
                    }
                } else {
                    times.push(+num)
                }
            }

            return times;
        }

        const data = {
            'summer': {
                'weekday': { 
                    'peak': {'cost': +$('.sum.wday.peak.cost').val(), 'times': timeLister($('.sum.wday.peak.times').val())},
                    'off-peak': {'cost': +$('.sum.wday.offp.cost').val(), 'times': timeLister($('.sum.wday.offp.times').val())},
                    'shoulder': {'cost': +$('.sum.wday.sh.cost').val(), 'times': timeLister($('.sum.wday.sh.times').val())}
                    },
                'weekend': {
                    'off-peak': {'cost': +$('.sum.wend.offp.cost').val(), 'times': timeLister($('.sum.wend.offp.times').val())},
                    'shoulder': {'cost': +$('.sum.wend.sh.cost').val(), 'times': timeLister($('.sum.wend.sh.times').val())}
                    }
                },
            'autumn': {
                'weekday': { 
                    'off-peak': {'cost': +$('.aut.offp.cost').val(), 'times': timeLister($('.aut.offp.times').val())},
                    'shoulder': {'cost': +$('.aut.sh.cost').val(), 'times': timeLister($('.aut.sh.times').val())},
                    },
                'weekend': {
                    'off-peak': {'cost': +$('.aut.offp.cost').val(), 'times': timeLister($('.aut.offp.times').val())},
                    'shoulder': {'cost': +$('.aut.sh.cost').val(), 'times': timeLister($('.aut.sh.times').val())},
                    }
                },
            'winter': {
                'weekday': { 
                    'peak': {'cost': +$('.win.wday.peak.cost').val(), 'times': timeLister($('.win.wday.peak.times').val())},
                    'off-peak': {'cost': +$('.win.wday.offp.cost').val(), 'times': timeLister($('.win.wday.offp.times').val())},
                    'shoulder': {'cost': +$('.win.wday.sh.cost').val(), 'times': timeLister($('.win.wday.sh.times').val())}
                    },
                'weekend': {
                    'off-peak': {'cost': +$('.win.wend.offp.cost').val(), 'times': timeLister($('.win.wend.offp.times').val())},
                    'shoulder': {'cost': +$('.win.wend.sh.cost').val(), 'times': timeLister($('.win.wend.sh.times').val())}
                    }
                },
            'spring': {
                'weekday': { 
                    'off-peak': {'cost': +$('.spr.offp.cost').val(), 'times': timeLister($('.spr.offp.times').val())},
                    'shoulder': {'cost': +$('.spr.sh.cost').val(), 'times': timeLister($('.spr.sh.times').val())},
                    },
                'weekend': {
                    'off-peak': {'cost': +$('.spr.offp.cost').val(), 'times': timeLister($('.spr.offp.times').val())},
                    'shoulder': {'cost': +$('.spr.sh.cost').val(), 'times': timeLister($('.spr.sh.times').val())},
                    }
                },
            }

        return data;
    }
    
    calculate.click(async () => {
        if (!formFilled(activeState)) {
            $('#fill-form').css('display', 'block')
            return
        } else {
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
                    'timeOfUse': timeOfUseData()
                }
            } else {
                throw new Error('Invalid active state');
            }
        
            res(d);
        })

        console.log(d)
        
        getVals.then(d => {
            const res = costCalculator(d)
            $('#cost').text('Your bill will cost $' + res.total.toFixed(2))
        });
    })
});
