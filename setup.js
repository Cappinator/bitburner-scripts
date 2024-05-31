import { GetHackTargets, GetPortHacks, GetAvailableThreads, RESERVE_MEMORY_FOR_CONTRACTS, NukeServer } from "util.js";

const REMOTE_HACK_SCRIPT = "remote-hack.js";
const MONITOR_SCRIPT = "monitor.js";
const CONTRACTS_SCRIPT = "contracts.js";

/** @param {NS} ns */
export async function main(ns, param = ns.args[0]) {
  if (param == "-l") {
    let servers = await GetHackTargets(ns);
    let target = servers.shift();
    let contractsScript = "";
    if (RESERVE_MEMORY_FOR_CONTRACTS) {
      contractsScript = CONTRACTS_SCRIPT;
    }
    let t = await GetAvailableThreads(ns, "home", REMOTE_HACK_SCRIPT, false, contractsScript);
    if (t > 0)
      ns.run(REMOTE_HACK_SCRIPT, t, target.name);
  } else {
    let servers = await GetHackTargets(ns);
    await SetupRemoteHacks(ns, servers);
  }
}

async function SetupRemoteHacks(ns, servers) {
  let target = servers.shift();
  // nuke target
  await NukeServer(ns, target);
  for(let i=0;i<servers.length;i++) {
    let s = servers[i];
    await NukeServer(ns, s);
    // check if a remote hack script is already running, and what its target is
    let psinfo = ns.ps(s.name).filter(info => info.filename == REMOTE_HACK_SCRIPT);
    if (psinfo.length > 0) {
      let t = psinfo[0].args[0];
      // if it's a different target, kill the old script first
      if (t != target.name) {
        ns.kill(REMOTE_HACK_SCRIPT, s.name, psinfo[0].args[0]);
      }
    }
    ns.scp(REMOTE_HACK_SCRIPT, s.name);
    let t = await GetAvailableThreads(ns, s.name, REMOTE_HACK_SCRIPT);
    if (t > 0)
      ns.exec(REMOTE_HACK_SCRIPT, s.name, t, target.name);
  }
  let ph = await GetPortHacks(ns);
  ns.spawn(MONITOR_SCRIPT, 1, target.name, ns.getHackingLevel(), ph);
}
