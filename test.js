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
    case "lzdecomp":
      await LZDecomp(ns, params);
      break;
    case "bitwise-and":
      await TestBitwiseAnd(ns, params);
      break;
    default:
      await TestNewHackingAlgorithm(ns);
  }


}

async function TestNewHackingAlgorithm(ns) {
  let target = "omega-net";
  let mults = ns.getHackingMultipliers();
  ns.tprint(mults);
  await PrepareServer(ns, target);
}

async function PrepareServer(ns, server) {
  // We need the security as low as possible
  let minSecLevel = ns.getServerMinSecurityLevel(server);
  let maxMoney = ns.getServerMaxMoney(server);
  let curSecLevel = ns.getServerSecurityLevel(server);
  ns.tprint("Name: " + server + " | MinSec: " + minSecLevel + " | CurSecLevel: " + curSecLevel + " | maxMoney: " + maxMoney);
  let weakenTime = ns.formulas.hacking.weakenTime(ns.getServer(server), ns.getPlayer());
  ns.tprint("Weaken time: " + weakenTime);
  let t = await GetThreadsForWeaken(ns, server);
  ns.tprint("We need to weaken with " + t + " threads to lower the security level to below minimum level");

}

async function GetThreadsForWeaken(ns, server, cores = 1) {
  let minSecLevel = ns.getServerMinSecurityLevel(server);
  let curSecLevel = ns.getServerSecurityLevel(server);
  let i = 0;
  let effect = 0;
  while(curSecLevel - effect > minSecLevel) {
    effect = ns.weakenAnalyze(i++, cores);
  }
  return i;
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

async function LZDecomp(ns, compr) {

        let plain = "";

        for (let i = 0; i < compr.length;) {
            const literal_length = compr.charCodeAt(i) - 0x30;

            if (literal_length < 0 || literal_length > 9 || i + 1 + literal_length > compr.length) {
                return null;
            }

            plain += compr.substring(i + 1, i + 1 + literal_length);
            i += 1 + literal_length;

            if (i >= compr.length) {
                break;
            }
            const backref_length = compr.charCodeAt(i) - 0x30;

            if (backref_length < 0 || backref_length > 9) {
                return null;
            } else if (backref_length === 0) {
                ++i;
            } else {
                if (i + 1 >= compr.length) {
                    return null;
                }

                const backref_offset = compr.charCodeAt(i + 1) - 0x30;
                if ((backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) || backref_offset > plain.length) {
                    return null;
                }

                for (let j = 0; j < backref_length; ++j) {
                    plain += plain[plain.length - backref_offset];
                }

                i += 2;
            }
        }

        ns.tprint(plain);

}

async function TestBitwiseAnd(ns, number) {
  for (let i=1; i<16;i++) {
    let result = number & i;
    ns.tprint(number + " & " + i + " = " + result);
  }
}
