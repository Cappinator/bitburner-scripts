/** @param {NS} ns */
export async function main(ns, param1 = ns.args[0]) {

  if (param1 == "-b") {
    let qtyRam = await GetQtyRam(ns);
    ns.tprint(qtyRam);
    param1 = qtyRam.at(-1)[1];
    ns.tprint(param1);
  } 
  if (param1 > 0) {
    let cost = ns.getPurchasedServerCost(param1);
    let m = ns.getServerMoneyAvailable("home");
    let qty = Math.min(Math.floor(m/cost), 25);
    ns.tprint("qty = " + qty);
    let servers = await GetExistingServers(ns);
    ns.tprint("Existing servers = " + servers.length);
    qty -= servers.length;
    let toReplace = servers.filter(s => ns.getServerMaxRam(s) < param1);
    ns.tprint("to replace = " + toReplace.length);
    qty += toReplace.length;
    ns.tprint("qty = " + qty);
    toReplace.forEach(s => 
    {
      ns.killall(s);
      if (ns.deleteServer(s)) 
        ns.tprint("Deleted server " + s); 
      else 
        ns.tprint("Failed to delete server " + s);});
    for (let i = 0;i<qty;i++) {
      let name = ns.purchaseServer("SERVER_" + i, param1);
      ns.tprint("Server " + name + " with " + param1 + " GB RAM has been purchased.");
    }
  } else {
    let qtyRam = await GetQtyRam(ns);
    for (let qr of qtyRam) {
      ns.tprint("Can buy " + qr[0] + " servers with " + qr[1] + " GB RAM.");
    }
  }
}

async function GetQtyRam(ns) {
  let retval = [];
  let m = ns.getServerMoneyAvailable("home");
  let qty = 0;
  let i = 1;
  do {
    let ram = Math.pow(2, i);
    let cost = ns.getPurchasedServerCost(ram);
    qty = Math.floor(m/cost);
    if (qty > 0) {
      retval.push([qty,ram]);
      i++;
    }
  } while (qty > 0);
  return retval;
}

async function GetExistingServers(ns) {
  let servers = ns.scan("home");
  return servers.filter(s => s.includes("SERVER_"));
}