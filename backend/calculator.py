from datetime import datetime, timedelta
from helpers import dayCost

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
