from datetime import datetime, timedelta

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

d = '2020-02-27'
d = datetime.strptime(d, '%Y-%m-%d')
print(d)
print(d + timedelta(days=1))
print(d + timedelta(days=2))
print(d + timedelta(days=3))