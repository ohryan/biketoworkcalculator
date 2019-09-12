

export const Calc = {
    gipL: 4.54609, // imperial gallons per litre
    Lpgal: 3.7854,  // US gallons per litre
    mpk: 1.609344, // miles per km
    co2L: 2.29, // grams co2 produced by burning 1L gasoline. source: https://www.nrcan.gc.ca/sites/www.nrcan.gc.ca/files/oee/pdf/transportation/fuel-efficient-technologies/autosmart_factsheet_6_e.pdf
    // convert fuel economy to L/km
    ecoLKm(economy, economyUnit) {
        switch(economyUnit) {
            case 'l100':
                return economy / 100;
            case 'mpg':
                return 1 / ( economy * 1.609344/3.785 ); 
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

    // return fuel consumption in 
    fuelConsumptionInLitres(distance, distanceUnit, economy, economyUnit) {
        return this.ecoLKm(economy, economyUnit) * this.toKm(distance, distanceUnit);
    },
    fuelCostFromLitres(fuelCost, fuelConsumptionInLitres, fuelCostUnit) { 
        if (fuelCostUnit === 'gal') {
            return fuelCost / this.Lpgal * fuelConsumptionInLitres;
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
