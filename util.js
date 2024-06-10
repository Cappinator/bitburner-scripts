import { ScanServers, FilterZeroMoneyServers, SortByMoney, SortByMem, FilterHackableServers, FilterByMem } from "discover.js";

//export const RESERVE_MEMORY_FOR_CONTRACTS = true;
export const EXTRA_CONTRACTS_MEM = 3.6;
const HACK_SCRIPTS = ["remote-hack.js", "w.js", "h.js", "g.js", "lw.js", "lh.js", "lg.js"];

export async function GetHackTargets(ns) {
  let ph = await GetPortHacks(ns);
  let hs = ns.getHackingLevel();
  let servers = await ScanServers(ns);
  //  ns.print("All servers:");
  //  ns.print(servers);
  let filteredServers = await FilterHackableServers(ns, servers, ph, hs);
  //  ns.print("Hackable servers:");
  //  ns.print(filteredServers);
  let moneyServers = await FilterZeroMoneyServers(ns, filteredServers);
  let sortedServers = await SortByMoney(ns, moneyServers);
  //  ns.print("Sorted by Money:");
  //  ns.print(sortedServers);
  let noHomeServers = sortedServers.filter(s => s.name != "home");
  return noHomeServers;
}

export async function GetScriptHosts(ns, minMemory) {
  let ph = await GetPortHacks(ns);
  let hs = ns.getHackingLevel();
  let servers = await ScanServers(ns);
  let filteredServers = await FilterHackableServers(ns, servers, ph, hs);
  let memServers = await FilterByMem(ns, filteredServers, minMemory);
  return await SortByMem(ns, memServers);
}

export async function KillHackScripts(ns, server) {
  let pi = ns.ps(server);
  for(let info of pi) {
    if (HACK_SCRIPTS.includes(info.filename)) {
      ns.kill(info.pid);
    }
  }
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

export async function GetAvailableThreads(ns, server, script, ignoreUsedRam = false, leaveMem = 0) {
  let mem = ns.getServerMaxRam(server);
  if (!ignoreUsedRam)
    mem -= ns.getServerUsedRam(server);
  if (leaveMem > 0)
    mem -= leaveMem;
  let smem = ns.getScriptRam(script);
  return Math.floor(mem / smem);
}

export async function NukeServer(ns, target) {
  let n = target.name;
  if (ns.fileExists("BruteSSH.exe", "home"))
    await ns.brutessh(n);
  if (ns.fileExists("FTPCrack.exe", "home"))
    await ns.ftpcrack(n);
  if (ns.fileExists("relaySMTP.exe", "home"))
    await ns.relaysmtp(n);
  if (ns.fileExists("HTTPWorm.exe", "home"))
    await ns.httpworm(n);
  if (ns.fileExists("SQLInject.exe", "home"))
    await ns.sqlinject(n);
  await ns.nuke(n);
  target.nuked = true;
}

export async function ShowGrid(ns, ar) {
  let str1 = "";
  ar.forEach(row => {
    str1 = "";
    let str2 = "";
    row.forEach(cell => {
      let val = cell < 100 ? (cell < 10 && cell >= 0 ? " " + cell + " " : " " + cell) : cell;
      str1 += "+-----";
      str2 += "| " + val + " ";
    });
    str1 += "+";
    str2 += "|";
    ns.tprint(str1);
    ns.tprint(str2);
  });
  ns.tprint(str1);
}

export const LW_THREADS = 2;
export const LH_THREADS = 1;
export const LG_THREADS = 10;

export async function LoopHackMemRequired(ns, server) {
  let n = server == undefined?null:server.name;
  return (LW_THREADS * ns.getScriptRam("lw.js", n))
    + (LH_THREADS * ns.getScriptRam("lh.js", n))
    + (LG_THREADS * ns.getScriptRam("lg.js", n));
}

export async function BruteForceMemRequired(ns, server) {
  let n = server == undefined?null:server.name;
  return ns.getScriptRam("remote-hack.js", n);
}

export async function DeployHackScripts(ns, server, target, leaveMem = 0) {
  await NukeServer(ns, server);
  await NukeServer(ns, target);

  // Try LoopHackAlgorithms first
  if (server.ram >= leaveMem + await LoopHackMemRequired(ns, server.name)) {
    DeployLoopHackAlgorithms(ns, server, target, leaveMem);

  // brute force hacks backup
  } else if (server.ram > leaveMem + await BruteForceMemRequired(ns, server)) {
    DeployBruteForceHack(ns, server, target, leaveMem);
  }
}

export async function ResetHost(ns, server) {
  ns.killall(server.name);
}

export async function DeployBruteForceHack(ns, server, target, leaveMem = 0) {
  ns.killall(server.name);
  ns.scp("remote-hack.js", server.name);
  let t = await GetAvailableThreads(ns, server.name, "remote-hack.js", false, leaveMem);
  if (t > 0) {
    ns.exec("remote-hack.js", server.name, t, target.name);
  }
}

export async function DeployLoopHackAlgorithms(ns, server, target, leaveMem = 0) {
  ns.killall(server.name);
  ns.scp(["lw.js", "lh.js", "lg.js"], server.name);
  let block = await LoopHackMemRequired(ns, server);
  let free = ns.getServerMaxRam(server.name) - ns.getServerUsedRam(server.name) - leaveMem;
  let mult = Math.floor(free / block);
  //ns.print("multiplier = " + mult);
  ns.exec("lh.js", server.name, mult * LH_THREADS, target.name);
  ns.exec("lw.js", server.name, mult * LW_THREADS, target.name);
  ns.exec("lg.js", server.name, mult * LG_THREADS, target.name);
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
