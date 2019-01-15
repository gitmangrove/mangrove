import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import NDSICharts from '../infographs/NDSICharts';
import ACILineChart from '../infographs/ACILineChart';
import ADILineChart from '../infographs/ADILineChart';
import AEILineChart from '../infographs/AEILineChart';
import ADIAEICharts from '../infographs/ADIAEICharts';
import BAAreaChart from '../infographs/BAAreaChart';
import CompareACIData from '../infographs/CompareACIData';
import CompareBioData from '../infographs/CompareBioData';
import OutlierLineChart from '../infographs/OutlierLineChart';
import CompareNDSIData from '../infographs/CompareNDSIData';
import BALineChart from '../infographs/BALineChart';

// {
//   type: "ndsi",
//   input:
//   {
//     filename: 'UCF Arboretum-3',
//     sitename: 'UCF Arboretum',
//     date: '10/19/2018',
//     location: 'UCF Arboretum'
//   },
//   spec:
//   {
//     name: 'NDSI Default',
//     ndsi-spec:
//     {
//       fft-w: 1024,
//       anthro-min: 1000,
//       anthro-max: 2000,
//       bio-min: 2000,
//       bio-max: 11000
//     }
//   },
//   result:
//   {
//     ndsiL:-0.6826328    ,
//     ndsiR:-0.4155783,
//     biophonyL:0.5506875    ,
//     biophonyR:0.3700277,
//     anthrophonyL:0.1992008,
//     anthrophonyR:0.9990573
//   }
// }


function convertNDSIResults(jobs) {
  let ret;
  let results = jobs[0].results;

  let ndsiLTotal = 0;
  let ndsiRTotal = 0;
  let biophonyLTotal = 0;
  let biophonyRTotal = 0;
  let anthrophonyLTotal = 0;
  let anthrophonyRTotal = 0;

  jobs.forEach(function(job){
    ndsiLTotal += job.result.ndsiL;
    ndsiRTotal += job.result.ndsiR;
    biophonyLTotal += job.result.biophonyL;
    biophonyRTotal += job.result.biophonyR;
    anthrophonyLTotal += job.result.anthrophonyL;
    anthrophonyRTotal += job.result.anthrophonyR;
  });

  let ndsiLAvg = ndsiLTotal / jobs.length;
  let ndsiRAvg = ndsiRTotal / jobs.length;
  let biophonyLAvg = biophonyLTotal / jobs.length;
  let biophonyRAvg = biophonyRTotal / jobs.length;
  let anthrophonyLAvg = anthrophonyLTotal / jobs.length;
  let anthrophonyRAvg = anthrophonyRTotal / jobs.length;

  ret = {
    graph1: [
      { name: 'Left Channel',
        ndsi: ndsiLAvg,
        biophony: biophonyLAvg,
        anthrophony: anthrophonyLAvg
      },
      { name: 'Right Channel',
        ndsi: ndsiRAvg,
        biophony: biophonyRAvg,
        anthrophony: anthrophonyRAvg
      }
    ],
    graph2: [
      { name: 'NDSI',
        leftChannel: ndsiLAvg,
        rightChannel: ndsiRAvg
      },
      { name: 'Biophony',
        leftChannel: biophonyLAvg,
        rightChannel: biophonyRAvg
      },
      {
        name: 'Anthrophony',
        leftChannel: anthrophonyLAvg,
        rightChannel: anthrophonyRAvg
      }
    ],
    graph3: []
  }

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject = {
      name: jobs[i].input.date,
      ndsiL: jobs[i].result.ndsiL,
      ndsiR: jobs[i].result.ndsiR,
      biophonyL: jobs[i].result.biophonyL,
      biophonyR: jobs[i].result.biophonyR,
      anthrophonyL: jobs[i].result.anthrophonyL,
      anthrophonyR: jobs[i].result.anthrophonyR
    }

    ret.graph3.push(curObject);
  }

  return ret;

}

function convertACIResults(jobs) {
  let ret;

  let aciTotAllL = 0;
  let aciTotAllR = 0;
  let aciTotAllByMinL = 0;
  let aciTotAllByMinR = 0;

  let aciFlValsL = [];
  let aciFlValsR = [];

  jobs.forEach(function(job){
    aciTotAllL += job.result.aciTotAllL;
    aciTotAllR += job.result.aciTotAllR;
    aciTotAllByMinL += job.result.aciTotAllByMinL;
    aciTotAllByMinR += job.result.aciTotAllByMinR;

    aciFlValsL.push.apply(aciFlValsL, job.result.aciFlValsL);
    aciFlValsR.push.apply(aciFlValsR, job.result.aciFlValsR);
  });

  ret = {
    graph1: [],
    graph2:
    [
      {
        name: 'ACI Total Left Channel',
        data: aciTotAllL
      },
      {
        name: 'ACI Total Right Channel',
        data: aciTotAllR
      },
      {
        name: 'ACI Total By Minutes Left Channel',
        data: aciTotAllByMinL
      },
      {
        name: 'ACI Total By Minutes Right Channel',
        data: aciTotAllByMinR
      }
    ],
    graph3: []
  }

  for(var i = 0; i < aciFlValsL.length; i++)
  {
    let curObject =
    {
      name: ((i + 1) * 5).toString(),
      aciLeft: aciFlValsL[i],
      aciRight: aciFlValsR[i]
    }

    ret.graph1.push(curObject);
  }

  for(i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].time,
      aciLeft: jobs[i].result.aciTotAllByMinL,
      aciRight: jobs[i].result.aciTotAllByMinR
    }

    ret.graph3.push(curObject);
  }
  return ret;
}

function convertADIResults(jobs) {
  let ret;

  let arrLength = jobs[0].result.ADIbandValsL.length;
  let adiLTotal = 0;
  let adiRTotal = 0;
  let adiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let adiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  jobs.forEach(function(job){
    adiLTotal += job.result.adiL;
    adiRTotal += job.result.adiR;

    adiLBandTemp = adiLBandTemp.map(function(num, idx){
      return num + job.result.ADIbandValsL[idx];
    });

    adiRBandTemp = adiRBandTemp.map(function(num, idx){
      return num + job.result.ADIbandValsR[idx];
    });

  });

  let adiLAvg = adiLTotal / jobs.length;
  let adiRAvg = adiRTotal / jobs.length;

  let adiLBand = adiLBandTemp.map(function(element){
    return element / jobs.length;
  });

  let adiRBand = adiRBandTemp.map(function(element){
    return element / jobs.length;
  });

  ret = {
    graph1: [],
    graph2: [],
    graph3:
    [
      {
        name: 'ADI Left Channel',
        data: adiLAvg
      },
      {
        name: 'ADI Right Channel',
        data: adiRAvg
      }
    ],
    graph4: []
  }

  for(var i = 0; i < adiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].result.ADIbandRangeL[i],
      leftBandVal: adiLBand[i],
      rightBandVal: adiRBand[i]
    }

    ret.graph1.push(curObject);
  }

  for(i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].date,
      leftADIVal: jobs[i].result.adiL,
      rightADIVal: jobs[i].result.adiR
    }

    ret.graph2.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.filename,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR
    }

    ret.graph4.push(curObject);
  });


  return ret;
}

function convertAEIResults(jobs) {
  let ret;

  let arrLength = jobs[0].result.AEIbandValsL.length;
  let aeiLTotal = 0;
  let aeiRTotal = 0;
  let aeiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let aeiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  jobs.forEach(function(job){
    aeiLTotal += job.result.aeiL;
    aeiRTotal += job.result.aeiR;

    aeiLBandTemp = aeiLBandTemp.map(function(num, idx){
      return num + job.result.AEIbandValsL[idx];
    });

    aeiRBandTemp = aeiRBandTemp.map(function(num, idx){
      return num + job.result.AEIbandValsR[idx];
    });

  });

  let aeiLAvg = aeiLTotal / jobs.length;
  let aeiRAvg = aeiRTotal / jobs.length;

  let aeiLBand = aeiLBandTemp.map(function(element){
    return element / jobs.length;
  });

  let aeiRBand = aeiRBandTemp.map(function(element){
    return element / jobs.length;
  });

  ret = {
    graph1: [],
    graph2: [],
    graph3:
    [
      {
        name: 'AEI Left Channel',
        data: aeiLAvg
      },
      {
        name: 'AEI Right Channel',
        data: aeiRAvg
      }
    ],
    graph4: []
  }

  for(var i = 0; i < aeiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].result.AEIbandRangeL[i],
      leftBandVal: aeiLBand[i],
      rightBandVal: aeiRBand[i]
    }

    ret.graph1.push(curObject);
  }

  for(i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].date,
      leftAEIVal: jobs[i].result.aeiL,
      rightAEIVal: jobs[i].result.aeiR
    }

    ret.graph2.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.filename,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR
    }

    ret.graph4.push(curObject);
  });

  return ret;

}

function convertBAResults(jobs) {
  let ret;

  let areaLTotal = 0;
  let areaRTotal = 0;

  jobs.forEach(function(job){
    areaLTotal += job.result.areaL;
    areaRTotal += job.result.areaR;
  });

  ret = {
    graph1: [],
    graph2:
    [
      {
        name: 'Left Channel Area',
        data: areaLTotal
      },
      {
        name: 'Right Channel Area',
        data: areaRTotal
      }
    ],
    graph3: []
  }

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject = {
      name: jobs[i].filename,
      areaL: jobs[i].result.areaL,
      areaR: jobs[i].result.areaR
    }

    ret.graph3.push(curObject);
  }


  return ret;

}

function convertADIAEICompare(jobs) {
  let ret;

  ret =
  {
    graph1: [], // compare aei and adi by time
    graph2: []  // compare aei and adi by file
  }

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].date,
      leftADIVal: jobs[i].result.adiL,
      rightADIVal: jobs[i].result.adiR,
      leftAEIVal: jobs[i].result.aeiL,
      rightAEIVal: jobs[i].result.aeiR
    }

    ret.graph1.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.filename,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR
    }

    ret.graph2.push(curObject);
  });

  return ret;
}

function convertCompareACIResults(jobs) {
  let ret = {
    graph1: convertCompareACIResultsOverTime(jobs),
    graph2: convertCompareACIResultsOverSite(jobs)
  }

  return ret;
}

function convertCompareACIResultsOverTime(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].date,
      leftData: jobs[i].result.aciTotAllByMinL,
      rightData: jobs[i].result.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareACIResultsOverSite(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].sitename,
      leftData: jobs[i].result.aciTotAllByMinL,
      rightData: jobs[i].result.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResults(jobs) {
  let ret = {
    graph1: convertCompareBioResultsOverTime(jobs),
    graph2: convertCompareBioResultsOverSite(jobs)
  }

  return ret;
}

function convertCompareBioResultsOverTime(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].date,
      areaL: jobs[i].result.areaL,
      areaR: jobs[i].result.areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResultsOverSite(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].sitename,
      areaL: jobs[i].result.areaL,
      areaR: jobs[i].result.areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareNDSIResults(jobs) {
  let ret = {
    graph1: convertCompareNDSIResultsOverTime(jobs, 'ndsi'),
    graph2: convertCompareNDSIResultsOverSite(jobs, 'ndsi'),
    graph3: convertCompareNDSIResultsOverTime(jobs, 'biophony'),
    graph4: convertCompareNDSIResultsOverSite(jobs, 'biophony'),
    graph5: convertCompareNDSIResultsOverTime(jobs, 'anthrophony'),
    graph6: convertCompareNDSIResultsOverSite(jobs, 'anthrophony')
  }

  return ret;
}

function convertCompareNDSIResultsOverTime(jobs, value) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject;

    if(value === 'ndsi')
    {
      curObject = {
        name: jobs[i].date,
        ndsiL: jobs[i].result.ndsiL,
        ndsiR: jobs[i].result.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: jobs[i].date,
        biophonyL: jobs[i].result.biophonyL,
        biophonyR: jobs[i].result.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: jobs[i].date,
        anthrophonyL: jobs[i].result.anthrophonyL,
        anthrophonyR: jobs[i].result.anthrophonyR
      }
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareNDSIResultsOverSite(jobs, value) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject;

    if(value === 'ndsi')
    {
      curObject = {
        name: jobs[i].sitename,
        ndsiL: jobs[i].result.ndsiL,
        ndsiR: jobs[i].result.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: jobs[i].sitename,
        biophonyL: jobs[i].result.biophonyL,
        biophonyR: jobs[i].result.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: jobs[i].sitename,
        anthrophonyL: jobs[i].result.anthrophonyL,
        anthrophonyR: jobs[i].result.anthrophonyR
      }
    }

    ret.push(curObject);
  }

  return ret;
}

function convertOutlierResults(job) {
  let ret = {
    graph1: [],
    index: job.type
  }

  let curObject = {
    name: jobs[i].name,
    leftData: 0,
    rightData: 0
  }

  if(ret.index === 'aci')
  {
    curObject.leftData = job.result.aciTotAllByMinL;
    curObject.rightData = job.result.aciTotAllByMinR;
  }else if(ret.index === 'bio')
  {
    curObject.leftData = jobs.result.areaL;
    curObject.rightData = jobs.result.areaR;
  }

  ret.graph1.push(curObject);

  // for(var i = 0; i < jobs.length; i++)
  // {
  //   let curObject = {
  //     name: jobs[i].name,
  //     leftData: 0,
  //     rightData: 0
  //   }
  //
  //   if(ret.index === 'aci')
  //   {
  //     curObject.leftData = jobs[i].results.aciTotAllByMinL;
  //     curObject.rightData = jobs[i].results.aciTotAllByMinR;
  //   }else if(ret.index === 'bio')
  //   {
  //     curObject.leftData = jobs[i].results.areaL;
  //     curObject.rightData = jobs[i].results.areaR;
  //   }
  //
  //   ret.graph1.push(curObject);
  // }

  return ret;
}

class AnalysisView extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    this.formatJob(nextProps.chosenResult)
    if(nextProps.resultToCompare)
      this.formatCompare(nextProps.resultToCompare)
    else
      this.setState({ formattedJobToCompare: null })
  }

  componentDidMount = () => {
    this.formatJob(this.props.chosenResult)
  }

  formatJob = (props) => {
    var formattedJob = (
      <div>
        <h4>
          {props.input.sitename}
        </h4>

        {/*<p>{job.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{job.input}&nbsp;&nbsp;&nbsp;&nbsp;{job.status}</p>*/}
        <h5>{props.input.sitename}</h5>
        <p>{props.input.type.toUpperCase()}</p>

        // <p>{props.input.spec.name}</p>
      </div>
    )
    this.setState({ formattedJob: formattedJob })
  }

  formatCompare = (props) => {
    var formattedJobToCompare = (
      <div>
        <h4>
          {props.input.sitename}
        </h4>

        {/*<p>{job.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{job.input}&nbsp;&nbsp;&nbsp;&nbsp;{job.status}</p>*/}
        <p>{props.type.toUpperCase()}</p>
        <p>{props.spec.alias}</p>
      </div>
    )
    this.setState({ formattedJobToCompare: formattedJobToCompare })
  }

  render() {
    return (
      <div>
        {this.state.formattedJob ?
          <div>
            {this.state.formattedJobToCompare ?
              <div>
                {this.state.formattedJob}
                {this.state.formattedJobToCompare}
              </div>
              :
              <div>
                {this.state.formattedJob}
              </div>
            }
          </div>
        :
          ''
        }
      </div>
    );
  }
}

export default AnalysisView;