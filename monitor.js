import { GetHackTargets, GetPortHacks, GetAvailableThreads } from "util.js";

const REMOTE_HACK_SCRIPT = "remote-hack.js";
const CONTRACTS_SCRIPT = "contracts.js";
const EXTRA_CONTRACTS_MEM = 3.6;

var hackservers = 0;
var porthacks = 0;
var pid = 0;

/** @param {NS} ns */
export async function main(ns, target = ns.args[0], hs = ns.args[1], ph = ns.args[2]) {
  hackservers = hs;
  porthacks = ph;
  let contractsMem = ns.getScriptRam(CONTRACTS_SCRIPT);
  let memFree = ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - EXTRA_CONTRACTS_MEM - contractsMem;
  if (memFree >= 0) {
    let th = await GetAvailableThreads(ns, "home", REMOTE_HACK_SCRIPT, false, CONTRACTS_SCRIPT);
    pid = ns.run(REMOTE_HACK_SCRIPT, th, target);
  }

  while (true) {
    await ns.sleep(60000);
    let servers = await GetHackTargets(ns);
    let ports = await GetPortHacks(ns);
    let changed = servers.length > hackservers || ports > porthacks;

    if (changed) {
      ns.print("Number of hack targets has changed (probably due to increase in hacking skill or unlocking additional hacking programs). Running setup again...");
      if (pid > 0) {
        ns.kill(pid);
      }
      ns.spawn("setup.js", 1);
    }

    // run contracts script
    let th = await GetAvailableThreads(ns, "home", CONTRACTS_SCRIPT);
    if (th > 0) {
      ns.print("Checking for contracts...");
      ns.run(CONTRACTS_SCRIPT);
    }
  }
}