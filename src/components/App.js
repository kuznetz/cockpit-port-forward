import React, { useState, useEffect } from 'react';
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
            await api.setMasquare(zone.name, !zone.masquerade);
            await loadZones();
        } catch (error) {
            setError('Failed to toggle masquerade: ' + error.message);
        }
    }

    useEffect(() => {
        loadZones();
    }, [])

    return (
        <div className="container-fluid">
            <div className="page-header">
                <h2>Firewalld Port Forward</h2>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                    <button 
                        type="button" 
                        className="close" 
                        onClick={() => setError('')}
                    >
                        &times;
                    </button>
                </div>
            )}

            { loading && <LoadingSpinner /> }
            { !loading && zones.map(zone => (
                <div key={zone.name} style={{'marginBottom': '1rem'}}>
                    <h2>Zone {zone.short}</h2>
                    <div>
                        <button type="button" style={{ 'marginRight':'5px' }} onClick={() => toggleMasquerade(zone)}>
                            { zone.masquerade? 'ON' : 'OFF' }
                        </button>                        
                        Masquerading (required for port forwarding to work correctly)
                    </div>
                    { (zone.masquerade)? <PortForwardsTable api={api} zone={zone} onReload={loadZones} />: null }
                </div>
            ))}
        </div>
    );
};

export default App;