/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = JSON.parse(cdata);

  let octets = await GenerateOctets(ns, data);
  let filtered = await FilterOctets(ns, octets);

  let answer = JSON.stringify(filtered);
  ns.writePort(portId, answer);
}

async function GenerateOctets(ns, data) {
  let octets = [];
  for(let i=1;i<data.length-2;i++)
   {
    for(let j=i+1;j<data.length-1;j++) 
    {
      for(let k=j+1;k<data.length;k++) 
      {
        octets.push(data.substring(0,i).concat(".", data.substring(i,j), ".", data.substring(j,k), ".", data.substring(k)));
      }
    }
  }
  return octets;
}

async function FilterOctets(ns, octets) {
  let filtered = [];
  for(let octet of octets) {
    let v = true;
    let os = octet.split(".");
    for(let o of os) {
      if ((o.startsWith("0") && o.length > 1)
      || o.length > 3
      || Number.parseInt(o) > 255)
      {
        v = false;
        break;
      }
    }
    if (v) {
      filtered.push(octet);
    }
  }
  return filtered;
}