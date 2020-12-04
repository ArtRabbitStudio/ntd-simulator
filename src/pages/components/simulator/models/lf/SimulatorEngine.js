import { subtract } from 'mathjs'

import { Random } from 'pages/components/simulator/helpers/sim'
import SessionStorage from 'pages/components/simulator/helpers/sessionStorage';
import DiseaseModels from 'pages/components/simulator/models/DiseaseModels';
import { DISEASE_LIMF } from 'AppConstants';

export var s = new Random();

export var SessionData = {

  convertRun: (m, endemicity) => {
    //convert model object to JSON for run.
    return {
      ts: m.ts,
      Ms: m.Ms,
      Ws: m.Ws,
      Ls: m.Ls,
      reductionYears: m.reductionYears(),
      nRounds: m.nRounds(),
      endemicity: endemicity,
    }
  },

  nRounds: (i) => {
    console.log( `SessionData.nRounds calling SessionStorage.fetchScenarioAtIndex( ${i} )` );
    var scen = SessionStorage.fetchScenarioAtIndex( i );
    var n = scen.results.length
    var rounds = []
    for (var j = 0; j < n; j++) {
      rounds.push(scen.results[j].nRounds)
    }
    return rounds
  },

  reductions: (i, yr, endemicity) => {
    console.log( `SessionData.reductions calling SessionStorage.fetchScenarioAtIndex( ${i} )` );
    var scen = SessionStorage.fetchScenarioAtIndex( i );
    var n = scen.results.length
    var red = 0
    var nn = 0
    for (var j = 0; j < n; j++) {
      if (endemicity) {
        if (scen.results[j].endemicity === endemicity) {
          red += scen.results[j].reductionYears[yr]
          nn += 1
        }
      } else {
        red += scen.results[j].reductionYears[yr]
        nn += 1
      }
    }
    return red / nn
  },

  ran: (i) => {
    try {
      console.log( `SessionData.ran calling SessionStorage.fetchScenarioAtIndex( ${i} )` );
      var scen = SessionStorage.fetchScenarioAtIndex( i );
      if (scen.results.length > 0) {
        return true
      } else {
        return false
      }
    }

    catch ( error ) {
      return false;
    }
  }

};

export var Person = function (a, b) {
  /* eslint-disable */
  //constructor(a,b) {
  this.b = s.gamma(a, b)
  this.M = 0.5
  this.W = 0
  this.WM = 0
  this.WF = 0
  this.I = 0
  this.bednet = 0
  this.t = 0
  this.u = s.normal(params.u0, Math.sqrt(params.sigma))
  this.a = s.random() * 100 * 12
  //}

  this.repRate = function () {
    if (params.nu === 0) {
      if (this.WM > 0) {
        return params.alpha * this.WF
      } else {
        return 0.0
      }
    } else {
      return params.alpha * Math.min(this.WF, (1 / params.nu) * this.WM)
    }
  }

  this.biteRate = function () {
    if (this.a < 108.0) {
      //less than 9 * 12 = 108.0
      return this.a / 108.0
    } else {
      return 1.0
    }
  }

  this.react = function () {
    var bNReduction = 1 - (1 - params.sN) * this.bedNet
    //immune state update
    if(Number.isNaN(bNReduction)){
      bNReduction = 1
    }
    //I +=  (param->dt) *( (double) W - param->z * I);
    this.I = statFunctions.immuneRK4Step(this.W, this.I)
    //male worm update
    var births = statFunctions.poisson(
      0.5 *
        bNReduction *
        params.xi *
        this.biteRate() *
        params.L3 *
        Math.exp(-1 * params.theta * this.I) *
        this.b *
        params.dt
    ) //exp(-1 * beta * I)
    //births = param->poisson_dist(0.5 * param->xi  * biteRate() * param->L3 * exp(-1 * param->theta * I) * b *  param->dt); //exp(-1 * beta * I)
    var deaths = statFunctions.poisson(params.mu * this.WM * params.dt)
    this.WM += births - deaths

    //female worm update
    births = statFunctions.poisson(
      0.5 *
        bNReduction *
        params.xi *
        this.biteRate() *
        params.L3 *
        Math.exp(-1 * params.theta * this.I) *
        this.b *
        params.dt
    )
    deaths = statFunctions.poisson(params.mu * this.WF * params.dt)
    this.WF += births - deaths

    // Panayiota: adding in fecRed parameter looks like it changes the calculation of M in this way.
    // Is this right?

    //this.M += params.dt * (this.repRate() - params.gamma * this.M)
    var x = 1
    if (this.treated > 0) {
      x = 0
    }
    // this.M += params.dt * (this.repRate() *(1.0 - this.treated) - params.gamma * this.M)
    this.M += params.dt * (this.repRate() * x - params.gamma * this.M)

    this.treated = this.treated - 1
    //M += param->dt * (repRate() - param->gamma * M);
    //total worm count
    this.W = this.WM + this.WF
    //time-step
    this.t += params.dt
    this.a += params.dt
    //ensure all positive state variables remain positive
    if (this.W < 0) {
      this.W = 0
    }
    if (this.WM < 0) {
      this.WM = 0
    }
    if (this.WF < 0) {
      this.WF = 0
    }
    if (this.I < 0) {
      this.I = 0.0
    }
    if (this.M < 0) {
      this.M = 0.0
    }
    // add in the function where we use the aImp variable.
    if (Math.random() < 1 - Math.exp(-1.0 * params.aImp * params.dt)) {
      // randomImportation();

      // Panayiota: I'm not sure that I understand what the randomImportation function is doing. It seems to me to be randomly
      // setting the number of worms in a person to some value (shown below), if the importation criteria is met
      // based on the value of aImp. Is this what you want?
      this.WM = (0.5 * params.xi * this.biteRate() * 10.0) / params.mu
      this.WF = (0.5 * params.xi * this.biteRate() * 10.0) / params.mu
      this.M = 0
    }

    //simulate event where host dies and is replaced by a new host.
    if (
      Math.random() < 1 - Math.exp(-1 * params.tau * params.dt) ||
      this.a > 1200.0
    ) {
      //if over age 100
      this.initialise()
    }
  }

  this.initialise = function () {
    this.W = 0
    this.WM = 0
    this.WF = 0
    this.I = 0.0
    this.M = 0.0 //0
    this.bedNet = 0
    this.u = s.normal(params.u0, Math.sqrt(params.sigma))
    this.treated = 0
    this.a = 0 //birth event so age is 0.
  }
}
export var Model = function (n) {
  /* eslint-disable */
  //constructor(n){

  this.sU = 0
  this.sB = 0
  this.sN = 0
  this.people = []
  this.n = n
  this.bedNetInt = 0
  this.ts = []
  this.Ms = []
  this.Ws = []
  this.Ls = []
  for (var i = 0; i < n; i++) {
    this.people.push(new Person(params.a, params.b))
  }
  //}

  this.saveOngoing = function (t, mp, wp, lp) {
    lp = 1 - Math.exp(-lp) //convert to a prevalence
    this.ts.push(t)
    this.Ms.push(mp * 100) //convert all to percentages.
    this.Ws.push(wp * 100)
    this.Ls.push(lp * 100)
  }

  this.L3 = function () {
    var mf = 0.0
    var bTot = 0.0
    for (var i = 0; i < this.n; i++) {
      //mf += param->kappas1 * pow(1 - exp(-param->r1 *( host_pop[i].mfConc() * host_pop[i].b)/param->kappas1), 2.0);
      mf += this.people[i].b * statFunctions.L3Uptake(this.people[i].M)
      bTot += this.people[i].b

    }
    
    mf = mf / bTot //(double) n;
    var bedNetCov = this.bedNetCoverage()
    return (
      (mf *
        (1 + this.bedNetInt * bedNetCov * (params.sN - 1)) *
        params.lbda *
        params.g) /
      (params.sig + params.lbda * params.psi1)
    )
  }

  this.prevalence = function () {
    var p = 0
    for (var i = 0; i < this.n; i++) {
      p += s.random() < 1 - Math.exp(-this.people[i].M)
    }
    return p / this.n
  }

  this.aPrevalence = function () {
    var p = 0
    for (var i = 0; i < this.n; i++) {
      p += this.people[i].W > 0
    }
    return p / this.n
  }

  this.MDAEvent = function () {
    for (var i = 0; i < this.n; i++) {
      if (s.normal(this.people[i].u, 1) < 0) {
        this.people[i].M = params.mfPropMDA * this.people[i].M
        this.people[i].WM = Math.floor(params.wPropMDA * this.people[i].WM)
        this.people[i].WF = Math.floor(params.wPropMDA * this.people[i].WF)
        this.people[i].treated = params.fecRed
      }
    }
  }
  
  this.bedNetCoverage = function(){
    var nts = 0.0
    for (var i = 0; i < this.n; i++) {
      //mf += param->kappas1 * pow(1 - exp(-param->r1 *( host_pop[i].mfConc() * host_pop[i].b)/param->kappas1), 2.0);
      nts += this.people[i].bednet
    }
    return(nts/this.n)
  }
  
  this.bedNetEvent = function () {
    params.sig = params.sig + params.lbda * params.dN * params.covN
    var bedNetInc = (params.covN - params.covNOld) * this.n
    if (bedNetInc > 0) {
      var bednetProb =
        ((params.covN - params.covNOld) * this.n) / (params.covN * this.n)
      for (var i = 0; i < this.n; i++) {
        if ((this.people[i].bedNet = 0)) {
          if (s.random() < bednetProb) {
            //param->uniform_dist()<param->covMDA
            this.people[i].bedNet = 1 //using bed-net
          }
        }
      }
    }
    if (bedNetInc < 0) {
     // var bednetProb =
      bednetProb =
        ((params.covNOld - params.covN) * this.n) / (params.covNOld * this.n)
      for (var j = 0; j < this.n; j++) {
        if ((this.people[j].bedNet = 1)) {
          if (s.random() < bednetProb) {
            //param->uniform_dist()<param->covMDA
            this.people[j].bedNet = 0 //using bed-net
          }
        }
      }
    }
  }

  this.bedNetEventInit = function () {
    params.sig = params.sig + params.lbda * params.dN * params.covN
    for (var i = 0; i < this.n; i++) {
      if (s.random() < params.covN) {
        //param->uniform_dist()<param->covMDA
        this.people[i].bedNet = 1 //using bed-net
      } else {
        this.people[i].bedNet = 0 //not using bed-net
      }
    }
  }

  this.nRounds = function () {
    var inds = []
    for (var i = 0; i < this.Ms.length; i++) {
      if (this.Ms[i] < 1.0) {
        inds.push(i)
      }
    }
    if (params.mdaFreq === 12) {
      return Math.floor(this.ts[inds[0]])
    } else {
      return Math.floor(2 * this.ts[inds[0]])
    }
  }

  this.reduction = function (yr) {
    var myr = yr * 6
    return this.Ms[myr] / this.Ms[0]
  }

  this.reductionYears = function () {
    var ryrs = []
    for (var yr = 0; yr < 31; yr++) {
      ryrs.push(this.reduction(yr))
    }
    return ryrs
  }

  this.evolveAndSaves = function (tot_t, mdaJSON, paramsNumber, parDict) {
  //  console.log("mdaObj = ", simControler.mdaObj)
    // console.log("v_to_h = ", params.v_to_h)
    // console.log("shapeRisk = ", params.shapeRisk)
    // console.log("params.aImp = ", params.aImp)
    var aImp_old = params.aImp
    // params.v_to_h = 42.7197
    // params.v_to_h_original = params.v_to_h_original
    // params.shapeRisk = 0.208
    // params.aImp = 0.000048
    // console.log("v_to_h = ", params.v_to_h)
    // console.log("shapeRisk = ", params.shapeRisk)
    // console.log("params.aImp = ", params.aImp)


    // console.log("shapeRisk = ", params.shapeRisk)
    // console.log("params.aImp = ", params.aImp)
    var t = 0
    var icount = 0
    var maxMDAt = 1200.0
    var maxoldMDAt //used in triple drug treatment.

    // location to take in the json from the file
    // var myJSON = '{"time":[60, 96, 120,144, 180], "coverage":[0.9, 0.9,0.9,0.9,0.9], "adherence" : [1, 1, 1, 1, 1]}';
    // var mdaJSON = JSON.parse(myJSON);
    //
    // // set mda round
    var mdaRound = 0
    // how many mda's will we do and when will the next one be
    // console.log(simControler.mdaObj)
    var numMDA = simControler.mdaObj.time.length

    // next mda will occur at 12000 + the initial time given in the mdaObj
    var nextMDA = 1200 + simControler.mdaObj.time[mdaRound]

    //update the Intervention parameters, covMDA, rho, mfPropMDA, wPropMDA and covN
    statFunctions.updateInterventionParams(mdaRound)

    // params.covMDA = simControler.mdaObj.coverage[mdaRound] / 100
    // params.rho = simControler.mdaObj.adherence[mdaRound] / 100
    params.sigma = params.rho / (1 - params.rho)
    params.u0 =
      -statFunctions.NormSInv(params.covMDA) * Math.sqrt(1 + params.sigma)
    // add z values for our normally distributed value of u, therefore when the parameters of the normal change,
    // we can easily map these values to corresponding z values for the new normal distribution
    var z_values = []
    for (var i = 0; i < this.n; i++) {
      this.people[i].u = s.normal(params.u0, Math.sqrt(params.sigma))
      // x = (this.people[i].u - params.u0)/Math.sqrt(params.sigma)
      z_values.push((this.people[i].u - params.u0) / Math.sqrt(params.sigma))
    }
    this.bedNetInt = 0

    // add a parameter to flag when we update parameters
    // this is assuming that the "historic" portion of the simulation begins after 100 years,
    // before that we are running to an equilibrium starting point.
    var paramsUpdate = 1200

    // add a parameter to access the aImp historic entry
    var aImpYear = 2000

    for (var j = 0; j < this.n; j++) {
      //infect everyone initially.
      //this.people[i].WM = 1;
      //this.people[i].WF = 1;
      this.people[j].M = 1.0
    }

    if (params.IDAControl === 1) {
      //if switching to IDA after five treatment rounds.
      maxoldMDAt = 1200.0 + 5.0 * params.mdaFreq
    } else {
      maxoldMDAt = 2 * maxMDAt //this just makes maxoldMDAt larger than total treatment time so there is never a switch.
    }

    //double currentL3 = 0.5;
    //console.log("mosquito species: ", params.mosquitoSpecies, "\n");
    params.L3 = 5.0
    // console.log("0----------100\n-");
    while (t < tot_t * 12.0) {
      //for 100 years update annually, then update monthly when recording and intervention is occuring.
      if (t < 960.0) {
        //1200.0
        params.dt = 12.0
      } else {
        params.dt = 1.0
      }
      if(t < 13){
        params.dt = 1.0
      }
      for (var j = 0; j < this.n; j++) {
        this.people[j].react()
      }

      //update
      t = this.people[0].t
      if (t < 12.0 * 80.0) {
        params.L3 = 2.0
      } else {
        params.L3 = this.L3()
      }
      params.L3 = this.L3()
      if (t % 2 == 0 && t < Math.floor(t) + params.dt) {
        //cout << "t = " << (double) t/12.0 << "\n";
        this.saveOngoing(
          t / 12.0,
          this.prevalence(),
          this.aPrevalence(),
          params.L3
        )
      }
      if (
        Math.floor(t) % Math.floor((tot_t * 12.0) / 10.0) == 0 &&
        t < Math.floor(t) + params.dt
      ) {
      }
      if (t >= 1200.0 && t < 1200.0 + params.dt) {

    //    console.log("v_to_h222 = ", params.v_to_h)
    //    console.log("shapeRisk222 = ", params.shapeRisk)
    //    console.log("params.aImp222 = ", params.aImp)
    //    console.log("Initial bednet coverage = ", params.covN)
        this.bedNetEventInit()
        this.bedNetInt = 1
      }
      //  adding in the use of the fecRed parameter.
      //if ((Math.round(t) % 12 > params.fecRed)){
      //After effects of MDA wear off reset to 0.

      // // reduce value of treated by 1 each month
      // for (int i = 0; i < this.n; i++){
      //    this.people[i].treated = this.people[i].treated - 1;
      // }
      //}

      // if we are at the point in time to update the parameters, then do it,
      // and update the time for the next parameters update, and the "column" to look in
      //for the next set of parameters
      //if (t >= paramsUpdate){
      if (t >= paramsUpdate && aImpYear < 2020) {
        // update yearly parameters for MDA and aImp here.
        statFunctions.updateSimParams(aImpYear, paramsNumber)
        paramsUpdate += 12.0
        aImpYear += 1
      }
      if (t >= 1200 + 20 * 12) {
        params.aImp = 0
      }

      if (t >= nextMDA) {
        this.MDAEvent()
        this.bedNetEvent()
        statFunctions.setBR(true) //intervention true.
        statFunctions.setVH(true)
        statFunctions.setMu(true)
        if (mdaRound <= numMDA) {
          // if we haven't done all the mda's yet,
          // update the mda round and the time for the next one
          mdaRound += 1
          nextMDA = 1200 + simControler.mdaObj.time[mdaRound]
          //update the Intervention parameters, covMDA, rho, mfPropMDA, wPropMDA and covN
          statFunctions.updateInterventionParams(mdaRound)
          // params.covMDA = simControler.mdaObj.coverage[mdaRound] / 100
          // params.rho = simControler.mdaObj.adherence[mdaRound] / 100
          params.sigma = params.rho / (1 - params.rho)
          params.u0 =
            -statFunctions.NormSInv(params.covMDA) * Math.sqrt(1 + params.sigma)

          for (i = 0; i < this.n; i++) {
            this.people[i].u = z_values[i] * Math.sqrt(params.sigma) + params.u0
          }
        }
        // if we have performed all the mda's already, then set the next mda time to infinity,
        // so we will never check for mda's again
        else {
          nextMDA = Infinity
        }
      }

      if(aImp_old != params.aImp){
        parDict.push({aImp:params.aImp,
        t:t})
      }
      aImp_old = params.aImp
      //
      // if (t >= nextMDA) {
      //   this.MDAEvent()
      //   // change the way the time for the next mda is calculated using the annual or biannual marker from the mda file.
      //   // if biannual, this will add 6 to the next mda time, so will be done in 6 months again.
      //   nextMDA += params.mdaPeriod
      //   statFunctions.setBR(true) //intervention true.
      //   statFunctions.setVH(true)
      //   statFunctions.setMu(true)
      // }

      icount++
    }

  //  console.log("end v_to_h = ", params.v_to_h)
  //  console.log("end shapeRisk = ", params.shapeRisk)
  //  console.log("end params.aImp = ", params.aImp)


  //  console.log("params number = ", paramsNumber)
    this.Ws = this.Ws.slice(200, this.Ws.length)
    this.Ms = this.Ms.slice(200, this.Ms.length)
    this.Ls = this.Ls.slice(200, this.Ls.length)
    var maxt = this.ts[200]
    this.ts = subtract(this.ts.slice(200, this.ts.length), maxt) // !!!!!!!!!!!!!!
  }
}
export var params = {
  riskMu1: 1.0,
  riskMu2: 1.0,
  riskMu3: 1.0,
  shapeRisk: 0.065, //shape parameter for bite-risk distribution (0.1/0.065)
  mu: 0.0104, //death rate of worms
  theta: 0.0, //0.001 //immune system response parameter. 0.112
  gamma: 0.1, //mf death rate
  alpha: 0.58, //mf birth rate per fertile worm per 20 uL of blood.
  lbda: 10, //number of bites per mosquito per month.
  v_to_h: 9.0, //vector to host ratio (39.,60.,120.)
  kappas1: 4.395, //vector uptake and development anophelene
  r1: 0.055, //vector uptake and development anophelene
  tau: 0.00167, //death rate of population
  z: 0.0, //waning immunity
  nu: 0.0, //poly-monogamy parameter
  L3: 0.0, //larvae density.
  g: 0.37, //Proportion of mosquitoes which pick up infection when biting an infected host
  sig: 5.0, //death rate of mosquitos
  psi1: 0.414, //Proportion of L3 leaving mosquito per bite
  psi2: 0.32, //Proportion of L3 leaving mosquito that enter host
  dt: 1.0, //time spacing (months)
  lbdaR: 1.0, //use of bed-net leading to reduction in bite rate
  v_to_hR: 1.0, //use of residual-spraying leading to reduction in v_to_h
  nMDA: 5, //number of rounds of MDA
  mdaFreq: 6, //frequency of MDA (months)
  covMDA: 0.65, //coverage of MDA
  s2: 0.00275, //probability of L3 developing into adult worm.
  mfPropMDA: 0.05, //proportion of mf removed for a single MDA round.
  wPropMDA: 0.45, //proportion of worms permanently sterilised for a single MDA round. (0.55)
  rho: 0.999, //proportion of systematic non-compliance 0- none 1- all.
  mosquitoSpecies: 0, // 0 - Anopheles facilitation squared, 1 - Culex limitation linear.
  rhoBU: 0.0, //correlation between bite risk and systematic non-compliance.
  aWol: 0, //using doxycycline in intervention 0- not used, 1- is used.
  sigR: 5.0, //new mortality rate of mosquitoes during vector intervention.
  covN: 0.0, //coverage of bed nets.
  sysCompN: 0.99, //systematic non-compliance of bed nets. set to near one.
  rhoCN: 0.0, //correlation between receiving chemotherapy and use of bed nets.
  IDAControl: 0, //if 1 then programme switches to IDA after five rounds of standard MDA defined with chi and tau.
}
export var statFunctions = {
  immuneRK4Step: function (W, I) {
    var k1 = params.dt * (W - params.z * I)
    var k2 = params.dt * (W - params.z * (I + 0.5 * k1))
    var k3 = params.dt * (W - params.z * (I + 0.5 * k2))
    var k4 = params.dt * (W - params.z * (I + k3))
    return I + 0.1666667 * (k1 + 2.0 * k2 + 2.0 * k3 + k4)
  },

  L3Uptake: function (mf) {
    if (params.mosquitoSpecies == 0) {
      return (
        params.kappas1 *
        Math.pow(1 - Math.exp((-params.r1 * mf) / params.kappas1), 2.0)
      )
    } else {
      return params.kappas1 * (1 - Math.exp((-params.r1 * mf) / params.kappas1))
    }
  },

  expTrunc: function (lambda, trunc) {
    return (
      (-1 / lambda) *
      Math.log(1 - Math.random() * (1 - Math.exp(-lambda * trunc)))
    )
  },

  poisson: function (mean) {
    var L = Math.exp(-mean)
    var p = 1.0
    var k = 0

    do {
      k++
      p *= Math.random()
    } while (p > L)

    return k - 1
  },

  NormSInv: function (p) {
    var a1 = -39.6968302866538,
      a2 = 220.946098424521,
      a3 = -275.928510446969
    var a4 = 138.357751867269,
      a5 = -30.6647980661472,
      a6 = 2.50662827745924
    var b1 = -54.4760987982241,
      b2 = 161.585836858041,
      b3 = -155.698979859887
    var b4 = 66.8013118877197,
      b5 = -13.2806815528857,
      c1 = -7.78489400243029e-3
    var c2 = -0.322396458041136,
      c3 = -2.40075827716184,
      c4 = -2.54973253934373
    var c5 = 4.37466414146497,
      c6 = 2.93816398269878,
      d1 = 7.78469570904146e-3
    var d2 = 0.32246712907004,
      d3 = 2.445134137143,
      d4 = 3.75440866190742
    var p_low = 0.02425,
      p_high = 1 - p_low
    var q, r
    var retVal

    if (p < 0 || p > 1) {
      console.error('NormSInv: Argument out of range.')
      retVal = 0
    } else if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p))
      retVal =
        (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    } else if (p <= p_high) {
      q = p - 0.5
      r = q * q
      retVal =
        ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p))
      retVal =
        -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    }

    return retVal
  },

  setBR: function (intervention) {
    if (intervention) {
      params.lbda = params.lbdaR * params.lbda_original
      params.xi =
        params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2
    } else {
      params.lbda = params.lbda_original
      params.xi =
        params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2
    }
  },

  setVH: function (intervention) {
    if (intervention) {
      params.v_to_h = params.v_to_hR * params.v_to_h_original
      params.xi =
        params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2
    } else {
      params.v_to_h = params.v_to_h_original
      params.xi =
        params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2
    }
  },

  setMu: function (intervention) {
    if (intervention) {
      params.sig = params.sigR //increase mortality due to bed nets. dN = 0.41 death rate
    } else {
      params.sig = params.sig_original
    }
  },

  setPropMDA: function (regimen) {
    // var ps = simControler.modelParams();
    var ps = simControler.params
    //TODO: regimen is NaN seems odd
    //console.log('setPropMDA',regimen,ps)

    var chis = [0.99, 0.95, 0.99, 1.0, Number(ps.microfilaricide) / 100, 0.99]
    var taus = [0.35, 0.55, 0.1, 1.0, Number(ps.macrofilaricide) / 100, 0.1]
    params.mfPropMDA = 1 - chis[Number(regimen) - 1]
    params.wPropMDA = 1 - taus[Number(regimen) - 1]
  },

  closest: function (num, arr) {
    var mid
    var lo = 0
    var hi = arr.length - 1
    while (hi - lo > 1) {
      mid = Math.floor((lo + hi) / 2)
      if (arr[mid] < num) {
        lo = mid
      } else {
        hi = mid
      }
    }
    if (num - arr[lo] <= arr[hi] - num) {
      return lo
    }
    return hi
  },

  setVHFromPrev: function (p, species) {
    /*
        var anVH = [5., 5.55555556, 6.11111111, 6.66666667, 7.22222222, 7.77777778, 8.33333333, 8.88888889, 9.44444444,  10. ],
            cVH = [ 4.,  4.55555556,  5.11111111,  5.66666667,  6.22222222, 6.77777778,  7.33333333,  7.88888889,  8.44444444,  9.],
            anP = [ 0.09405936,  0.09882859,  0.11038997,  0.11982386,  0.12751358, 0.13604286,  0.14459468,  0.15150072,  0.15736517,  0.16302997],
            cP = [ 0.09306863,  0.11225442,  0.1267763 ,  0.13999753,  0.15040748, 0.16114762,  0.16863057,  0.17532108,  0.1827041 ,  0.18676246];
    */
    var anVH = [
        3.66666667,
        4,
        4.33333333,
        4.66666667,
        5,
        5.55555556,
        6.11111111,
        6.66666667,
        7.22222222,
        7.77777778,
        8.33333333,
        8.88888889,
        9.44444444,
        10,
      ],
      cVH = [
        3.33333333,
        3.66666667,
        4,
        4.55555556,
        5.11111111,
        5.66666667,
        6.22222222,
        6.77777778,
        7.33333333,
        7.88888889,
        8.44444444,
        9,
        9.5,
        10,
        10.5,
        11,
      ],
      anP = [
        0.06232983,
        0.08068697,
        0.07112745,
        0.07718782,
        0.09405936,
        0.09882859,
        0.11038997,
        0.11982386,
        0.12751358,
        0.13604286,
        0.14459468,
        0.15150072,
        0.15736517,
        0.16302997,
      ],
      cP = [
        0.0472584,
        0.05289496,
        0.05937815,
        0.06394662,
        0.0715854,
        0.08006637,
        0.09306863,
        0.11225442,
        0.1267763,
        0.13999753,
        0.15040748,
        0.16114762,
        0.16863057,
        0.17532108,
        0.1827041,
        0.18676246,
      ]
    var vhs, prevs
    if (species === 0) {
      vhs = anVH
      prevs = anP
    } else {
      vhs = cVH
      prevs = cP
    }

    var i = this.closest(p, prevs)
    return vhs[i]
  },

  updateSimParams: function (aImpYear, paramsNumber) {
    // the aImpHistoric has a year entry, starting at 2000, and also a number to signify which simulation has been run
    //params.aImp = simControler.iuParams.aImpHistoric[aImpYear][paramsNumber];
    // params.aImp = simControler.iuParams.aImp[paramsNumber];
    params.aImp = simControler.iuParams['aImp_' + aImpYear][paramsNumber]
  },

  updateInterventionParams: function (mdaRound) {
    // get parameters from the correct mdaRound
    params.covMDA = simControler.mdaObj.coverage[mdaRound] / 100
    params.rho = simControler.mdaObj.adherence[mdaRound]

    let regimen = simControler.mdaObj.regimen[mdaRound]
    //console.log('regimen',regimen)
    if (regimen === 'xIA') {
      params.wPropMDA = 0.65
      params.mfPropMDA = 0.01
      params.fecRed = 9.0
    } else if (regimen === 'xxA') {
      params.wPropMDA = 0.65
      params.mfPropMDA = 1
      params.fecRed = 0
    } else if (regimen === 'xDA') {
      params.wPropMDA = 0.45
      params.mfPropMDA = 0.05
      params.fecRed = 6.0
    } else if (regimen === 'IDA') {
      params.wPropMDA = 0
      params.mfPropMDA = 0
      params.fecRed = 0
    }

    // // similarly for the bednet data. This would just treat it as a vector that we can get the bed net coverage from.
    // // covN is the parameter for how much bed net coverage there is
    params.covNOld = params.covN
    params.covN = simControler.mdaObj.bednets[mdaRound]
  },

  setInputParams: function (dict, i) {
    // var ps = simControler.modelParams();
    var ps = simControler.params
    //console.log('ps',ps)
    //console.log('simControler',simControler)
    params.v_to_h = simControler.iuParams.v_to_h[i]
    params.shapeRisk = simControler.iuParams.shapeRisk[i]
    params.aImp = simControler.iuParams.aImp[i]
    params.inputs = ps
    params.runs = Number(ps.runs)
    params.nMDA = dict && dict.nMDA ? dict.nMDA : Number(ps.mda)
    params.mdaFreq = ps.mdaSixMonths // === 'True' ? 6.0 : 12.0
    var end =
      dict && dict.endemicity ? dict.endemicity / 100 : ps.endemicity / 100
    //    console.log(end)
    var sps = ps.species
    //    console.log(sps)
    // params.v_to_h = Number(statFunctions.setVHFromPrev(end, Number(sps))) //Number(ps.endemicity);//

    //    console.log(params.v_to_h)
    params.covMDA = Number(ps.coverage / 100.0)
    params.covN = Number(ps.covN / 100)
    params.covNOld = Number(ps.covN / 100)
    params.v_to_hR = 1 - Number(ps.v_to_hR / 100)
    params.vecCap = Number(ps.vecCap)
    params.vecComp = Number(ps.vecComp)
    params.vecD = Number(ps.vecD)
    statFunctions.setPropMDA(Number(ps.mdaRegimen))
    params.rho = Number(ps.rho)
    params.rhoBComp = Number(ps.rhoBComp)
    params.rhoCN = Number(ps.rhoCN)
    params.species = Number(ps.species)
    params.mosquitoSpecies = params.species
    //calculate other parameters for params
    // if (params.species == 0) {
    //   params.shapeRisk = 0.065
    // } else {
    //   params.shapeRisk = 0.08
    // }
    // the part where we get parameters from the JSON for the initial longtime simulation to equilibrium


    params.lbda_original = params.lbda
    params.v_to_h_original = params.v_to_h
    params.sig_original = params.sig
    params.xi =
      params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2 //constant bite rate (5760.0 / 30.0)
    params.a = params.shapeRisk //shape parameter (can vary)
    params.b = 1 / params.a //scale parameter determined so mean is 1.
    //sys-compliance parameters
    params.sigma = params.rho / (1 - params.rho)
    params.u0 =
      -statFunctions.NormSInv(params.covMDA) * Math.sqrt(1 + params.sigma)
  },
}
export var simControler = {
  /*
    DEFINE CLASS SESSION DATA TO STORE AND RETRIEVE RUNS.
    Data structure
    session ---- scenarios ---- ---- ---- params
                        ----      ---- label
                        ----      ---- stats   ----  ts
                        ----                   ----  doses
                        ----                   ----  prev_reds
                        ----                   ----  num_rounds
                        ----
                        ----      ---- results ----  ---- ---- Ws
                        ----                   ----       ---- Ms
                        ----                   ----       ---- ts
                                                ----       ---- doses
                                                            ---- Ls
                        ----      ---- mda     ----  time
                        ----                   ----  coverage
                        ----                   ----  adherence
    */
  //////////////////////////////////////////
  /* DOM manipulation */

  maximum: (values) => {
    values.sort(function (a, b) {
      return a - b
    })
    var x = values.length
    var y = Math.round(values.length - 0.975 * values.length)
    return values[y]

    // var half = Math.floor(values.length / 2)
    //
    // if (values.length % 2) return values[half]
    // else return (values[half - 1] + values[half]) / 2.0
  },

  minimum: (values) => {
    values.sort(function (a, b) {
      return a - b
    })
    var x = Math.round(0.975 * values.length)
    return values[x - 1]
    // var half = Math.floor(values.length / 2)
    //
    // if (values.length % 2) return values[half]
    // else return (values[half - 1] + values[half]) / 2.0
  },

  median: (values) => {
    values.sort(function (a, b) {
      return a - b
    })

    var half = Math.floor(values.length / 2)

    if (values.length % 2) return values[half]
    else return (values[half - 1] + values[half]) / 2.0
  },

  runScenario: function ( paramsFromUI, existingScenario, callbacks ) {
    console.log( `SimulatorEngine running ${ existingScenario ? 'scenario ' + existingScenario.id : 'new scenario' } with params:`, paramsFromUI );
    this.params = { ...paramsFromUI }
    this.runMapSimulation( existingScenario, callbacks )
  },

  runMapSimulation: function ( existingScenario, { progressCallback, resultCallback } ) {

    console.log( `SimulatorEngine running map simulation with completed params for scenarioId ${ existingScenario ? existingScenario.id : null }:`, params );

    
    //statFunctions.setInputParams({ nMDA: 60 })
    //max number of mda rounds even if doing it six monthly.

    var mdaJSON = simControler.mdaObj //generateMDAFromForm()
    var maxN = simControler.params.runs // Number($("#runs").val());
    var parDict = []; // create an empty array


    // maxN = 50
    //####//####//####//####//####//####//####
    // I don't know how this will be implemented, but we need the input parameters
    // file containing the parameters set to be accessible in some way here
    // var simControler.iuParams = simControler.iuParamsFileFromTom;

    // numberParamSets should tell us how many sets of parameters we have input
    // however that is done for a JSON file should go here. This will then be used for randomly choosing parameters
    var numberParamSets = simControler.iuParams.Population.length //number_rows(simControler.iuParams);
    var bucket = [];

    for (var i=0;i<numberParamSets;i++) {
      bucket.push(i);
    }

    function getRandomFromBucket() {
      var randomIndex = Math.floor(Math.random()*bucket.length);
      return bucket.splice(randomIndex, 1)[0];
    }
    //####//####//####//####//####//####

    // // paramsStep will make a variable which tells us how far to step in the parameters file for the next simulation.
    // // will multiplying by 1.0 make the result a double, or whatever variable type is equivalent to a decimal (not an integer basically)?
    // // after maxN steps forward, this will be equal to the number of parameter sets, so will end on the final line of the parameter file
    // var paramsStep = numberParamSets*1.0/maxN
    // // // paramsNumber will tell us which row from the parameters file we want to take parameters from
    // // this will be increased by paramStep for each simulation.
    // // Initialise at 0 so we begin on the first line of the simControler.iuParams file
    // var paramsNumber = 0

    var runs = []
    var progression = 0
    //    this.fixInput()

    var progress = setInterval(() => {
      // randomly choose a set of parameters
      var paramsNumber = Math.floor(Math.random() * numberParamSets)
      if(bucket.length>0){
        paramsNumber = getRandomFromBucket()
      }

 // paramsNumber = 46
      // console.log("params number  =", paramsNumber)

      // change the parameters for every simulation here
      statFunctions.setInputParams({ nMDA: 60 }, paramsNumber)

      // get the population size from the simControler.iuParams file
      var population = simControler.iuParams.Population[paramsNumber]
      // console.log("population = ", population)
      var m = new Model(population)
      parDict.push({
        ParamSet: paramsNumber,
        Population:   population,
        v_to_h: params.v_to_h,
        aImp:params.aImp,
        shapeRisk: params.shapeRisk
      });

      //change time to 131 below, as we potentially have 31 years simulation after running to equilibrium
      // the historic 2000-2019 and then to 2030
      m.evolveAndSaves(131.0, mdaJSON, paramsNumber,parDict)
      runs.push(SessionData.convertRun(m))
      progressCallback(parseInt((progression * 100) / maxN))

      // // step forward the position at which we will get the next set of parameters in the next simulation
      // paramsNumber += paramsStep

      if (progression === maxN) {
       // console.log("number of parameter sets", numberParamSets)
       // console.log(simControler.iuParams)
       // console.log(parDict)

        clearInterval(progress)

        const newScenario = {
          ...(
            existingScenario
              ? existingScenario
              : ( () => {
                  console.log( 'SimulatorEngine requesting new scenario from LFModel' );
                  return DiseaseModels[ DISEASE_LIMF ].createNewScenario();
                } )()
          ),
          params: params,
          results: runs,
          mda: simControler.mdaObj,
          mdaUI: simControler.mdaObjUI,
          mda2015: ( existingScenario && existingScenario.mda2015 ) ? existingScenario.mda2015 : simControler.mdaObj2015,
          mdaFuture: ( existingScenario && existingScenario.mdaFuture ) ? existingScenario.mdaFuture : simControler.mdaObjFuture,
        };

        // copy default per-IU settings into new per-scenario-object settings
        if( !existingScenario || !newScenario.settings ) {

          newScenario.settings = {

            coverage: this.params.coverage,
            mda: this.params.mda,
            mdaSixMonths: this.params.mdaSixMonths,
            endemicity: this.params.endemicity,
            covN: this.params.covN,
            v_to_hR: this.params.v_to_hR,
            vecCap: this.params.vecCap,
            vecComp: this.params.vecComp,
            vecD: this.params.vecD,
            mdaRegimen: this.params.mdaRegimen,
            rho: this.params.rho,
            rhoBComp: this.params.rhoBComp,
            rhoCN: this.params.rhoCN,
            species: this.params.species,
            runs: this.params.runs,
            specificPrediction: this.params.specificPrediction,
            specificPredictionIndex: this.params.specificPredictionIndex,
            macrofilaricide: this.params.macrofilaricide,
            microfilaricide: this.params.microfilaricide

          };

          // inherit a specific-prediction label from per-IU settings
          if ( newScenario.settings.specificPredictionIndex > -1 && newScenario.settings.specificPrediction ) {
            newScenario.label = newScenario.settings.specificPrediction.label;
          }

        }

        newScenario.stats = ( () => {
          var ts = [],
            dyrs = [],
            ryrs = [];

          ts = newScenario.results[0]['ts'];

          var stats = simControler.reductionStatsCalc( newScenario, params.covMDA );

          dyrs = stats.doses;
          ryrs = stats.reduction;

          return {
            ts: ts,
            prev_reds: ryrs,
            doses: dyrs,
            Ws: stats.medW,
            Ms: stats.medM,
            Ls: stats.medL,
            WsMax: stats.maxW,
            MsMax: stats.maxM,
            LsMax: stats.maxL,
            WsMin: stats.minW,
            MsMin: stats.minM,
            LsMin: stats.minL
          };
        } )();

        resultCallback( newScenario, simControler.newScenario );

      }

      else {
        progression += 1
      }
    }, 10)

  },

  reductionStatsCalc: (scenario, coverage) => {
    var n = scenario['results'].length
    var T =
      scenario['results'] &&
      scenario['results'][0] &&
      scenario['results'][0]['ts']
        ? scenario['results'][0]['ts'].length
        : 0 // this is just a hotfix so it doesn't crash, however things don't work as they are supposed to
    //    console.log('T')
    //    console.log(T)
    var prev0
    var totR = new Array(T)
    var doses = new Array(T)
    var medM = new Array(T)
    var medW = new Array(T)
    var medL = new Array(T)
    var minM = new Array(T)
    var minW = new Array(T)
    var minL = new Array(T)
    var maxM = new Array(T)
    var maxW = new Array(T)
    var maxL = new Array(T)
    var doses_year = params.mdaFreq === 6 ? 2 : 1
    for (var t = 0; t < T; t++) {
      totR[t] = 0
      doses[t] = 0
      // eslint-disable-next-line no-unused-expressions
      var mM = [],
        mW = [],
        mL = []
      for (var i = 0; i < n; i++) {
        var prev
        prev0 = prev = scenario['results'][i]['Ms'][0]
        var red = scenario['results'][i]['Ms'][t] / prev0
        prev = scenario['results'][i]['Ms'][t]
        mM.push(scenario['results'][i]['Ms'][t])
        mW.push(scenario['results'][i]['Ws'][t])
        mL.push(scenario['results'][i]['Ls'][t])
        totR[t] += red
        if (prev > 1.0) doses[t] += 100000 * coverage * doses_year
      }
      totR[t] = (1 - totR[t] / n) * 100.0
      doses[t] = doses[t] / n
      medM[t] = simControler.median(mM)
      medW[t] = simControler.median(mW)
      medL[t] = simControler.median(mL)
      maxM[t] = simControler.maximum(mM)
      maxW[t] = simControler.maximum(mW)
      maxL[t] = simControler.maximum(mL)
      minM[t] = simControler.minimum(mM)
      minW[t] = simControler.minimum(mW)
      minL[t] = simControler.minimum(mL)
    }

    return {
      reduction: totR,
      doses: doses,
      medM: medM,
      medW: medW,
      medL: medL,
      maxM: maxM,
      maxW: maxW,
      maxL: maxL,
      minM: minM,
      minW: minW,
      minL: minL,
    }
  },

  fixInput: (fix_input) => {
    if (fix_input == null) {
      fix_input = true
    }
  },
  documentReady: function () {
    params.lbda_original = params.lbda
    params.v_to_h_original = params.v_to_h
    params.sig_original = params.sig
    params.xi =
      params.lbda * params.v_to_h * params.psi1 * params.psi2 * params.s2 //constant bite rate (5760.0 / 30.0)
    params.a = params.shapeRisk //shape parameter (can vary)
    params.b = 1 / params.a //scale parameter determined so mean is 1.
    //bed net parameters
    params.sN = 0.03
    params.dN = 0.41
    //sys-compliance parameters
    params.sigma = params.rho / (1 - params.rho)
    params.u0 =
      -statFunctions.NormSInv(params.covMDA) * Math.sqrt(1 + params.sigma)

  },
  params: {
    // this is set in simulatorStore.js now
    /* coverage: 90, // $("#MDACoverage").val(),
    mda: 2, // $("#inputMDARounds").val(),
    mdaSixMonths: 6, // $("input:radio[name=mdaSixMonths]:checked").val(),
    endemicity: 10, // $("#endemicity").val(),
    covN: 0, // $("#bedNetCoverage").val(),
    v_to_hR: 0, // $("#insecticideCoverage").val(),
    vecCap: 0, // $("#vectorialCapacity").val(),
    vecComp: 0, //$("#vectorialCompetence").val(),
    vecD: 0, //$("#vectorialDeathRate").val(),
    mdaRegimen: 1, // $("input[name=mdaRegimenRadios]:checked").val(),
    rho: 0.2, // $("#sysAdherence").val(),
    rhoBComp: 0, // $("#brMda").val(),
    rhoCN: 0, // $("#bedNetMda").val(),
    species: 0, // $("input[name=speciesRadios]:checked").val(),
    macrofilaricide: 65, // $("#Macrofilaricide").val(),
    microfilaricide: 65, // $("#Microfilaricide").val(),
    runs: 5, // $("#runs").val() */
  },
  scenarioLabel: null,
  mdaObj: {
    // this is the ONE processed by simulator
    time: [], // 60, 96, 120, 144, 180
    coverage: [], // 0.9, 0.9, 0.9, 0.9, 0.9
    adherence: [], // 1, 1, 1, 1, 1
    bednets: [], // 60, 96, 120, 144, 180
    regimen: [], // "xiA" / "xDA" ...
    active: [], // true, false, true, ...
  },
  mdaObjUI: {
    // this one contains inactive MDA rounds as well (for UI)
    time: [], // 60, 96, 120, 144, 180
    coverage: [], // 0.9, 0.9, 0.9, 0.9, 0.9
    adherence: [], // 1, 1, 1, 1, 1
    bednets: [], // 60, 96, 120, 144, 180
    regimen: [], // "xiA" / "xDA" ...
    active: [], // true, false, true, ...
  },
  mdaObj2015: {
    // this object contains 2015-2019 only
    time: [], // 60, 96, 120, 144, 180
    coverage: [], // 0.9, 0.9, 0.9, 0.9, 0.9
    adherence: [], // 1, 1, 1, 1, 1
    bednets: [], // 60, 96, 120, 144, 180
    regimen: [], // "xiA" / "xDA" ...
    active: [], // true, false, true, ...
  },
  mdaObjFuture: {
    // this object gets populated based on input parameter
    time: [], // 60, 96, 120, 144, 180
    coverage: [], // 0.9, 0.9, 0.9, 0.9, 0.9
    adherence: [], // 1, 1, 1, 1, 1
    bednets: [], // 60, 96, 120, 144, 180
    regimen: [], // "xiA" / "xDA" ...
    active: [], // true, false, true, ...
  },
  newScenario: true,
  iuParams: {}, // iuParamsFileFromTom
}
