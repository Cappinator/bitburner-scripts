import { ScanServers, SortByMoney, FilterHackableServers } from "discover.js";

export async function GetHackTargets(ns) {
  let ph = await GetPortHacks(ns);
  let hs = ns.getHackingLevel();
  let servers = await ScanServers(ns);
//  ns.print("All servers:");
//  ns.print(servers);
  let filteredServers = await FilterHackableServers(ns, servers, ph, hs);
//  ns.print("Hackable servers:");
//  ns.print(filteredServers);
  let sortedServers = await SortByMoney(ns, filteredServers);
//  ns.print("Sorted by Money:");
//  ns.print(sortedServers);
  return sortedServers;
}

export async function GetPortHacks(ns) {
  let portHacks = 0;
  if (ns.fileExists("BruteSSH.exe", "home"))
    portHacks++;
  if (ns.fileExists("FTPCrack.exe", "home"))
    portHacks++;
  if (ns.fileExists("relaySMTP.exe", "home"))
    portHacks++;
  if (ns.fileExists("HTTPWorm.exe", "home"))
    portHacks++;
  if (ns.fileExists("SQLInject.exe", "home"))
    portHacks++;
  return portHacks;
}

export async function GetAvailableThreads(ns, server, script, ignoreUsedRam = false) {
  let mem = ns.getServerMaxRam(server);
  if (!ignoreUsedRam)
    mem -= ns.getServerUsedRam(server);
  let smem = ns.getScriptRam(script);
  return Math.floor(mem/smem);
}
/*
export async function main(ns) {
	const colors = {
		black: "\u001b[30m",
		red: "\u001b[31m",
		green: "\u001b[32m",
		yellow: "\u001b[33m",
		blue: "\u001b[34m",
		magenta: "\u001b[35m",
		cyan: "\u001b[36m",
		white: "\u001b[37m",
		brightBlack: "\u001b[30;1m",
		brightRed: "\u001b[31;1m",
		brightGreen: "\u001b[32;1m",
		brightYellow: "\u001b[33;1m",
		brightBlue: "\u001b[34;1m",
		brightMagenta: "\u001b[35;1m",
		brightCyan: "\u001b[36;1m",
		brightWhite: "\u001b[37;1m",
		reset: "\u001b[0m"
	};
	for(const key of Object.keys(colors)) {
		ns.tprint(`${colors[key]}${key}`);
	}
}
*/
