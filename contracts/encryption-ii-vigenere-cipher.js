/** @param {NS} ns */
export async function main(ns, cdata = ns.args[0], portId = ns.args[1]) {

  let data = JSON.parse(cdata);
  let plaintext = data[0];
  let keyword = data[1];

  let output = await EncryptVigenere(ns, plaintext, keyword);

  ns.writePort(portId, JSON.stringify(output));

}

// A = 65, B = 66, ..., Z = 90

async function EncryptVigenere(ns, plaintext, keyword) {

  let output = [];

  let kidx = 0;
  let klen = keyword.length;
  for (let i=0;i<plaintext.length;i++) {
    let c = plaintext.charCodeAt(i);
    let k = keyword.charCodeAt(kidx++ % klen);
    let shift = c - 65;
    let e = String.fromCharCode((((k + shift) - 65) % 26) + 65);
    output.push(e);
  }
  return output.join("");

}

