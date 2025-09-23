import {
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
  type CoordinateExtent,
  type Edge,
  type Node,
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useMemo, type ReactNode } from 'react';
import {
  accessSwitches,
  coreSwitch,
  devices,
  extendSwitch,
} from '../_shared/const';
import IconNode from './IconNode';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220; // Adjusted for icon
const nodeHeight = 50;

// This function now takes generated nodes/edges and lays them out
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' | 'RL' | 'BT' = 'LR'
): { nodes: Node[]; edges: Edge[] } => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, align: 'UL', ranksep: 300 }); // Align to Upper-Left

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, {
      width: Number(node.style?.width) || nodeWidth,
      height: Number(node.style?.height) || nodeHeight,
    });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes: Node[] = nodes.map(node => {
    const nodeFromDagre: {
      x: number;
      y: number;
      width: number;
      height: number;
    } = dagreGraph.node(node.id);
    const { x, y, width, height } = nodeFromDagre;
    return {
      ...node,
      // Position nodes from their center
      position: { x: x - width / 2, y: y - height / 2 },
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
    };
  });

  return { nodes: layoutedNodes, edges };
};

// This function generates the raw nodes and edges from network data
const generateInitialElements = (): { nodes: Node[]; edges: Edge[] } => {
  const generatedNodes: Node[] = [];
  const generatedEdges: Edge[] = [];

  // 1. Core Switch (MDF) Node
  const mdfNode: Node = {
    id: `mdf-${coreSwitch.id}`,
    type: 'iconNode',
    position: { x: 0, y: 0 }, // dagre will override this
    data: { label: `MDF - ${coreSwitch.model}`, icon: 'server', type: 'core' },
  };
  generatedNodes.push(mdfNode);

  // 2. Access Switch Nodes and Edges
  accessSwitches.forEach(accessSwitch => {
    const accessNode: Node = {
      id: `access-${accessSwitch.id}`,
      type: 'iconNode',
      position: { x: 0, y: 0 }, // dagre will override this
      data: { label: accessSwitch.name, icon: 'router', type: 'access' },
    };
    generatedNodes.push(accessNode);

    generatedEdges.push({
      id: `edge-mdf-access-${accessSwitch.id}`,
      source: mdfNode.id,
      target: accessNode.id,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 5 },
    });

    // 3. Device Nodes and Edges
    const switchDevices = devices[accessSwitch.id];
    if (switchDevices) {
      Object.entries(switchDevices).forEach(([portId, deviceInfo]) => {
        const deviceNode: Node = {
          id: `device-${accessSwitch.id}-${portId}`,
          type: 'iconNode',
          position: { x: 0, y: 0 }, // dagre will override this
          data: {
            label: `${deviceInfo.name} (${deviceInfo.type})`,
            icon: 'device',
            type: 'device',
          },
        };
        generatedNodes.push(deviceNode);
        generatedEdges.push({
          id: `edge-access-${accessSwitch.id}-device-${portId}`,
          source: accessNode.id,
          target: deviceNode.id,
          animated: true,
          style: { stroke: '#a78bfa', strokeWidth: 2 },
        });
      });
    }

    // 4. Extended Switch Nodes and Edges
    const extendedSwitches = extendSwitch[accessSwitch.id];
    if (extendedSwitches) {
      extendedSwitches.forEach(extSwitch => {
        const extNode: Node = {
          id: `ext-${extSwitch.id}`,
          type: 'iconNode',
          position: { x: 0, y: 0 }, // dagre will override this
          data: {
            label: `${extSwitch.name} (중계)`,
            icon: 'router',
            type: 'access',
          },
        };
        generatedNodes.push(extNode);
        generatedEdges.push({
          id: `edge-access-${accessSwitch.id}-ext-${extSwitch.id}`,
          source: accessNode.id,
          target: extNode.id,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 5 },
        });

        if (accessSwitch.id === 1 && extSwitch.id === 201) {
          const mockDevices = [
            { port: 1, name: 'CCTV-101', type: 'CCTV' },
            { port: 2, name: 'AP-101', type: 'AP' },
          ];
          mockDevices.forEach(device => {
            const deviceNode: Node = {
              id: `device-ext-${extSwitch.id}-${device.port}`,
              type: 'iconNode',
              position: { x: 0, y: 0 }, // dagre will override this
              data: {
                label: `${device.name} (${device.type})`,
                icon: 'device',
                type: 'device',
              },
            };
            generatedNodes.push(deviceNode);
            generatedEdges.push({
              id: `edge-ext-${extSwitch.id}-device-${device.port}`,
              source: extNode.id,
              target: deviceNode.id,
              animated: true,
            });
          });
        }
      });
    }
  });

  return { nodes: generatedNodes, edges: generatedEdges };
};

export const NMSFlowMap = (): ReactNode => {
  const { nodes, edges } = useMemo(() => {
    const { nodes: initialNodes, edges: initialEdges } =
      generateInitialElements();
    return getLayoutedElements(initialNodes, initialEdges, 'LR');
  }, []);

  const translateExtent = useMemo((): CoordinateExtent => {
    if (nodes.length === 0) {
      return [
        [0, 0],
        [0, 0],
      ];
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      const width = nodeWidth;
      const height = nodeHeight;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    const padding = 100;
    return [
      [minX - padding, minY - padding],
      [maxX + padding, maxY + padding],
    ];
  }, [nodes]);

  const nodeTypes = useMemo(() => ({ iconNode: IconNode }), []);

  const mdfNode = useMemo(
    () => nodes.find(n => n.id.startsWith('mdf-')),
    [nodes]
  );

  const defaultViewport: Viewport = useMemo(() => {
    return {
      x: translateExtent[1][0] / 2,
      y: Math.abs(translateExtent[0][1]),
      zoom: 0.8,
    };
  }, [translateExtent]);

  return (
    <ReactFlowProvider>
      <div className='p-4 h-full bg-white rounded-lg relative'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          translateExtent={translateExtent}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          minZoom={0.5}
          maxZoom={1.8}
        />
        <Button mdfNode={mdfNode} />
      </div>
    </ReactFlowProvider>
  );
};

const Button = ({ mdfNode }: { mdfNode: Node | undefined }) => {
  const store = useStoreApi();
  const { setCenter } = useReactFlow();

  const focusNode = () => {
    if (!mdfNode) return;
    const { nodeLookup } = store.getState();
    const nodes = Array.from(nodeLookup)
      .map(([, node]) => node)
      .find(list => list.id === mdfNode.id);

    if (nodes) {
      if (nodes.measured.width && nodes.measured.height) {
        const x = nodes.position.x + nodes.measured.width / 2;
        const y = nodes.position.y + nodes.measured.height / 2;
        const zoom = 1.8;

        setCenter(x, y, { zoom, duration: 1500 });
      }
    }
  };

  return (
    <button
      onClick={focusNode}
      className=' absolute top-2 left-2 z-40 p-2 rounded-xl bg-black text-white hover:bg-slate-500 active:bg-black'
    >
      메인 스위치로 이동하기
    </button>
  );
};
