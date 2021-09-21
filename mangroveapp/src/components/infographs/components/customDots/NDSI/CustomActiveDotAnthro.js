import React, { Component } from 'react';

class CustomActiveDotAnthro extends Component {
  render() {
    const { cx, cy, payload, dataKey, graph, type } = this.props;

    return (
      <circle 
        className="recharts-dot" 
        cx={cx} 
        cy={cy} 
        r={5}
        x={payload.name}
        y={payload.anthrophony}
        jobid={payload.jobId}
        name={payload.name}
        filename={payload.fileName}
        inputid={payload.inputId}
        downloadurl={payload.downloadUrl}
        key={dataKey}
        graph={graph}
        index={type}
      />
    );
  }
}

export default CustomActiveDotAnthro;