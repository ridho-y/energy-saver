from datetime import datetime, timedelta

def calculate(data):
    if data['state'] == 'fixed-rate':
        return fixedRateCalculator(data)
    else:
        return {'error': 'Invalid calculation type'}

def fixedRateCalculator(data):
    dataArray, solarCollected, solarTariff, dailyCharge, rate = data['data'], data['solarCollected'], data['solarTariff'], data['dailyCharge'], data['fixedRate']
    
    total = 0

    for day in dataArray:
        total += dailyCharge + sum(day) * rate

    total -= solarCollected * solarTariff

    return {'total': total}

# def timeOfUseCalculator(data):



# # TIME OF USE CALCULATOR

# if __name__ == '__main__':
#     test1 = '2022-12-01'
#     test2 = '2022-12-01'

#     date1 = datetime.strptime(test1, '%Y-%m-%d')
#     date2 = datetime.strptime(test2, '%Y-%m-%d')
#     if date2 < date1:
#         print('lol')