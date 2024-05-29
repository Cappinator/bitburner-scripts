/** @param {NS} ns */
export async function main(ns, data = ns.args[0], portId = ns.args[1]) {

  let input = JSON.parse(data);

  let parts = [];
  let c = "";
  let n = 0;
  for (let i = 0;i <= input.length; i++) {
    let check = input[i];
    if (c == check && n < 9) {
      n++;
    } else {
      if (c != "") {
        parts.push(n + c);
      }
      c = check;
      n = 1;
    }
  }

  let answer = JSON.stringify(parts.join(""));
  ns.writePort(portId, answer);

}