/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = JSON.parse(cdata).map(d => Number.parseInt(d));

  let minJumps = await FindMinJumps(ns, data);

  let answer = JSON.stringify(minJumps);
  ns.writePort(portId, answer);
}

async function FindMinJumps(ns, data) {
  let jumps = 0;
  let idx = 0;
  let count = 0;
  do {
    jumps++;
    if (idx+data[idx] >= data.length-1) {
      break;
    }
    if (data[idx] == 0) {
      jumps = 0;
      break;
    }
    let sl = data.slice(idx+1, idx+data[idx]+1);
    for(let i=0;i<sl.length;i++) sl[i] += i;
    let sorted = Array.from(sl);
    let max = sorted.sort((a,b) => b-a)[0];
    idx += 1 + sl.findLastIndex(d => d==max);
  } while(idx < data.length && count++ < 20);
  return jumps;
}