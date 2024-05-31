/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = JSON.parse(cdata);

  let plaintext = data[0];
  let shift = Number.parseInt(data[1]);

  // A = 65, B = 66, ..., Z = 90

  let output = [];
  for (let i=0;i<plaintext.length;i++) {
    let c = plaintext.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      let shc = (c - shift - 65) % 26;
      output.push(String.fromCharCode(shc >= 0 ? 65 + shc : 91 + shc));
    } else {
      output.push(plaintext.substr(i, 1));
    }
  }

  let answer = JSON.stringify(output.join(""));
  ns.writePort(portId, answer);
}