import React, {Component} from 'react';
import Recharts, {LineChart, ReferenceLine, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ADIAEICharts extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;

    let adiResults = this.props.adiResults;
    let aeiResults = this.props.aeiResults;

    let adiLeft = adiResults.graph3[0].data;
    let adiRight = adiResults.graph3[1].data;
    let aeiLeft = aeiResults.graph3[0].data;
    let aeiRight = aeiResults.graph3[1].data;

    return(
      <div>
        <h4>Comparing AEI and ADI</h4>
        <LineChart width={900} height={600} data={graph1} syncId="1">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label="Time of Day"/>
          <YAxis label="Index Value"/>
          <Legend />
          <Tooltip/>
          {/*<ReferenceLine y={aeiLeft} label="AEI Left" stroke="#82ca9d"/>
          <ReferenceLine y={aeiRight} label="AEI Right" stroke="#257142"/>
          <ReferenceLine y={adiLeft} label="ADI Left" stroke="#8884d8"/>
          <ReferenceLine y={adiRight} label="ADI Right" stroke="#5551a2"/>*/}
          <Line type='natural' dataKey='leftADIVal' stroke='#8884d8' dot={false} />
          <Line type='natural' dataKey='rightADIVal' stroke='#5551a2' dot={false} />
          <Line type='natural' dataKey='leftAEIVal' stroke='#82ca9d' dot={false} />
          <Line type='natural' dataKey='rightAEIVal' stroke='#257142' dot={false} />
          <Brush syncId="1"/>
        </LineChart>
        <br />
        <LineChart width={900} height={600} data={graph2} syncId="2">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label="File"/>
          <YAxis label="Index Value"/>
          <Legend />
          <Tooltip/>
          {/*<ReferenceLine y={aeiLeft} label="AEI Left" stroke="#82ca9d"/>
          <ReferenceLine y={aeiRight} label="AEI Right" stroke="#257142"/>
          <ReferenceLine y={adiLeft} label="ADI Left" stroke="#8884d8"/>
          <ReferenceLine y={adiRight} label="ADI Right" stroke="#5551a2"/>*/}
          <Line type='natural' dataKey='leftADIVal' stroke='#8884d8' dot={false} />
          <Line type='natural' dataKey='rightADIVal' stroke='#5551a2' dot={false} />
          <Line type='natural' dataKey='leftAEIVal' stroke='#82ca9d' dot={false} />
          <Line type='natural' dataKey='rightAEIVal' stroke='#257142' dot={false} />
          <Brush syncId="2"/>
        </LineChart>
      </div>
    );
  }
}

export default ADIAEICharts;