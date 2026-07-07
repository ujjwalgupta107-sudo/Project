import { useEffect, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RefreshCcw, Target, Loader2, AlertTriangle } from 'lucide-react';
import { graphService } from '../../services/api/graphService';

export function FraudNetwork() {
  const [elements, setElements] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        const data = await graphService.getGraph();
        // Backend wraps each node/edge in { data: { id, label, type, riskScore } }
        const rawNodes: any[] = data.nodes || [];
        const rawEdges: any[] = data.edges || data.links || [];

        const nodes = rawNodes.map((n: any) => {
          const d = n.data || n; // support both wrapped and flat
          return {
            data: {
              id: String(d.id),
              label: d.label || String(d.id).slice(0, 8),
              type: (d.type || 'UNKNOWN').toUpperCase(),
              risk: d.riskScore ?? d.risk_score ?? d.risk ?? 0,
              cluster: d.cluster_id || null,
            }
          };
        });

        const edges = rawEdges
          .map((e: any) => {
            const d = e.data || e;
            return {
              data: {
                id: String(d.id || `${d.source}-${d.target}`),
                source: String(d.source),
                target: String(d.target),
                label: d.label || d.relationship_type || '',
              }
            };
          })
          // Guard: drop edges whose source/target nodes don't exist
          .filter((e: any) => {
            const nodeIds = new Set(nodes.map((n: any) => n.data.id));
            return nodeIds.has(e.data.source) && nodeIds.has(e.data.target);
          });

        const connectedNodeIds = new Set<string>();
        edges.forEach((e: any) => {
          connectedNodeIds.add(e.data.source);
          connectedNodeIds.add(e.data.target);
        });

        const filteredNodes = nodes.filter((n: any) => 
          connectedNodeIds.has(n.data.id) || n.data.type === 'CASE' || n.data.type === 'case'
        );

        setElements([...filteredNodes, ...edges]);
      } catch (err: any) {
        setError(err.message || 'Failed to load graph');
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  const handleReset = () => {
    setLoading(true);
    graphService.getGraph().then(data => {
        const rawNodes: any[] = data.nodes || [];
        const rawEdges: any[] = data.edges || data.links || [];

        const nodes = rawNodes.map((n: any) => {
          const d = n.data || n;
          return {
            data: {
              id: String(d.id),
              label: d.label || String(d.id).slice(0, 8),
              type: (d.type || 'UNKNOWN').toUpperCase(),
              risk: d.riskScore ?? d.risk_score ?? d.risk ?? 0,
              cluster: d.cluster_id || null,
            }
          };
        });

        const edges = rawEdges
          .map((e: any) => {
            const d = e.data || e;
            return {
              data: {
                id: String(d.id || `${d.source}-${d.target}`),
                source: String(d.source),
                target: String(d.target),
                label: d.label || d.relationship_type || '',
              }
            };
          })
          .filter((e: any) => {
            const nodeIds = new Set(nodes.map((n: any) => n.data.id));
            return nodeIds.has(e.data.source) && nodeIds.has(e.data.target);
          });

        const connectedNodeIds = new Set<string>();
        edges.forEach((e: any) => {
          connectedNodeIds.add(e.data.source);
          connectedNodeIds.add(e.data.target);
        });

        const filteredNodes = nodes.filter((n: any) => 
          connectedNodeIds.has(n.data.id) || n.data.type === 'CASE' || n.data.type === 'case'
        );
        setElements([...filteredNodes, ...edges]);
        if (cyRef.current) {
          setTimeout(() => cyRef.current?.fit(undefined, 50), 100);
        }
    }).catch(err => {
        setError(err.message || 'Failed to load graph');
    }).finally(() => {
        setLoading(false);
    });
  };

  const layout = {
    name: 'cose',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
  };

  const style: any[] = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'color': '#F8FAFC',
        'font-size': '12px',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
        'background-color': '#334155',
        'width': 30,
        'height': 30,
        'border-width': 2,
        'border-color': '#0F172A',
      }
    },
    {
      selector: 'node[type = "case"]',
      style: { 'background-color': '#06B6D4', 'shape': 'hexagon' }
    },
    {
      selector: 'node[type = "PHONE"], node[type = "phone"]',
      style: { 'background-color': '#F59E0B', 'shape': 'round-rectangle' }
    },
    {
      selector: 'node[type = "UPI_ID"], node[type = "upi"], node[type = "bank"]',
      style: { 'background-color': '#10B981', 'shape': 'diamond', 'width': 35, 'height': 35 }
    },
    {
      selector: 'node[type = "DOMAIN"], node[type = "domain"]',
      style: { 'background-color': '#8B5CF6', 'shape': 'triangle' }
    },
    {
      selector: 'node[risk >= 0.9], node[risk >= 90]',
      style: { 'border-color': '#EF4444', 'border-width': 4 }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#334155',
        'target-arrow-color': '#334155',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'opacity': 0.6
      }
    },
    {
      selector: ':selected',
      style: {
        'border-width': 4,
        'border-color': '#06B6D4',
        'line-color': '#06B6D4',
        'target-arrow-color': '#06B6D4',
        'opacity': 1
      }
    }
  ];

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 50);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Fraud Network Explorer</h2>
          <p className="text-text-secondary">Visualize connections between cases and extracted entities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex items-center gap-2" onClick={handleReset}><RefreshCcw className="w-4 h-4"/> Reset</Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-[500px]">
        <Card className="flex-1 relative overflow-hidden bg-[#0b1120]">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1120]/80 z-20">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading graph...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0b1120]/80 z-20">
              <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
                <p className="text-status-critical">{error}</p>
              </div>
            </div>
          )}
          {/* Controls Overlay */}
          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            <Button variant="secondary" size="sm" onClick={handleFit} className="px-2 bg-surface-elevated/80 backdrop-blur"><Target className="w-4 h-4"/></Button>
          </div>
          
          {!loading && !error && elements.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary">
              <p className="text-lg font-medium">No graph data available</p>
              <p className="text-sm mt-2">Graph will populate as scam cases are processed.</p>
            </div>
          )}
          {!loading && elements.length > 0 && (
            <CytoscapeComponent
              elements={elements}
              layout={layout}
              stylesheet={style}
              style={{ width: '100%', height: '100%' }}
              cy={(cy) => {
                cyRef.current = cy;
                cy.on('tap', 'node', (evt) => {
                  const node = evt.target;
                  setSelectedNode(node.data());
                });
                cy.on('tap', (evt) => {
                  if (evt.target === cy) setSelectedNode(null);
                });
              }}
            />
          )}
        </Card>

        {/* Side Panel for Selected Node */}
        {selectedNode && (
          <Card className="w-80 shrink-0 h-full overflow-y-auto hidden lg:block">
            <div className="p-4 border-b border-surface-raised flex justify-between items-center bg-surface-elevated/50">
              <h3 className="font-bold text-lg">Entity Details</h3>
              <button onClick={() => setSelectedNode(null)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            <CardContent className="p-4 space-y-4">
              <div>
                <div className="text-xs text-text-muted uppercase mb-1">Type</div>
                <div className="font-medium px-2 py-1 bg-surface-raised inline-block rounded text-sm uppercase">
                  {selectedNode.type}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-text-muted uppercase mb-1">Value</div>
                <div className="font-mono text-brand-cyan">{selectedNode.label || selectedNode.id}</div>
              </div>

              {selectedNode.risk !== undefined && (
                <div>
                  <div className="text-xs text-text-muted uppercase mb-1">Risk Score</div>
                  <div className={`text-xl font-bold ${(selectedNode.risk >= 90 || selectedNode.risk >= 0.9) ? 'text-status-critical' : (selectedNode.risk >= 70 || selectedNode.risk >= 0.7) ? 'text-status-warning' : 'text-status-safe'}`}>
                    {(selectedNode.risk > 1 ? selectedNode.risk : (selectedNode.risk * 100).toFixed(0))}%
                  </div>
                </div>
              )}

              {selectedNode.cluster && (
                <div>
                  <div className="text-xs text-text-muted uppercase mb-1">Associated Cluster</div>
                  <div className="font-mono text-sm">{selectedNode.cluster}</div>
                </div>
              )}
              
              <div className="pt-4 border-t border-surface-raised">
                <Button className="w-full">View Full Intelligence</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
