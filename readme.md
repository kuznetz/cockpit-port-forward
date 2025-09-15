# Cockpit Port Forward Manager

This plugin provides a UI within the Cockpit web console for managing firewalld port forwarding rules. It allows system administrators to easily view, add, edit, and remove port forwarding rules without needing to use command-line tools.

Unfortunately, the default firewall settings do not have port forwarding and masquerading, this UI complements the functionality of the cockpit.

## Key Features

- **Masquerading**:
  - Toggle IP Masquerading ON or OFF
  - Masquerading required for port forwarding to work correctly
- **Port Forward Operations**: 
  - Add new port forwarding rules
  - Edit existing rules
  - Remove rules with confirmation
  - Port-to-port forwarding
  - Optional destination address specification

## Technical Details

- **Framework**: Built with React.js (v18+) for a modern, component-based UI
- **Communication**: Uses D-Bus to interact with firewalld service
- **Privileges**: Requires superuser access for firewall modifications

## Building

1. Install dependencies:
```bash
npm install
```

2. Build the plugin:
```bash
npm run build
```

3. Deploy to Cockpit:
   - Copy the `port-forward` directory to `/usr/share/cockpit/`
   - Or create a symbolic link from your development directory

## Requirements

- Cockpit installed and running
- firewalld service active
- Node.js and npm for development builds

## Security Notes

- The plugin requires superuser privileges to modify firewall settings
- All changes are applied immediately to the running firewall configuration
- Users must have appropriate Cockpit permissions to access the plugin

This plugin simplifies firewall management for system administrators by providing a user-friendly web interface for port forwarding configuration, reducing the need for command-line operations and minimizing configuration errors.