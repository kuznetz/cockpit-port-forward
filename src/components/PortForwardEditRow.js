import React, { useState, useEffect } from 'react';
import { Button, TextInput, ValidatedOptions, FormSelect, FormSelectOption } from '@patternfly/react-core';

const protocols = ['tcp','udp','sctp','dccp']

const PortForwardEditRow = ({ row, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        port: row? row[0] : '',
        protocol: row? row[1] : 'tcp',
        toport: row? row[2] : '',
        toaddr: row? row[3] : '',
    });

    const portValid = (port) => {
        if (!port) return false
        let p = parseInt(port)
        if (isNaN(p) || p < 1 || p > 65535 ) return false
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <tr className="pf-v6-c-table__tr">
            <td>
                <TextInput
                    name="port"
                    value={formData.port}
                    onChange={handleChange}
                    placeholder=""
                    isRequired
                    validated={portValid(formData.port) ? null : ValidatedOptions.error}
                    type="text"                    
                />
            </td>
            <td>
                {/*<!--select
                    name="protocol"
                    value={formData.protocol}
                    onChange={handleChange}
                    style={{'height': '1.8rem'}}
                >
                    <option>tcp</option>
                    <option>udp</option>
                    <option>sctp</option>
                    <option>dccp</option>
                </select-->*/}
                <FormSelect name="protocol" value={formData.protocol} onChange={handleChange}>
                {protocols.map((option, index) => (
                    <FormSelectOption key={index} value={option} label={option} />
                ))}
                </FormSelect>                
            </td>
            <td>
                <TextInput
                    name="toport"
                    value={formData.toport}
                    onChange={handleChange}
                    placeholder=""
                    isRequired
                    validated={portValid(formData.toport) ? null : ValidatedOptions.error}
                    type="text"
                />
            </td>
            <td>
                <TextInput
                    type="text"
                    name="toaddr"
                    value={formData.toaddr}
                    onChange={handleChange}
                    placeholder=""
                />
            </td>
            <td style={{textAlign:'right'}}>
                <Button
                    variant="primary"
                    onClick={(e)=>handleSubmit(e)}
                >
                    {row ? 'Update' : 'Add'}
                </Button>                
            </td>
        </tr>
    );
};

export default PortForwardEditRow;