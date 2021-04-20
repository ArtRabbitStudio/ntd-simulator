import React from 'react'
import { CircularProgress } from '@material-ui/core';

export default function LoadingElement() {

  return (
      <div style={{marginLeft:"50%",marginRight:"50%",marginTop:"20%"}} >
          <CircularProgress variant="indeterminate" color="primary" />
      </div>

  )
}
