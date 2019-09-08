

export const Calc = {
    gipL: 4.54609, // imperial gallons per litre
    gpL: 3.7854,  // US gallons per litre
    mpk: 1.609344, // miles per km
    co2L: 2.29, // grams co2 produced by burning 1L gasoline. source: https://www.nrcan.gc.ca/sites/www.nrcan.gc.ca/files/oee/pdf/transportation/fuel-efficient-technologies/autosmart_factsheet_6_e.pdf
    // convert fuel economy to L/km
    ecoLKm(economy, economyUnit) {
        switch(economyUnit) {
            case 'l100':
                return economy / 100;
            case 'mpg':
                return economy / 2.825;
        }
    },
    toKm(distance, distanceUnit) {
        switch(distanceUnit) {
            case 'km': 
                return distance;
            case 'mi':
                return distance * this.mpk;
        }
    },
    fuelPricePerLitre(fuelPrice, fuelPriceUnit) {
        if (fuelPriceUnit === 'gal') {
            return fuelPrice * this.gpL;
        }

        return fuelPrice;
    },
    // return fuel consumption in 
    fuelConsumptionInLitres(distance, distanceUnit, economy, economyUnit) {
        if (distanceUnit === 'km' && economyUnit == 'l100') {
            return (distance / 100) * economy;
        } else if (distanceUnit === 'km' && economyUnit === 'mpg') {
            return (distance / this.mpk) * economy / this.gpL;
        } else if (distanceUnit === 'mi' && economyUnit === 'l100') {
            return (distance * this.mpk / 100) * economy;
        } else if (distanceUnit === 'mi' && economyUnit === 'mpg') {
            return distance / economy / this.gpL;
        }
    },
    fuelCostFromLitres(fuelCost, fuelConsumptionInLitres, economyUnit) {
        if (economyUnit === 'gal') {
            return fuelCost / this.gpL * fuelConsumptionInLitres;
        }
        
        return fuelCost * fuelConsumptionInLitres;
    },
    // amount of carbon produced in grams
    carbonProduction(fuelConsumptionInLitres) {
        return fuelConsumptionInLitres * this.co2L;
    },
    monthlyTotal(value,frequency, period) {
        if (period === 'wk') {
            return value * frequency * 4;
        } else {
            return value * frequency;
        }
    }
}
