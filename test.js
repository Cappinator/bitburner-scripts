import { TestSolutions } from "contracts.js";

/** @param {NS} ns */
export async function main(ns, param = ns.args[0], params = ns.args[1]) {
  switch (param) {
    case "sort":
      await SortArrayTest(ns);
      break;
    case "contract-types":
      await GetContractTypesTest(ns);
      break;
    case "dummy-contract":
      await GenerateDummyContract(ns, params);
      break;
    case "contract-solutions":
      await TestContractSolutions(ns);
      break;
    case "parity":
      await TestParity(ns);
      break;
    case "bitwise-and":
      await TestBitwiseAnd(ns, params);
      break;
  }


}

async function SortArrayTest(ns) {
  let ar = [ 10, 5, 0, 3, -5, 5, 3, -20];
  ns.tprint(ar);
  ns.tprint("----------------------------");

  let ar2 = ar.sort((a,b) => a-b);
  ns.tprint(ar);
  ns.tprint(ar2);
  ns.tprint("----------------------------");
}

async function GetContractTypesTest(ns) {
  let types = ns.codingcontract.getContractTypes();
  ns.tprint(types);
}

async function GenerateDummyContract(ns, ctype) {
  let file = ns.codingcontract.createDummyContract(ctype);
  ns.tprint(file + " was generated.");
}

async function TestContractSolutions(ns) {
  await TestSolutions(ns);
}

async function TestParity(ns) {
    const input = "63695773";
    const responsePort = ns.args[1];
    ns.print(`Input: ${JSON.stringify(input)}`);

    const data = input
        .toString(2)
        .split(``)
        .map((b) => Number.parseInt(b));
    ns.print(`Data: ${JSON.stringify(data)}`);

    let numParityBits = 0;
    while (Math.pow(2, numParityBits) < numParityBits + data.length + 1) {
        numParityBits++;
    }
    ns.print(`numParityBits: ${numParityBits}`);
    const encoding = Array(numParityBits + data.length + 1).fill(0);
    const parityBits = [];
    // TODO: populate parityBits with 2^x for x in range 0 to (numParityBits - 1), then
    //       the below calcualtion go away in favor of `if (i in parityBits) continue;
    for (let i = 1; i < encoding.length; i++) {
        const pow = Math.log2(i);
        if (pow - Math.floor(pow) === 0) {
            parityBits.push(i);
            continue;
        }

        encoding[i] = data.shift();
    }

    ns.print(`ParityBits: ${JSON.stringify(parityBits)}`);

    const parity = encoding.reduce(
        (total, bit, index) => (total ^= bit > 0 ? index : 0),
        0
    );
    const parityVals = parity
        .toString(2)
        .split(``)
        .map((b) => Number.parseInt(b))
        .reverse();
    while (parityVals.length < parityBits.length) {
        parityVals.push(0);
    }

    for (let i = 0; i < parityBits.length; i++) {
        encoding[parityBits[i]] = parityVals[i];
    }
    ns.print(`Parity: ${JSON.stringify(parityVals)}`);

    const globalParity =
        (encoding.toString().split(`1`).length - 1) % 2 === 0 ? 0 : 1;
    ns.print(`GlobalParity: ${globalParity}`);
    encoding[0] = globalParity;

    ns.print(`Encoding: ${JSON.stringify(encoding)}`);

    const answer = encoding.reduce((total, bit) => (total += bit), ``);
    ns.print(`Answer: ${answer}`);
    
}

async function TestBitwiseAnd(ns, number) {
  for (let i=1; i<16;i++) {
    let result = number & i;
    ns.tprint(number + " & " + i + " = " + result);
  }
}
