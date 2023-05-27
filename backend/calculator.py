from datetime import datetime, timedelta
from datetime import datetime

def determineDayAlloc(date):
    
    # Determine season
    season = ''
    if date.month in [11,12,1,2,3]:
        season = 'summer'
    elif date.month in [4,5]:
        season = 'autumn'
    elif date.month in [6,7,8]:
        season = 'winter'
    else:
        season = 'spring'

    # Determine weekday or weekend
    wdayOrWend = ''
    if date.weekday() in [0,1,2,3,4]:
        wdayOrWend = 'weekday'
    else:
        wdayOrWend = 'weekend'
    
    return season, wdayOrWend

def dayCost(date, dailyCharge, energyUsePerHalfHr, rate):

    cost = dailyCharge

    # Convert energy use into per hour
    energyUsePerHr = []
    for i in range(0, len(energyUsePerHalfHr), 2):
        energyUsePerHr.append(energyUsePerHalfHr[i] + energyUsePerHalfHr[i+1])

    # Get the rates
    season, wdayOrWend = determineDayAlloc(date)
    print(rate[season][wdayOrWend])
    print()
    rates = list(rate[season][wdayOrWend].values())

    for idx, energyUseHr in enumerate(energyUsePerHr):
        for r in rates:
            if idx in r['times']:
                cost += r['cost'] * energyUseHr

    return cost

def calculate(data):
    if data['state'] == 'fixed-rate':
        return fixedRateCalculator(data)
    elif data['state'] == 'time-of-use':
        return timeOfUseCalculator(data)
    else:
        return {'error': 'Invalid calculation type'}

def fixedRateCalculator(data):

    dataArray, solarCollected, solarTariff, dailyCharge, rate = data['data'], data['solarCollected'], data['solarTariff'], data['dailyCharge'], data['fixedRate']
    
    total = 0

    for day in dataArray:
        total += dailyCharge + sum(day) * rate

    total -= solarCollected * solarTariff

    return {'total': total}


def timeOfUseCalculator(data):

    dataArray, dateStart, solarCollected, solarTariff, dailyCharge, rate = data['data'], data['dateStart'], data['solarCollected'], data['solarTariff'], data['dailyCharge'], data['timeOfUse']
    
    total = 0
    
    date = datetime.strptime(dateStart, '%Y-%m-%d')
    for energyUsePerHalfHr in dataArray:
        total += dayCost(date, dailyCharge, energyUsePerHalfHr, rate)
        date += timedelta(days=1)

    total -= solarCollected * solarTariff

    return {'total': total}
