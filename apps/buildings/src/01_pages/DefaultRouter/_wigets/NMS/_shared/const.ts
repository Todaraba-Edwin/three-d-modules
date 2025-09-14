// Type Definitions for Index Signatures
type DeviceInfo = { id: number; type: string; name: string };

type PortDeviceMap = {
  [key: number]: {
    // switchId
    [key: number]: DeviceInfo; // portId
  };
};

type DeviceDetailMap = {
  [key: number]: { name: string; ip: string; mac: string; status: string };
};

// Mock Data
export const coreSwitch = {
  ip: '192.168.1.1',
  model: 'Cisco Catalyst 9500',
  ports: Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    connected: i < 20,
  })),
};

export const accessSwitches = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `IDF-${i + 1} 액세스 스위치`,
  model: 'Cisco Catalyst 2960',
  uplinkPort: 25 + i,
  ports: {
    rj45: Array.from({ length: 8 }, (__, j) => ({
      id: j + 1,
      connected: Math.random() > 0.5,
    })),
    sfp: Array.from({ length: 4 }, (__, j) => ({
      id: j + 9,
      connected: j === 0,
    })),
  },
}));

// Updated mock data to be port-centric
export const devices: PortDeviceMap = {
  1: {
    // switchId
    1: { id: 1, type: 'CCTV', name: 'CAM-01' }, // portId
    3: { id: 2, type: 'AP', name: 'AP-01-01' },
  },
  2: {
    2: { id: 3, type: 'PC', name: 'PC-DEV-01' },
  },
  3: {
    1: { id: 4, type: 'CCTV', name: 'CAM-02' },
  },
  4: {
    6: { id: 1, type: 'CCTV', name: 'CAM-01' },
    7: { id: 3, type: 'PC', name: 'PC-DEV-1' },
    8: { id: 2, type: 'AP', name: 'AP-01-01' },
  },
};

export const deviceDetails: DeviceDetailMap = {
  1: {
    name: 'CAM-01',
    ip: '10.10.1.101',
    mac: '00:1A:2B:3C:4D:5E',
    status: '활성',
  },
  2: {
    name: 'AP-01-01',
    ip: '10.10.1.102',
    mac: '00:1A:2B:3C:4D:5F',
    status: '활성',
  },
  3: {
    name: 'PC-DEV-01',
    ip: '10.10.2.50',
    mac: '00:1A:2B:3C:4D:6A',
    status: '활성',
  },
  4: {
    name: 'CAM-02',
    ip: '10.10.3.101',
    mac: '00:1A:2B:3C:4D:7B',
    status: '비활성',
  },
};
