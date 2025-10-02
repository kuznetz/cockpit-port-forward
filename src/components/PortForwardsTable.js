import React, { useState } from 'react';
import PortForwardEditRow from './PortForwardEditRow'
import { Button } from '@patternfly/react-core';
import { Table } from '@patternfly/react-table';

const PortForwardsTable = ({ api, zone, onReload }) => {
    const [editIndex, setEditIndex] = useState(-1)

    const handleFormSubmit = async (newRow) => {
        try {
            if (!newRow.port) throw new Error('Source port is reqired')
            if (!newRow.toport) throw new Error('Destination port is reqired')
            const newRowArr = [newRow.port, newRow.protocol, newRow.toport, newRow.toaddr]
            if (editIndex !== -1) {
                let oldRow = zone.forward_ports[editIndex]
                await api.removePortForward(zone, oldRow)
            }
            await api.addPortForward(zone, newRowArr)
            await api.reload()
            await onReload()

        } catch(e) {
            console.error(e)
            alert(e.message)
        }
    }    

    const handleRemoveForward = async (forward) => {
        if (!window.confirm('Are you sure you want to remove this port forward?'))
            return
        await api.removePortForward(zone, forward)
        await api.reload()
        await onReload()
    } 

    return (
        //role="grid" class="page-table pf-v6-c-table pf-m-grid-md pf-m-compact"
        <Table variant='compact' borders={true} style={{marginTop:  '10px'}}>
            <thead>
                <tr className="pf-v6-c-table__tr">
                    <th className="pf-v6-c-table__th" width="100">Src Port</th>
                    <th className="pf-v6-c-table__th" width="60">Proto</th>
                    <th className="pf-v6-c-table__th" width="100">Dest Port</th>
                    <th className="pf-v6-c-table__th" width="200">Dest Addr</th>
                    <th className="pf-v6-c-table__th" width="200"></th>
                </tr>
            </thead>
            <tbody>
                {zone.forward_ports? zone.forward_ports.map((forward, index) => (
                    (editIndex === index ?
                        <PortForwardEditRow key={index} row={forward} onSubmit={(row) => handleFormSubmit(row)} />:
                        <tr className="pf-row pf-v6-c-table__tr" key={index}>
                            <td onClick={() => setEditIndex(index)}>{forward[0]}</td>
                            <td onClick={() => setEditIndex(index)}>{forward[1]}</td>
                            <td onClick={() => setEditIndex(index)}>{forward[2]}</td>
                            <td onClick={() => setEditIndex(index)}>{forward[3] || 'localhost'}</td>
                            <td style={{textAlign:'right'}}>
                                <Button
                                    variant="secondary" size="sm"
                                    onClick={() => setEditIndex(index)}
                                    style={{marginRight:'10px'}}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="secondary" isDanger size="sm"
                                    onClick={() => handleRemoveForward(forward)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    )
                )) : []}
                {
                    (editIndex === -1) ?
                    <PortForwardEditRow onSubmit={(row) => handleFormSubmit(row)} /> :
                    <tr className="pf-row pf-v6-c-table__tr">
                        <td colSpan="5" style={{'textAlign': 'center'}}>
                            <a href="#" onClick={ (e) => { e.preventDefault(); setEditIndex(-1)}  } >
                                New port forward
                            </a>
                        </td>
                    </tr>
                }
            </tbody>
        </Table>
    );
};

export default PortForwardsTable;