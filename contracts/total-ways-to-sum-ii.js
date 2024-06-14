/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let cdata2 = JSON.parse(cdata);
  let target = cdata2[0];
  let data = cdata2[1].sort((a, b) => b - a);
  let result = CheckSum(target, data);

  let answer = JSON.stringify(result);
  ns.writePort(portId, answer);
}

function CheckSum(target, numbers, idx = 0) {
  if (numbers.length == idx + 1) {
    return target % numbers[idx] == 0 ? 1 : 0;
  }
  let result = 0;
  let mult = Math.floor(target / numbers[idx]);
  for (let n = mult; n >= 0; n--) {
    if (target == numbers[idx] * n) {
      result++;
    }
    else {
      result += CheckSum(target - (numbers[idx] * n), numbers, idx + 1);
    }
  }
  return result
}