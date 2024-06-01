import { ServerData } from "classes.js";
var servers = [];
var serversToScan = [];
var paths;

export async function ScanServers(ns) {
  servers = [];
  serversToScan = ["home"];
  await PopulateServersToScan(ns);
  await ProcessServersToScan(ns);
  return servers;
}

export async function SortByMoney(ns, serversToFilter) {
  return serversToFilter.sort((a,b) => b.maxMoney-a.maxMoney );
}

export async function FilterHackableServers(ns, serversToFilter, mp, hs) {
  let filteredServers = serversToFilter.filter(function(sd) {
    let t = sd.reqPorts <= mp && sd.hackSkill <= hs;
    ns.print("Checking if " + sd.reqPorts + " <= " + mp + " ? " + t);
    return(t);
  });
  return filteredServers;
}

async function PopulateServersToScan(ns) {
  paths = new Object();
  serversToScan = ["home"];
  paths["home"] = [];
  let idx = 0;
  while(idx < serversToScan.length) {
    let serverName = serversToScan[idx++];
    let s = await ns.scan(serverName);
    for(let i=0;i<s.length;i++) {
      let sn = s[i];
      if(!serversToScan.includes(sn)) {
        serversToScan.push(sn);
        paths[sn] = paths[serverName].concat(new Array(serverName));
      }
    }
  }
}

async function ProcessServersToScan(ns) {
  while(serversToScan.length > 0) {
    let serverName = serversToScan.shift();
    await ScanServer(ns, serverName);    
  }
}

async function ScanServer(ns, serverName) {
//  ns.print("Scanning server: " + serverName);

  let root = ns.hasRootAccess(serverName);
  let ram = ns.getServerMaxRam(serverName);
  let hackSkill = ns.getServerRequiredHackingLevel(serverName);
  let secLevel = ns.getServerMinSecurityLevel(serverName);
  let maxMoney = ns.getServerMaxMoney(serverName);
  let reqPorts = ns.getServerNumPortsRequired(serverName);

  let sd = new ServerData(serverName, root, ram, hackSkill, secLevel, maxMoney, reqPorts, paths[serverName]);
//  ns.print(sd);
  servers.push(sd);

}
