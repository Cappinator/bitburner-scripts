import { Factorize, IsPrime } from "contracts/math.js";

/** @param {NS} ns */
export async function main(ns, n = ns.args[0], portId = ns.args[1]) {

  let input = JSON.parse(n);
  let factors = await Factorize(ns, input);
  let pf = 0;
  for(let f of factors) {
    if (await IsPrime(ns, f)) {
      pf = f;
      break;
    }
  }

  let answer = JSON.stringify(pf);
  ns.writePort(portId, answer);

}




