import cockpit from 'cockpit';

class FirewalldAPI {
    constructor() {
        this.dbus = cockpit.dbus(`org.fedoraproject.FirewallD1`, { 
            bus: 'system', 
            superuser: 'require' 
        });
    }

    async getZones() {
        try {
            let zoneNames = await this.dbus.call(
                '/org/fedoraproject/FirewallD1',
                `org.fedoraproject.FirewallD1.zone`,
                'getActiveZones',//'getZones',
                []
            )
            /*let zoneNames = await this.dbus.call(
                '/org/fedoraproject/FirewallD1/config',
                `org.fedoraproject.FirewallD1.config`,
                'getZoneNames',//'getZones',
                []
            )*/            
            zoneNames = zoneNames[0]
            //console.log('zoneNames', zoneNames)

            let zones = []
            for (let zn in zoneNames) {
                let zonePath = await this.dbus.call(
                    `/org/fedoraproject/FirewallD1/config`,
                    `org.fedoraproject.FirewallD1.config`,
                    'getZoneByName',
                    [zn]
                )
                //console.log('zonePath', zonePath)
                zonePath = zonePath[0]

                let settings = await this.dbus.call(
                    zonePath,
                    `org.fedoraproject.FirewallD1.config.zone`,
                    'getSettings2',
                    []
                )
                settings = settings[0]
                //console.log('settings', settings)
                for (let i in settings) {
                    settings[i] = settings[i].v
                }
                zones.push({
                    name: zn,
                    interfaces: zoneNames[zn].interfaces,
                    path: zonePath,
                    ...settings,
                })
            }

            //console.log('return zones', zones)
            return zones;
        } catch (error) {
            //console.error('Error getting zones:', error);
            throw error;
        }
    }

    async setMasquare(zone, enabled) {
        await this.dbus.call(
            zone.path,
            `org.fedoraproject.FirewallD1.config.zone`,
            enabled?'addMasquerade':'removeMasquerade',
            []
        )
    }

    async addPortForward(zone, forward) {
        await this.dbus.call(
            zone.path,
            `org.fedoraproject.FirewallD1.config.zone`,
            'addForwardPort',
            forward
        )
    }

    async removePortForward(zone, forward) {
        //removeForwardPort(s: port, s: protocol, s: toport, s: toaddr)
        await this.dbus.call(
            zone.path,
            `org.fedoraproject.FirewallD1.config.zone`,
            'removeForwardPort',
            forward
        )
    }

    async reload() {
        await this.dbus.call(
            '/org/fedoraproject/FirewallD1',
            `org.fedoraproject.FirewallD1`,
            'reload',
            []
        )        
    }

}

export default FirewalldAPI;