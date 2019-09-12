<template>
  <div id="app" v-bind:style="{ backgroundImage: backgroundImage }">
    <b-container id="form-container" class="my-5">
      <b-row class="pt-4 pb-2 px-4 border-bottom">
        <b-col>
          <h1>How Much Do You Save By Biking To Work?</h1>
          <p>Ever wonder how much <strong>CO2</strong> you are keeping out of the atmosphere by biking to work? Or how much <strong>cash</strong> you save by not buying gas?</p>
        </b-col>
      </b-row>
      <b-row v-if="!showResults">
        <b-form 
          class="pb-4 px-5"
          @submit.prevent="calc"
        >
          <b-form-group
            label="Distance to Work"
            label-for="distance"
          >
            <b-input-group>
              <b-input 
                type="number" 
                step="0.1" 
                id="distance" 
                v-model="distance"
                :invalid-feedback="invalidDistance"
                placeholder="one-way distance"
                tabindex="1"
                required
              ></b-input>
              <template v-slot:append>
                <b-form-select v-model="distanceUnit" :options="distanceUnitOpts" @change="switchUnits"></b-form-select>
              </template>
            </b-input-group>
          </b-form-group>
          <b-form-group
            label="Fuel Economy"
            label-for="economy"
          >
            <b-input-group>
              <b-input
                type="number"
                step="0.1"
                id="economy"
                v-model="economy"
                placeholder="your best guess"
                tabindex="2"
                required
              ></b-input>
              <template v-slot:append>
                <b-form-select v-model="economyUnit" :options="economyUnitOpts"></b-form-select>
              </template>
            </b-input-group>
          </b-form-group>
          <b-form-group
            label="Cost of Gas"
            label-for="fuel-price"
          >
            <b-input-group prepend="$">
              <b-form-input
              type="number" 
              step="0.001" 
              id="fuel-price" 
              v-model="fuelPrice" 
              placeholder="check the pump"
              tabindex="3"
              required
              ></b-form-input>
              <template v-slot:append>
                <b-form-select v-model="fuelPriceUnit" :options="fuelPriceUnitOpts" />
              </template>
            </b-input-group>
          </b-form-group>

          <b-form-group
            label="Number of Rides"
            label-for="ride-count"
          >
            <b-input-group>
              <b-form-input
              type="number"
              id="ride-count" 
              v-model="rideCount" 
              placeholder="round trips"
              tabindex="4"
              required
              autocomplete="off"
              ></b-form-input>
              <template v-slot:append>
                <b-form-select v-model="rideFreq" :options="rideFreqOpts" />
              </template>
            </b-input-group>
          </b-form-group>
          
        
          <b-button type="submit" block>🚴 calculate 🚴</b-button>
        </b-form>
      </b-row>
      <b-row class="pt-2 pb-4 px-5 mb-4 mt-4" v-else-if="showResults">
        <b-col>
          <p class="result-text">By cycling to work <strong>{{ rideCount | countToWords }} {{ rideFreq | freqToWords }}</strong> you reduce your carbon footprint by <strong>{{ carbonSavingMonthly | carbonSavingToStr }} of CO<sub>2</sub></strong> and save <strong>${{ fuelSavingMonthly }}</strong> on gas every month!</p>

          <social-sharing url="https://biketoworkcalculator.com"
            :title="socialShareStr"
            inline-template
          >
            <network network="twitter">
              <img src="./assets/Twitter_Social_Icon_Rounded_Square_Color.png" alt="tweet this">Tweet This
            </network>
          </social-sharing>
          <a @click.prevent="showForm" class="float-right">re-calculate ↩️</a>
        </b-col>
      </b-row>
      <b-row class="px-4 pb-4">
        <b-col class="text-right">
          <small><a @click.prevent="toggleAbout">About</a></small>
        </b-col>
      </b-row>
      <b-row v-if="showAbout" class="px-4 pb-4">
        <b-col>
          <h4>Methodology</h4>
          <p>There are many factors that could to considered when analyzing the carbon footprint of our actions. This tool is meant as a quick and simple way to get a general idea of the impact of cycling to work. It purposely ignores many nuanced factors that should be taking in to account when trying to devise a scientifically accurate carbon footprint, in favour a simplified form. The calculation is based on 2.29g/L of 0% ethanol gasoline. If you regularly fill up a car with 10% ethanol, you'll be saving a little less. If you drive a diesel, you'll be saving more.</p>
          <h4>About Me</h4>
          <p>I am a web developer in Winnipeg, Canada. You can find me on twitter <a href="https://twitter.com/ohryan" target="_blank">@ohryan</a> or my blog <a href="https://ohryan.ca" target="_blank">ohryan.ca</a>.</p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Calc } from './modules/calculator';

export default {
  name: 'app',
  data() {
    return {
      backgroundImage: null,
      distance: null,
      distanceUnit: 'km',
      distanceUnitOpts: [
        {value: 'km', text: 'km'},
        {value: 'mi', text: 'mi'},
      ],
      economy: null,
      economyUnit: 'l100',
      economyUnitOpts: [
        {value: 'l100', text: 'L/100km'},
        {value: 'mpg', text: 'mpg'},
        // {value: 'mpgimp', text: 'mpg (imp)'},
        // {value: 'lpk', text: 'L/km'},
      ],
      carbonProduction: null,
      carbonSaving: 0,
      carbonSavingMonthly: 0,
      fuelPriceUnit: 'l',
      fuelPriceUnitOpts: [
        {value: 'l', text: '/L'},
        {value: 'gal', text: '/gal'},
      ],
      fuelConsumptionInLitres: 0,
      fuelPrice: null,
      fuelSaving: 0,
      fuelSavingMonthly: 0,
      rideCount: null,
      rideFreq: 'wk',
      rideFreqOpts: [
        {value: 'wk', text: '/week'},
        {value: 'mo', text: '/month'},
      ],      
      showResults: false,
      showAbout: false,
    }
  },
  components: {

  },
  filters: {
    countToWords(number) {
      if (number === '1') {
        return 'once a';
      } else if (number === '2') {
        return 'twice per';
      } else if (number === '3') {
        return 'thrice per';
      } else {
        return `${number} times per`; 
      }
    },
    freqToWords(freq) {
      if (freq === 'wk') {
        return 'week';
      } else {
        return 'month';
      }
    },
    carbonSavingToStr(saving) {
      if (saving < 1000) {
        return `${saving} grams`;
      } else {
        return `${saving} kilograms`;
      }
    }
  },
  methods: {
    toFixed(value, decimals = 2) {
      return parseFloat(value).toFixed(decimals);
    },
    calc() {
      this.fuelConsumptionInLitres = Calc.fuelConsumptionInLitres(this.distance, this.distanceUnit, this.economy, this.economyUnit);
      this.carbonProduction = Calc.carbonProduction(this.fuelConsumptionInLitres);
      // total carbon savings
      this.carbonSaving = this.toFixed(this.carbonProduction * 2);
      this.fuelSaving = this.toFixed(Calc.fuelCostFromLitres(this.fuelPrice, this.fuelConsumptionInLitres, this.fuelPriceUnit)  * this.fuelConsumptionInLitres * 2);
      this.carbonSavingMonthly = this.toFixed(Calc.monthlyTotal(this.carbonSaving, this.rideCount, this.rideFreq ));
      this.fuelSavingMonthly = this.toFixed(Calc.monthlyTotal(this.fuelSaving, this.rideCount, this.rideFreq ));
      this.showResults = true;
    },
    toggleAbout(){
      this.showAbout = !this.showAbout;
    },
    showForm() {
      this.showResults = false;
    },
    switchUnits() {
      if(this.distanceUnit === 'km') {
        this.economyUnit = 'l100';
        this.fuelPriceUnit = 'l';
      } else {
        this.economyUnit = 'mpg';
        this.fuelPriceUnit = 'gal';
      }
    },
    randomBackgroundImage() {
      const srcs = [
        'alain-wong-XTm3CpqhBAQ-unsplash.jpg',
        'd-a-v-i-d-s-o-n-l-u-n-a-U6QxydYEU3Y-unsplash.jpg',
        'david-marcu-Op5JMbkOqi0-unsplash.jpg',
        'george-kedenburg-iii-zpZODBGbWcg-unsplash.jpg',
        'gordon-williams-sBkK2VWV8Kw-unsplash.jpg',
        'robin-spielmann-tLLmz54M8I8-unsplash.jpg',
        'roman-koester-v53RV9LL5y0-unsplash.jpg',
        'samuel-zeller-3CNpEqQD9jU-unsplash.jpg,'
      ];
      
      return 'url(./images/backgrounds/' + srcs[Math.floor(Math.random()*srcs.length)] + ')';
    }
  },
  computed: {
    invalidDistance() {
      if (!Number(this.distance)) {
        return 'please enter a number';
      }
      return '';
    },
    socialShareStr() {
      return 'By cycling to work ' + this.$options.filters.countToWords(this.rideCount) + 
              ' ' + 
              this.$options.filters.freqToWords(this.rideFreq) + 
              ' I reduce my carbon footprint by ' +
              this.$options.filters.carbonSavingToStr(this.carbonSavingMonthly) +
              ' of CO2 and save $' +  this.fuelSavingMonthly + ' on gas every month!!';
    }
  },
  mounted() {
    this.backgroundImage = this.randomBackgroundImage();
  }
}
</script>

<style>
textarea:focus, 
textarea.form-control:focus, 
input.form-control:focus, 
input[type=text]:focus, 
input[type=password]:focus, 
input[type=email]:focus, 
input[type=number]:focus, 
[type=text].form-control:focus, 
[type=password].form-control:focus, 
[type=email].form-control:focus, 
[type=tel].form-control:focus, 
[contenteditable].form-control:focus {
  box-shadow: none;
}

body {
  font-family: 'Rubik', sans-serif;
}

#app {
  background-color: #888;
  background-attachment:fixed;
  background-size: cover;
  background-position: center bottom;
  position: fixed;
  overflow-x: auto;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
#form-container{
  background: #fff;
  max-width: 600px
}

h1 {
  color: #3d9b35;
}

.result-text {
  font-size: 1.5em;
  line-height: 1.25em;
}

a {
  cursor: pointer;
}

span[data-link="#share-twitter"] {
  color: #00aced;
  cursor: pointer;
}
span[data-link="#share-twitter"] img {
  margin-right: 5px;
  width: 25px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
  -moz-appearance:textfield;
}

label {
  color: #666;
  margin-bottom: -0.25em;
  margin-top: 2em;
}

.form-control,
.custom-select,
.input-group-text {
  border: none;
  font-size: 2em;
  font-weight: bold;
}

.custom-select {
  text-align: right;
}

.input-group-text {
  background: none;
  padding-left: 0;
}

.form-control {
  border-bottom: 1px solid;
  border-radius: 0;
  padding: 0;
}

.form-control::placeholder {
  color: #aaa;
  font-size: 0.75em;
  font-weight: normal;
}

.btn.btn-secondary {
  border-color: #3d9b35;
  background-color: #3d9b35;
  font-size: 2em;
  margin-bottom: 0.5em;
  margin-top: 1em;
}
</style>
