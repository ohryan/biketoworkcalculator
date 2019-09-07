

export const Calc = {
    gipL: 4.54609, // imperial gallons per litre
    gpL: 3.7854,  // US gallons per litre
    mpk: 1.609344, // miles per km
    co2L: 2.3, // grams co2 produced by burning 1L gasoline. source: https://www.nrcan.gc.ca/sites/www.nrcan.gc.ca/files/oee/pdf/transportation/fuel-efficient-technologies/autosmart_factsheet_6_e.pdf
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
    carbon(consumption) {
        return consumption * this.co2L;
    }
}
