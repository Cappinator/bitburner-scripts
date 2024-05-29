var parPosIdxs = [];
var dataPosIdxs = [];

/** @param {NS} ns */
export async function main(ns, number = ns.args[0], portId = ns.args[1]) {

  let input = JSON.parse(number);

  parPosIdxs = [];
  dataPosIdxs = [];

  let output = await SetDataBits(ns, input);
  let output2 = await SetParityBits(ns, output);
  let final = output2.join("");

  let answer = JSON.stringify(final);
  ns.writePort(portId, answer);
  
}

async function SetParityBits(ns, data) {
//  ns.tprint("data = " + data);
//  ns.tprint("parity positions = " + parPosIdxs);
//  ns.tprint("data positions = " + dataPosIdxs);

  for (let parPosIdx of parPosIdxs) {
    let parbit = 0;
//    ns.tprint("Calculating parity bit for parity position " + parPosIdx);
    for (let dataPosIdx of dataPosIdxs) {
//      ns.tprint(dataPosIdx + " & " + parPosIdx + " = " + (dataPosIdx & parPosIdx));
      if ((dataPosIdx & parPosIdx) != 0) {
        parbit += data[dataPosIdx-1];
//        ns.tprint("Data at pos " + dataPosIdx + " included, total parity is now " + parbit);
      }
    }
    data[parPosIdx-1] = parbit % 2;
//    ns.tprint("Setting parity bit " + parPosIdx + " to " + parbit % 2);
  }
  // todo global parity bit at idx 0
  let globalParity = data.reduce((total, bit) => ( total + bit ));
//  ns.tprint("data = " + data);
//  ns.tprint(globalParity);
  data.unshift(globalParity % 2);
  return data;
}

async function GetNextParityPosition(ns, exp) {
  return Math.pow(2, exp)-1;
}

async function SetDataBits(ns, data) {
  let inputStr = data.toString(2);
  let input = inputStr.split("").map(b => Number.parseInt(b));
//  ns.tprint(data + "=" + input);
  let output = [];
  let outputIdx = 0;
  let parPosExp = 0;
  let parPos = await GetNextParityPosition(ns, parPosExp++);
//  ns.tprint("Next parity bit pos=" + parPos);
  for (let i = 0;i < input.length;i++) {
    while(outputIdx == parPos) {
      parPosIdxs.push(parPos+1);
      parPos = await GetNextParityPosition(ns, parPosExp++);
//      ns.tprint("Next parity bit pos=" + parPos);
      output[outputIdx++] = 0;
    }
    dataPosIdxs.push(outputIdx+1);
//    ns.tprint("Set bit " + outputIdx + " to " + input[i]);
    output[outputIdx++] = input[i]
  }
//  ns.tprint(output);
  return output;
}