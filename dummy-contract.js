/** @param {NS} ns */
export async function main(ns, ctype = ns.args[0]) {
  let file = ns.codingcontract.createDummyContract(ctype);
  ns.tprint(file + " was generated.")
}