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
                '/org/fedoraproject/FirewallD1/config',
                `org.fedoraproject.FirewallD1.config`,
                'listZones',//'getZones',
                []
            )
            zoneNames = zoneNames[0]
            console.log('zoneNames', zoneNames)

            let zones = []
            for (let zn in zoneNames) {
                let zonePath = await this.dbus.call(
                    `/org/fedoraproject/FirewallD1/config`,
                    `org.fedoraproject.FirewallD1.config`,
                    'getZoneByName',
                    [zn]
                )
                console.log('zonePath', zonePath)
                zonePath = zonePath[0]

                let settings = await this.dbus.call(
                    zonePath,
                    `org.fedoraproject.FirewallD1.config.zone`,
                    'getSettings2',
                    []
                )
                settings = settings[0]
                console.log('settings', settings)
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
            '/org/fedoraproject/FirewallD1',
            `org.fedoraproject.FirewallD1.zone`,
            'getActiveZones',//'getZones',
            []
        )
    }

    async addPortForward(zone, forward) {
        try {
            await this.dbus.call(
                '/org/fedoraproject/FirewallD1',
                `org.fedoraproject.FirewallD1.zone`,
                'getActiveZones',//'getZones',
                []
            )

            await zoneObj.addPortForward(
                forward.port,
                forward.protocol,
                forward.toport,
                forward.toaddr,
                forward.options || {}
            );
            return true;
        } catch (error) {
            console.error('Error adding port forward:', error);
            throw error;
        }
    }

    async removePortForward(zone, forward) {
        try {
            const proxy = await this.dbus.proxy();
            const zonePath = await proxy.getZoneByName(zone);
            const zoneProxy = cockpit.dbus('org.fedoraproject.FirewallD1', {
                bus: 'system',
                path: zonePath[0],
                superuser: 'require'
            });
            
            const zoneObj = await zoneProxy.proxy();
            await zoneObj.removePortForward(
                forward.port,
                forward.protocol,
                forward.toport,
                forward.toaddr
            );
            return true;
        } catch (error) {
            console.error('Error removing port forward:', error);
            throw error;
        }
    }

    async setMasquare(zone, enabled) {
    }
}

export default FirewalldAPI;