/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = Array.from(JSON.parse(cdata)).map(e => Number.parseInt(e));

  let lastIdx = 0;
  let idx = 0;
  let success = false;
  while(data[0] != 0) {
    lastIdx = idx;
    idx += data[idx];
    if (idx == data.length-1) {
      success = true;
      break;
    }
    if (idx > data.length-1 || data[idx] === 0) {
      data[lastIdx]--;
      idx = lastIdx = 0;
    }
  }

  let answer = JSON.stringify(success?1:0);
  ns.writePort(portId, answer);
  
}