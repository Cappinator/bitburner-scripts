/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = JSON.parse(cdata);
  data.forEach(e => e.map(s => Number.parseInt(s)));

  // sort data by the first element of each subarray
  data.sort((a,b) => a[0]-b[0]);

  // then reduce it by overlaps, storing non overlapping elements to rejoin later
  let extra = [];
  let output = data.reduce((left, right, idx) => {
    let a = left[0];
    let b = left[1];
    if(right[0] <= left[1]) {
      if (right[1] > left[1]) {
        b = right[1];
      }
    } else {
      extra.push([a,b]);
      return [right[0],right[1]];
    }
    return [a, b];
  });
  if (extra.length > 0) {
    output = [output].concat(extra);
    output.sort((a,b) => a[0]-b[0]);
  }

  let answer = JSON.stringify(output);
  ns.writePort(portId, answer);

}
