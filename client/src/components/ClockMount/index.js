import React from 'react';
import { ZoneClocks } from '../ZoneClocks';



export default function ClockMount() { 


return (
    <div style={background}>
        <div style={{height: '1px'}}></div>
        <ZoneClocks offset={10} position={{left: '86px', top: '15px'}} />
        <ZoneClocks offset={-5} position={{left: '261px', top: '-3px'}} />
    </div>
)
}

const background = {
    backgroundImage: `url(${require("../../assets/img/Sapling-RoundMount.png")}`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '80%',
    height: '260px',
    marginTop: '30px'
}