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
  for (let parPosIdx of parPosIdxs) {
    let parbit = 0;
    for (let dataPosIdx of dataPosIdxs) {
      if ((dataPosIdx & parPosIdx) != 0) {
        parbit += data[dataPosIdx-1];
      }
    }
    data[parPosIdx-1] = parbit % 2;
  }
  let globalParity = data.reduce((total, bit) => ( total + bit ));
  data.unshift(globalParity % 2);
  return data;
}

async function GetNextParityPosition(ns, exp) {
  return Math.pow(2, exp)-1;
}

async function SetDataBits(ns, data) {
  let inputStr = data.toString(2);
  let input = inputStr.split("").map(b => Number.parseInt(b));
  let output = [];
  let outputIdx = 0;
  let parPosExp = 0;
  let parPos = await GetNextParityPosition(ns, parPosExp++);
  for (let i = 0;i < input.length;i++) {
    while(outputIdx == parPos) {
      parPosIdxs.push(parPos+1);
      parPos = await GetNextParityPosition(ns, parPosExp++);
      output[outputIdx++] = 0;
    }
    dataPosIdxs.push(outputIdx+1);
    output[outputIdx++] = input[i]
  }
  return output;
}