/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = JSON.parse(cdata).map(d => Number.parseInt(d));

  let max = null;
  for(let i=0;i<data.length;i++) {
    for(let j=i+1;j<data.length+1;j++) {
      let sum = data.slice(i,j).reduce((first, second) => first+second);
      if (max == null || sum > max) {
        max = sum;
      }
    }
  }

  let answer = JSON.stringify(max);
  ns.writePort(portId, answer);

}