import { ScanServers } from "discover.js";
import { ContractTypes } from "contract-types.js";

export const PORT = 13;

/** @param {NS} ns */
export async function main(ns) {
  await FindAndSolveContracts(ns);
}

export async function FindAndSolveContracts(ns) {
  let servers = await ScanServers(ns);
  ns.tprint("Looking for contracts...");
  for (let server of servers) {
    let files = ns.ls(server.name, ".cct");
//    if (files.length == 0)
//      ns.tprint(server.name + " has no contracts.");
    for (let file of files) {
      await ProcessContract(ns, file, server.name);
    }
  }  
}

export async function ProcessContract(ns, file, servername) {
  let ctype = ns.codingcontract.getContractType(file, servername);
  let cdata = ns.codingcontract.getData(file, servername);
  let answer = await SolveContract(ns, ctype, cdata);
//  ns.tprint(server.name + " has contract " + file + " of type " + ctype + " with data " + cdata);
  if (answer != undefined) {
//    ns.tprint("The answer = " + answer);
    let result = ns.codingcontract.attempt(answer, file, servername);
    let resultString = servername + ":" + file + " (Type:" + ctype + "):Answer (" + answer + ") submitted, ";
    if (result == "") {
      resultString += "but was \u001b[31;1mnot accepted\u001b[0m!";
      if (ns.fileExists(file))
        resultString += " (tries remaining:" + ns.codingcontract.getNumTriesRemaining(file, servername) + ")";
    } else {
      resultString += "and was \u001b[32;1maccepted\u001b[0m: " + result;
    }
    ns.tprint(resultString);
  }
}

export async function TestSolutions(ns) {
  let types = { };
//  types[ContractTypes.FindLargestPrimeFactor] = "contracts/find-largest-prime-factor.js";
//  types[ContractTypes.SubarrayWithMaximumSum] = "contracts/subarray-with-maximum-sum.js";

//  types[ContractTypes.TotalWaysToSum] = "contracts/contract-total-ways-to-sum.js";

//  types[ContractTypes.SpiralizeMatrix] = "contracts/spiralize-matrix.js";
//  types[ContractTypes.ArrayJumpingGame] = "contracts/array-jumping-game.js";
types[ContractTypes.ArrayJumpingGameII] = "contracts/array-jumping-game-ii.js";
  
//  types[ContractTypes.GenerateIPAddresses] = "contracts/generate-ip-address.js";

//  types[ContractTypes.UniquePathsInAGridI] = "contracts/contract-unique-paths-grid-1.js";

//  types[ContractTypes.HammingCodesIntegerToEncodedBinary] = "contracts/hammingcodes-integer-to-encoded-binary.js";

//  types[ContractTypes.CompressionIRLECompression] = "contracts/contract-rle.js";
//  types[ContractTypes.CompressionIILZDecompression] = "contracts/compression-ii-lz-decompression.js";

//  types[ContractTypes.EncryptionICaesarCipher] = "contracts/encryption-i-caesar-cipher.js";
//  types[ContractTypes.EncryptionIIVigenereCipher] = "contracts/encryption-ii-vigenere-cipher.js";

  // Check if we have any existing dummy contracts on the home computer
  let files = ns.ls("home", ".cct");
  if (files.length == 0) {

    const testcount = 50;

    // Creating the dummy contracts on home
    for(let key in types) {
      // create some dummy files
      for (let i = 0;i < testcount; i++) {
        ns.codingcontract.createDummyContract(key);
      }
    }

  }

  // Getting a list of the contracts
  files = ns.ls("home", ".cct");
  for(let file of files) {
    await ProcessContract(ns, file, "home");
  }
}

async function SolveContract(ns, ctype, cdata) {
  let data = JSON.stringify(cdata);
  let answer = "";
  let port = ns.getPortHandle(PORT);
  port.clear();

  switch (ctype) {
    case ContractTypes.FindLargestPrimeFactor:
      ns.run("contracts/find-largest-prime-factor.js", 1, data, PORT);
      break;
    case ContractTypes.SubarrayWithMaximumSum:
      ns.run("contracts/subarray-with-maximum-sum.js", 1, data, PORT);   
    
      break;
    case ContractTypes.TotalWaysToSum:
      ns.run("contracts/contract-total-ways-to-sum.js", 1, data, PORT);
      break;
    case ContractTypes.TotalWaysToSumII:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.SpiralizeMatrix:
      ns.run("contracts/spiralize-matrix.js", 1, data, PORT); 
      break;
    case ContractTypes.ArrayJumpingGame:
      ns.run("contracts/array-jumping-game.js", 1, data, PORT);
      break;
    case ContractTypes.ArrayJumpingGameII:
      ns.run("contracts/array-jumping-game-ii.js", 1, data, PORT);
      break;
    case ContractTypes.MergeOverlappingIntervals:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.GenerateIPAddresses:
      ns.run("contracts/generate-ip-address.js", 1, data, PORT);
      break;
    case ContractTypes.AlgorithmicStockTraderI:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.AlgorithmicStockTraderII:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.AlgorithmicStockTraderIII:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.AlgorithmicStockTraderIV:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.MinimumPathSumInATriangle:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.UniquePathsInAGridI:
      ns.run("contracts/contract-unique-paths-grid-1.js", 1, data, PORT);
      break;
    case ContractTypes.UniquePathsInAGridII:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.ShortestPathInAGrid:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.SanitizeParenthesesInExpression:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.FindAllValidMathExpressions:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.HammingCodesIntegerToEncodedBinary:
      ns.run("contracts/hammingcodes-integer-to-encoded-binary.js", 1, data, PORT);
      break;
    case ContractTypes.HammingCodesEncodedBinaryToInteger:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.Proper2ColoringOfAGraph:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.CompressionIRLECompression:
      ns.run("contracts/contract-rle.js", 1, data, PORT);
      break;
    case ContractTypes.CompressionIILZDecompression:
      ns.run("contracts/compression-ii-lz-decompression.js", 1, data, PORT);
      break;
    case ContractTypes.CompressionIIILZCompression:
      ns.tprint("TODO: implement solution for '" + ctype + "'");
      return;

      break;
    case ContractTypes.EncryptionICaesarCipher:
      ns.run("contracts/encryption-i-caesar-cipher.js", 1, data, PORT);
      break;
    case ContractTypes.EncryptionIIVigenereCipher:
      ns.run("contracts/encryption-ii-vigenere-cipher.js", 1, data, PORT);
      break;
  }

  let timeout = 500;
  let t = 0;
  while(t < timeout) {
    if (!port.empty()) {
      answer = JSON.parse(ns.readPort(PORT));
      break;
    }
    t++;
    await ns.sleep(1);
  }

  return answer;
}

async function AttemptContract(ns) {

  let result = ns.codingcontract.attempt(answer, filename, host);
  if (result === "") {
     //failure
  } else {
     ns.tprint(result);
  }

}
