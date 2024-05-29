import { GetHackTargets, GetPortHacks, GetAvailableThreads } from "util.js";

const REMOTE_HACK_SCRIPT = "remote-hack.js";

var hackservers = 0;
var porthacks = 0;
var pid = 0;

/** @param {NS} ns */
export async function main(ns, target = ns.args[0], hs = ns.args[1], ph = ns.args[2]) {
  hackservers = hs;
  porthacks = ph;

  let th = await GetAvailableThreads(ns, "home", REMOTE_HACK_SCRIPT);
  if (th > 0) {
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
  }
}