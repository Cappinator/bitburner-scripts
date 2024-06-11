import { GetHackTargets, GetPortHacks, GetAvailableThreads, DeployHackScripts, KillHackScripts } from "util.js";

const REMOTE_HACK_SCRIPT = "remote-hack.js";
const CONTRACTS_SCRIPT = "contracts.js";
const EXTRA_CONTRACTS_MEM = 3.6;

var hackservers = 0;
var porthacks = 0;
var pid = 0;

/** @param {NS} ns */
export async function main(ns, hs = ns.args[0], ph = ns.args[1]) {

  while (true) {
    await ns.sleep(60000);
    let servers = await GetHackTargets(ns);
    let ports = await GetPortHacks(ns);
    let changed = servers.length > hs || ports > ph;

    if (changed) {
      ns.print("Number of hack targets has changed (probably due to increase in hacking skill or unlocking additional hacking programs). Running setup again...");
      await KillHackScripts(ns, "home");
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