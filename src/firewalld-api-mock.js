class FirewalldAPI {
    constructor() {
    }

    async getZones() {
        return [
            {
                "name": "docker",
                "interfaces": [
                    "docker0",
                    "br-38455ad0f001"
                ],
                "path": "/org/fedoraproject/FirewallD1/config/zone/2",
                "version": "1.0",
                "short": "docker",
                "description": "zone for docker bridge network interfaces",
                "target": "ACCEPT",
                "masquerade": false,
                "icmp_block_inversion": false,
                "forward": true
            },
            {
                "name": "external",
                "interfaces": [
                    "enp6i1"
                ],
                "path": "/org/fedoraproject/FirewallD1/config/zone/4",
                "short": "External",
                "description": "For use on external networks. You do not trust the other computers on networks to not harm your computer. Only selected incoming connections are accepted.",
                "target": "default",
                "masquerade": true,
                "forward_ports": [
                    [
                        "8100",
                        "tcp",
                        "8100",
                        "192.168.100.10"
                    ],
                    [
                        "9987",
                        "udp",
                        "9987",
                        "192.168.100.10"
                    ],
                    [
                        "10011",
                        "tcp",
                        "10011",
                        "192.168.100.10"
                    ],
                    [
                        "30033",
                        "tcp",
                        "30033",
                        "192.168.100.10"
                    ]
                ],
                "icmp_block_inversion": false,
                "forward": false
            },
            {
                "name": "internal",
                "interfaces": [
                    "wg0",
                    "wg1"
                ],
                "path": "/org/fedoraproject/FirewallD1/config/zone/6",
                "short": "Internal",
                "description": "For use on internal networks. You mostly trust the other computers on the networks to not harm your computer. Only selected incoming connections are accepted.",
                "target": "ACCEPT",
                "services": [
                    "ssh",
                    "mdns",
                    "cockpit"
                ],
                "masquerade": false,
                "icmp_block_inversion": false,
                "forward": true
            },
            {
                "name": "service",
                "interfaces": [
                    "enp6i2"
                ],
                "path": "/org/fedoraproject/FirewallD1/config/zone/11",
                "short": "Service",
                "target": "default",
                "services": [
                    "ssh",
                    "cockpit"
                ],
                "masquerade": true,
                "forward_ports": [
                    [
                        "2202",
                        "tcp",
                        "22",
                        "192.168.100.10"
                    ]
                ],
                "icmp_block_inversion": false,
                "forward": false
            }
        ]
    }

    async addPortForward(zone, forward) {
        console.log('MOCK addPortForward', zone, forward)
    }

    async removePortForward(zone, forward) {
        console.log('MOCK removePortForward', zone, forward)
    }

    async setMasquare(zone, enabled) {
        console.log('MOCK setMasquare', zone, enabled)
    }    
}

export default FirewalldAPI;