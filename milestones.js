import { ScanServers } from "discover.js";
import { ServerData } from "classes.js";

/** @param {NS} ns */
export async function main(ns) {

  let servers = await ScanServers(ns);
  // CSEC
  await FindServer(ns, servers, "CSEC");
  // avmnite-02h
  await FindServer(ns, servers, "avmnite-02h");
  // I.I.I.I
  await FindServer(ns, servers, "I.I.I.I");
  // run4theh111z
  await FindServer(ns, servers, "run4theh111z");
}

async function FindServer(ns, servers, name) {
  let server = servers.filter(s => s.name == name)[0];
  ns.tprint(server.name + ": " + server.path.join(" > "));
  
}