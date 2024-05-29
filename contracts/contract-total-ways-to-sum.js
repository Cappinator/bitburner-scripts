/** @param {NS} ns */
export async function main(ns, data = ns.args[0], portId = ns.args[1]) {

// The puzzle relates to integer partitions, with one small difference
// We need to remove 1 from the result, because we don't count the actual number as a possible calculation
// eg: 2 = 2 is not a possible result

  let sum = JSON.parse(data);

  let ar = new Array(sum+1);
  ar[0] = 1;
  for(let i=1;i<=sum;i++) {
    ar[i] = await partition(ns, ar, i);
  }
  
  let answer = JSON.stringify(ar[sum]-1);
  ns.writePort(portId, answer);

}

// https://en.wikipedia.org/wiki/Pentagonal_number
async function pent(ns, n) {
  return ((3*Math.pow(n, 2))-n)/2;
}

// https://en.wikipedia.org/wiki/Integer_partition
async function partition(ns, ar, orig) {
  let i = orig;
  let p = 1;
  let d = 1;
  let t = true;
  let s = 1;
  let part = 0;
  while(i>0) {
    if (t) {
      i = orig - await pent(ns, p++);
      if (i>=0) {
        part += (s * ar[i]);
      }
    } else {
      i-= d++;
      if (i>=0) {
        part += (s * ar[i]);
      }
      s*=-1;
    }
    t = !t;
  }
  
  return part;
}