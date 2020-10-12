//returns local time to the many clocks this app uses.
export const getLocalTime = offset => {

    const userTime = new Date(),

    //convert user time to local time.
        msOff = offset * 3_600_000,  // --> hours to milliseconds
        utc = userTime.getTime() + (userTime.getTimezoneOffset() * 60_000), // --> mins to milliseconds
        localTime = new Date(utc + msOff);

    let localHours = localTime.getHours(),
        localMinutes = localTime.getMinutes(),
        localSeconds = localTime.getSeconds();

    return { localHours, localMinutes, localSeconds }
}

//format timezoneDB data for Sapling clock programming.
export const FormatZone = zone => {

    let { dst, gmtOffset, zoneStart, zoneEnd } = zone;

    //get real offset in hours
     dst = dst === '1' ? 'ON' : 'OFF';
    const rawOffset = gmtOffset/3600,
     preOff = dst === 'ON' ? rawOffset - 1 : rawOffset;
    let offset = Math.floor(preOff);
     offset = offset > 0 ? '+'+ offset : offset;

    //workout the bias offset in seconds
    let bias = Math.abs(preOff);
     bias = (bias - Math.floor(bias)) * 3600;
     bias = bias !== 0 ? '+' + bias : bias;
    
    //reformat unix dst dates
    let dstStart = new Date(zoneStart*1000);
    let dstEnd = new Date(zoneEnd*1000);

    //convert dst times from EST to its local time.
     dstStart = dstStart.getTime() + (dstStart.getTimezoneOffset()*60000);
     dstStart = new Date(dstStart + 3600000 * rawOffset);
     dstEnd = dstEnd.getTime() + (dstEnd.getTimezoneOffset() * 60000);
     dstEnd = new Date(dstEnd + 3600000 * rawOffset);

    //Some of the DST data from the resource is inaccurate. This check validates DST dates in the southern hemisphere. 
    if(new Date() > dstStart && new Date() < dstEnd && dst === 'OFF') {
        const a = dstStart;
        dstStart = dstEnd;
        dstEnd = a;
    }
    //create a condition for no DST. 
     dstEnd = dstEnd.getYear() === 69 || dstEnd.getYear() === 70 ? 'none' : dstEnd;

     //other data used
     const { zoneName, countryCode, countryName } = zone;
    
    return { zoneName, offset, bias, dst, dstStart, dstEnd, rawOffset, countryName, countryCode };
}


// Returns instruction for Daylight Savings.
export const getCountryGroup = code => {
    code = checkRegion(code);

    const DSTGroups = new Map([
        ['NA', ()=>'North American Group'],
        ['EU', ()=>'European Group'],
        ['EE', ()=>'Eastern European Group'],
        ['GB', ()=>'United Kingdom'],
        ['IE', ()=>'Ireland'],
        ['BR', ()=>'Brazil'],
        ['JO', ()=>'Jordan'],
        ['MX', ()=>'Mexico'],
        ['CL', ()=>'Chile'],
        ['LB', ()=>'Lebanon'],
        ['PY', ()=>'Paraguay'],
        ['PT', ()=>'Portugal'],
        ['SY', ()=>'Syria'],
        ['default', ()=>'none'],
      ])

      let group = DSTGroups.get(code) || DSTGroups.get('default');
      return group.call(this);
}

// If applicable, places country into its larger DST group. 
const northAmerica = ['US','BM','CA','TC'],
    europe = ['AL','AD','AT','BY','BE','BA','HR','CZ','DK','FR','DE','GI','HU','IT','XK','LI','LU','MK','MT','ME','NL','NO','PL','SM','RS','SK','SI','ES','SE','CH','VA'],
    eastEurope = ['BG','CY','EE','FI','GR','LV','LT','MD','RO','TR','UA'];
function checkRegion(code) {

    

    if(northAmerica.includes(code))
        code = 'NA'

    if(europe.includes(code))
        code = 'EU'
        
    if(eastEurope.includes(code))
        code = 'EU'

    return code;
 }


/* Because DST start times don't actually exist, they get bumped up to the next hour as part of its Unix timestamp. 
Therefore, we'll make em into a string w/ the proper time, and use that in our UI.  */   
export const stringTime = date => {
    let localHours = date.getHours() - 1, //get and correct the hour.
     localMinutes = date.getMinutes();

    localMinutes = (localMinutes < 10 ? '0':'')+ localMinutes;

    const timeOfDay = localHours < 12 ? 'AM' : 'PM';
    localHours = localHours === -1 ? localHours + 24 : localHours;
    localHours = localHours > 12 ? localHours - 12 : localHours;
    localHours = localHours === 0 ? 12 : localHours;

    const stringifyedTime = localHours + ":" + localMinutes + " " + timeOfDay;

    return stringifyedTime;
}