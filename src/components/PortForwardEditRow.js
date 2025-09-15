import React, { useState, useEffect } from 'react';
import { Select, SelectOption, SelectList } from '@patternfly/react-core';

const protocols = ['tcp','udp','sctp','dccp']

const PortForwardEditRow = ({ row, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        port: row? row[0] : '',
        protocol: row? row[1] : 'tcp',
        toport: row? row[2] : '',
        toaddr: row? row[3] : '',
    });

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
        <tr>
            <td>
                <input
                    type="text"
                    name="port"
                    value={formData.port}
                    onChange={handleChange}
                    placeholder="80"
                    required
                    className="form-control"
                />
            </td>
            <td>
                <select
                    name="protocol"
                    value={formData.protocol}
                    onChange={handleChange}
                    style={{'height': '1.8rem'}}
                >
                    <option>tcp</option>
                    <option>udp</option>
                    <option>sctp</option>
                    <option>dccp</option>
                </select>                
            </td>
            <td>
                <input
                    type="text"
                    name="toport"
                    value={formData.toport}
                    onChange={handleChange}
                    placeholder="8080"
                    required
                    className="form-control"
                />
            </td>
            <td>
                <input
                    type="text"
                    name="toaddr"
                    value={formData.toaddr}
                    onChange={handleChange}
                    placeholder="192.168.1.100"
                    className="form-control"
                />
            </td>
            <td>
                <button onClick={(e)=>handleSubmit(e)} className="btn btn-primary">
                    {row ? 'Update' : 'Add'}
                </button>                
            </td>
        </tr>
    );
};

export default PortForwardEditRow;