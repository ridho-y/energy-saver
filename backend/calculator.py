from datetime import datetime, timedelta

COLUMNS = 48

############ HELPER FUNCTIONS ##############
def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days + 1)):
        yield start_date + timedelta(n)

def dayCost(date, hour):
    total = daily_charge

############ HELPER FUNCTIONS ##############


# MAIN FUNCTION
# MUST RETURN JSON

def calculate(type, data):
    if type == 'fixed-rate':
        return fixedRateCalculator(data)
    else:
        return {'error': 'Invalid calculation type'}


# FIXED RATE CALCULATOR
def fixedRateCalculator(data):
    dateStart, dateEnd, solarCollected, solarTariff = data['dateStart'], data['dateEnd'], data['data'], data['solarCollected'], data['solarTariff']
    

# TIME OF USE CALCULATOR

if __name__ == '__main__':
    test1 = '2022-12-01'
    test2 = '2022-12-01'

    date1 = datetime.strptime(test1, '%Y-%m-%d')
    date2 = datetime.strptime(test2, '%Y-%m-%d')
    if date2 < date1:
        print('lol')