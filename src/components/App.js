import React, { useState, useEffect } from 'react';
import {
  Panel, PanelMain, PanelMainBody, PanelHeader,
  Card, CardTitle, CardBody,
  Title, Switch, Alert, AlertActionCloseButton
} from '@patternfly/react-core';

import FirewalldAPI from 'firewalld-api';
import LoadingSpinner from './LoadingSpinner';
import PortForwardsTable from './PortForwardsTable';

const App = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const api = new FirewalldAPI();

    const loadZones = async () => {
        setLoading(true);
        try {
            const zoneList = await api.getZones();
            setZones(zoneList);
        } catch (error) {
            setError('Failed to load zones: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMasquerade = async (zone) => {
        try {
            await api.setMasquare(zone, !zone.masquerade);
            await loadZones();
        } catch (error) {
            setError('Failed to toggle masquerade: ' + error.message);
        }
    }

    useEffect(() => {
        loadZones();
    }, [])

    return (
        <Panel>
            <PanelHeader>
                <Title headingLevel="h1" size="lg">Firewalld Port Forward</Title>
            </PanelHeader>
            <PanelMain><PanelMainBody>
            <div style={{ display:'flex', flexDirection: 'column', 'gap': '0.5rem'}} >

                {error && (
                    <Alert variant="warning" title="Error"
                      actionClose={<AlertActionCloseButton onClose={() => setError('')} />}
                    >
                        <p>{error}</p>
                    </Alert>
                )}

                { loading && <LoadingSpinner /> }
                { !loading && zones.map(zone => (
                    <Card key={zone.name}>
                        <CardTitle>
                            <Title headingLevel="h2" size="lg">Zone {zone.short}</Title>
                        </CardTitle>
                        <CardBody>
                            <div>
                                <Switch
                                    isChecked={zone.masquerade}
                                    onChange={() => toggleMasquerade(zone)}                                
                                    label="Masquerading (required for port forwarding to work correctly)"
                                />
                            </div>
                            { (zone.masquerade)? <PortForwardsTable api={api} zone={zone} onReload={loadZones} />: null }
                        </CardBody>
                    </Card>
                ))}
            </div>
            </PanelMainBody></PanelMain>
        </Panel>
    );
};

export default App;