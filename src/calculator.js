function determineDayAlloc(date) {
    // Determine season
    let season = '';
    const month = date.getMonth() + 1;
    if ([11, 12, 1, 2, 3].includes(month)) {
        season = 'summer';
    } else if ([4, 5].includes(month)) {
        season = 'autumn';
    } else if ([6, 7, 8].includes(month)) {
        season = 'winter';
    } else {
        season = 'spring';
    }

    // Determine weekday or weekend
    let wdayOrWend = '';
    const weekday = date.getDay();
    if ([0, 1, 2, 3, 4].includes(weekday)) {
        wdayOrWend = 'weekday';
    } else {
        wdayOrWend = 'weekend';
    }

    return { season, wdayOrWend };
}

function dayCost(date, dailyCharge, energyUsePerHalfHr, rate) {
    let cost = dailyCharge;

    // Convert energy use into per hour
    let energyUsePerHr = [];
    for (let i = 0; i < energyUsePerHalfHr.length; i += 2) {
        energyUsePerHr.push(energyUsePerHalfHr[i] + energyUsePerHalfHr[i + 1]);
    }

    // Get the rates
    const { season, wdayOrWend } = determineDayAlloc(date);

    const rates = Object.values(rate[season][wdayOrWend]);

    for (let idx = 0; idx < energyUsePerHr.length; idx++) {
        for (let r of rates) {
            if (r.times.includes(idx)) {
                cost += r.cost * energyUsePerHr[idx];
            }
        }
    }

    return cost;
}

export function costCalculator(data) {
    if (data.state === 'fixed-rate') {
        return fixedRateCalculator(data);
    } else if (data.state === 'time-of-use') {
        return timeOfUseCalculator(data);
    } else {
        return { error: 'Invalid calculation type' };
    }
}

function fixedRateCalculator(data) {
    const { data: dataArray, solarCollected, solarTariff, dailyCharge, fixedRate: rate } = data;
    
    let total = 0;

    for (let day of dataArray) {
        total += dailyCharge + day.reduce((acc, curr) => acc + curr, 0) * rate;
    }

    total -= solarCollected * solarTariff;

    return { total };
}

function timeOfUseCalculator(data) {
    const { data: dataArray, dateStart, solarCollected, solarTariff, dailyCharge, timeOfUse: rate } = data;
    
    let total = 0;

    let date = new Date(dateStart);
    for (let energyUsePerHalfHr of dataArray) {
        total += dayCost(date, dailyCharge, energyUsePerHalfHr, rate);
        date.setDate(date.getDate() + 1);
    }

    total -= solarCollected * solarTariff;

    return { total };
}
