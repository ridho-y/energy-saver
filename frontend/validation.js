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

    // Check for valid solar collected
    const solarCollected = $('#solar-collected')
    solarCollected.blur(() => {
        console.log(parseInt(solarCollected.val(), 10));
        if (solarCollected.val() < 0) {
            invalid(solarCollected, 'Number cannot be less than zero');
        } else if (Number.isNaN(parseInt(solarCollected.val(), 10))) {
            invalid(solarCollected, 'Number is invalid');
        } else {
            solarCollected.removeClass('is-invalid');
        }
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
                console.log(i);
                
                // Check length of each row
                if (data[i].length != VALID_ROW_LENGTH) {
                    invalid(dataFile, `Row ${i} has a length of ${data[i].length} (expected ${VALID_ROW_LENGTH})`)
                    return                    
                } else {
                    // Check each row for data errors
                    for (let j = 0; j < data[i].length; j++) {
                        console.log(parseInt(data[i][j], 10));
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

});