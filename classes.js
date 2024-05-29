export class ServerData {

  constructor(name, root, ram, hackSkill, secLevel, maxMoney, reqPorts) {
    this.name = name;
    this.root = root;
    this.ram = ram;
    this.hackSkill = hackSkill;
    this.secLevel = secLevel;
    this.maxMoney = maxMoney;
    this.reqPorts = reqPorts;
    this.nuked = false;
    this.backdoor = false;
  }

  print(ns) {
    ns.print(this.name);
    ns.print(this.root);
    ns.print(this.ram);
    ns.print(this.hackSkill);
    ns.print(this.secLevel);
    ns.print(this.maxMoney);
    ns.print(this.reqPorts);
    ns.print(this.nuked);
    ns.print(this.backdoor);
  }

  info(ns) {
    ns.print(this.name + " (ram=" + this.ram+ ", hackskill=" + this.hackSkill + ", seclevel=" + this.secLevel + ", maxmoney=" + this.maxMoney + ", reqports=" + this.reqPorts + ")");
  }

}
