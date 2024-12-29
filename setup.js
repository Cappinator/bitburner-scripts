import { GetHackTargets, GetPortHacks, GetScriptHosts, DeployHackScripts } from "util.js";

const MONITOR_SCRIPT = "monitor.js";
const CONTRACTS_SCRIPT = "contracts.js";
const EXTRA_CONTRACTS_MEM = 3.6;

/** @param {NS} ns */
export async function main(ns, param1 = ns.args[0], param2 = ns.args[1]) {
  let targets = await GetHackTargets(ns);
  if (param1 == "-l") {
    let target = targets[0];
    if (param2 == "-i") {
      await SetupHacks(ns, ["home"], [target]);
    } else {
      let contractsMem = ns.getScriptRam(CONTRACTS_SCRIPT);
      await SetupHacks(ns, ["home"], [target], contractsMem + EXTRA_CONTRACTS_MEM);
    }
  } else {
    let hosts = await GetScriptHosts(ns, 1);
    //ns.tprint(hosts);
    let contractsMem = ns.getScriptRam(CONTRACTS_SCRIPT);
    await SetupHacks(ns, hosts, targets, contractsMem + EXTRA_CONTRACTS_MEM);
    let ph = await GetPortHacks(ns);
    ns.spawn(MONITOR_SCRIPT, 1, targets.length, ph);
  }
}

async function SetupHacks(ns, hosts, targets, leaveMem) {
  let targetIdx = 0;
  for (let host of hosts) {
    if (targetIdx >= targets.length) {
      break;
    }
    let target = targets[targetIdx++];
    if (host.name == "home") {
      await DeployHackScripts(ns, host, target, leaveMem);
    } else {
      await DeployHackScripts(ns, host, target);
    }
  }
}
