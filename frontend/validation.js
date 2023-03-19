$(document).ready(function() {

    const VALID_ROW_LENGTH = 48;

    const invalid = (jElement, message) => {
        jElement.addClass('is-invalid');
        jElement.next().text(message);
    }

    // Check for valid dates
    const dateStart = $('#date-start')
    const dateEnd = $('#date-end')
    $('#date-end, #date-start').change(() => {
        if (dateStart != '' && (Date.parse(dateEnd.val()) < Date.parse(dateStart.val()))) {
            invalid(dateEnd, 'Start date cannot be before end date');
        } else {
            dateEnd.removeClass('is-invalid');
        }
    })

    // Check for valid solar collected, solar tariff rate and cost
    const numElement = $('#solar-collected, #solar-tariff-rate, .cost, #daily-charge');
    numElement.each(function() {
        $(this).blur(() => {
            if ($(this).val() == '') {
                $(this).removeClass('is-invalid');
            } else if ($(this).val() < 0) {
                invalid($(this), 'Number cannot be less than zero');
            } else if (Number.isNaN(parseInt($(this).val(), 10))) {
                invalid($(this), 'Number is invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        })
    })

    // Check for hour time
    const hours = $('.hour');
    hours.each(function() {
        $(this).blur(() => {
            if ($(this).val() == '') {
                $(this).removeClass('is-invalid');
            } else if ($(this).val() < 0 || $(this).val() > 23 || !Number.isInteger(+$(this).val())) {
                invalid($(this), 'Hour cannot be less than 0 or greater than 23, and must be an integer');
            } else if (Number.isNaN(parseInt($(this).val(), 10))) {
                invalid($(this), 'Number is invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        })
    })

    // Check for valid data
    const dataFile = $('#file-input')
    $('#file-input, #date-start, #date-end').change(async () => {

        if (dateStart.val() != '' && dateEnd.val() != '' && $('#file-input').prop('files').length != 0) {
            const data = await readXlsxFile($('#file-input').prop('files')[0]);
            const future = moment(dateEnd.val());
            const start = moment(dateStart.val());
            const days = future.diff(start, 'days') + 1;
            
            for (let i = 0; i < data.length; i++) {
                
                // Check length of each row
                if (data[i].length != VALID_ROW_LENGTH) {
                    invalid(dataFile, `Row ${i} has a length of ${data[i].length} (expected ${VALID_ROW_LENGTH})`)
                    return                    
                } else {
                    // Check each row for data errors
                    for (let j = 0; j < data[i].length; j++) {
                        if (Number.isNaN(parseInt(data[i][j], 10))) {
                            invalid(dataFile, `Invalid data in row ${i} column ${j}`)
                            return
                        } else {
                            dataFile.removeClass('is-invalid');
                        }
                    }
                }
            }

            // Check length of array
            if (days != data.length) {
                invalid(dataFile, `Number of rows in file (rows = ${data.length}) does not correspond to the date period (days = ${days})`)
            } else {
                dataFile.removeClass('is-invalid');
            }
        }        
    })

    // Check for valid hours
    const times = $('.times')
    times.each(function() {
        $(this).blur(() => {
            if ($(this).val() == '') {
                $(this).removeClass('is-invalid');
            } else if (!/^(\d{1,2}(-\d{1,2})?)(,(\d{1,2}(-\d{1,2})?))*$/.test($(this).val())) {
                invalid($(this), 'Invalid input, does not match regex ^(\\d{1,2}(-\\d{1,2})?)(,(\\d{1,2}(-\\d{1,2})?))*$');
            } else {
                $(this).removeClass('is-invalid');
            }
        })
    })

    const checkTimes = (section) => {

        // Check if the input fields for a section are empty
        let empty = false
        section.each(function () {
            if ($(this).val() == '') {
                empty = true
            }
        })

        if (empty) {
            return
        }

        const numChecker = (times, jElement, num) => {
            if (times == null) {
                return null
            }

            if (num.includes('-')) {
                let range = num.split('-')
                if (range[0] >= range[1]) {
                    invalid(jElement, 'Num1-Num2: Num1 cannot be lesser than or equal to Num2');
                    return null;
                } else if (range[0] < 0 || range[0] > 23 || range[1] < 0 || range[1] > 23) {
                    invalid(jElement, 'Time cannot be less than 0 or greater than 23');
                    return null;
                } else {
                    jElement.removeClass('is-invalid')
                    for (let i = parseInt(range[0], 10); i <= range[1]; i++) {
                        times.push(i)
                    }
                }
            } else {
                // SAME
                if (num < 0 || num > 23) {
                    invalid(jElement, 'Time cannot be less than 0 or greater than 23');
                    return null;
                } else {
                    jElement.removeClass('is-invalid')
                    times.push(parseInt(num, 10))
                }
            }
            return times;
        }

        // Check each input
        let times = []
        section.each(function () {
            if ($(this).val().includes(',')) {
                let commsep = $(this).val().split(',')
                for (let i = 0; i < commsep.length; i++) {
                    times = numChecker(times, $(this), commsep[i])
                    if (times == null) {
                        return
                    }
                }
            } else {
                times = numChecker(times, $(this), $(this).val())
                if (times == null) {
                    return
                }
            }
        })

        // Compare times
        times = times.sort((a,b) => a-b);
        if (JSON.stringify(times) != JSON.stringify([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])) {
            invalid(section.parent().parent(), 'Invalid times (times may be overlapping or missing)')
        } else {
            section.parent().parent().removeClass('is-invalid');
        }

    }

    const timesToCheck = ['.sum.wday.times', '.sum.wend.times'];
    timesToCheck.forEach((t) => {
        let section = $(t)
        section.each(function() {
            $(this).blur(() => {
                checkTimes(section)
            })
        })
    })
});