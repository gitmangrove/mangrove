import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

class AEILineChart extends Component {

  render(){

    let { results, xAxisLabel, refL, refR, dataKey1, dataKey2 } = this.props;

    return(
      <div>
        <LineChart width={900} height={600} data={results} >
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name" label={xAxisLabel}/>
         <YAxis label="AEI Value"/>
         <Tooltip/>
         <Legend />
         <ReferenceLine y={refL} label="AEI Left" stroke="#433eaf"/>
         <ReferenceLine y={refR} label="AEI Right" stroke="#187139"/>
         <Line type="monotone" dataKey={dataKey1} stroke="#8884d8" dot={false}/>
         <Line type="monotone" dataKey={dataKey2} stroke="#82ca9d" dot={false}/>
        </LineChart>
      </div>
    );
  }
}

export default AEILineChart;
