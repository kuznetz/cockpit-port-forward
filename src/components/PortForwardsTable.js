import React, { useState } from 'react';
import PortForwardEditRow from './PortForwardEditRow'
import {
  Table
} from '@patternfly/react-table';

const PortForwardsTable = ({ api, zone, onReload }) => {
    const [editIndex, setEditIndex] = useState(-1)

    const handleFormSubmit = async (newRow) => {
        try {
            if (!newRow.port) throw new Error('Source port is reqired')
            if (!newRow.toport) throw new Error('Destination port is reqired')
            const newRowArr = [newRow.port, newRow.protocol, newRow.toport, newRow.toaddr]
            if (editIndex !== -1) {
                let oldRow = zone.forward_ports[editIndex]
                await api.removePortForward(zone.name, oldRow)
            }
            await api.addPortForward(zone.name, newRowArr)
            await onReload()

        } catch(e) {
            console.error(e)
            alert(e.message)
        }
    }    

    const handleRemoveForward = async (forward) => {
        if (!window.confirm('Are you sure you want to remove this port forward?'))
            return
        await api.removePortForward(zone.name, forward)
        await onReload()
    } 

    return (
        //role="grid" class="page-table pf-v6-c-table pf-m-grid-md pf-m-compact"
        <Table variant='compact' borders={true} style={{marginTop:  '10px'}}>
            <thead>
                <tr>
                    <th width="100">Src Port</th>
                    <th width="60">Proto</th>
                    <th width="100">Dest Port</th>
                    <th width="200">Dest Addr</th>
                    <th width="200"></th>
                </tr>
            </thead>
            <tbody>
                {zone.forward_ports? zone.forward_ports.map((forward, index) => (
                    (editIndex === index ?
                        <PortForwardEditRow key={index} row={forward} onSubmit={(row) => handleFormSubmit(row)} />:
                        <tr key={index}>
                            <td onClick={() => setEditIndex(index)}>{forward[0]}</td>
                            <td onClick={() => setEditIndex(index)}>{forward[1]}</td>
                            <td onClick={() => setEditIndex(index)}>{forward[2]}</td>
                            <td onClick={() => setEditIndex(index)}>{forward[3] || 'localhost'}</td>
                            <td>
                                <button
                                    className="btn btn-default btn-sm"
                                    onClick={() => setEditIndex(index)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveForward(forward)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    )
                )) : []}
                {
                    (editIndex === -1) ?
                    <PortForwardEditRow onSubmit={(row) => handleFormSubmit(row)} /> :
                    <tr>
                        <td colSpan="5" style={{'textAlign': 'center'}}>
                            <button className="btn btn-danger btn-sm"
                                onClick={() => setEditIndex(-1)}
                            >
                                New port forward
                            </button>
                        </td>
                    </tr>
                }
            </tbody>
        </Table>
    );
};

export default PortForwardsTable;