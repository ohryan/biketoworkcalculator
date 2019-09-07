<template>
  <div id="app">
    <form @submit.prevent="calc" v-form>
      <label for="distance">How far do you drive to work?</label>
      <input type="number" step="0.1" id="distance" v-model="distance" v-input>
      <select name="distance-unit" id="" v-model="distanceUnit">
        <option value="km">km</option>
        <option value="mi">mi</option>
      </select>

      <label for="economy">How gas does your car use?</label>
      <input type="number" step="0.1" id="economy" v-model="economy">
      <select name="economy-unit" id="" v-model="economyUnit">
        <option value="l100">L/100km</option>
        <option value="mpg">mpg</option>
        <option value="lpk">L/km</option>
        <option value="mpgimp">mpg (imperial)</option>
      </select>

      <label for="fuel-price">How much do you pay for gas?</label>
      <input type="number" step="0.001" id="fuel-price" v-model="fuelPrice">

      🏭 <input type="number" step="0.01" v-model="carbonSaving">
      🏦 <input type="number" step="0.01" v-model="fuelSaving">
      <input type="submit" value="calculate it">
    </form>
  </div>
</template>

<script>
import { Calc } from './modules/calculator';
export default {
  name: 'app',
  data() {
    return {
      distance: null,
      distanceUnit: 'km',
      economy: null,
      economyUnit: 'l100',
      carbonConsumption: null,
      carbonSaving: 0,
      fuelConsumption: 0,
      fuelPrice: null,
      fuelSaving: 0,
    }
  },
  components: {

  },
  methods: {
    toFixed(value, decimals = 2) {
      return parseFloat(value).toFixed(decimals);
    },
    calc() {
      let economy = Calc.ecoLKm(this.economy, this.economyUnit); 
      let distance = Calc.toKm(this.distance, this.distanceUnit);
      this.fuelConsumption = this.toFixed(economy * distance);
      this.carbonConsumption = Calc.carbon(this.fuelConsumption);
      this.carbonSaving = this.toFixed(this.carbonConsumption * 2);
      this.fuelSaving = this.toFixed(this.fuelPrice * this.fuelConsumption * 2);
    }
  }
}
</script>

<style>
#app {

}
</style>
