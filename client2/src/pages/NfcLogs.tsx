import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import nfcService, { NfcLog, NfcEventType } from '../services/nfc.service';
import './NfcLogs.css';

const NfcLogs: React.FC = () => {
  const [logs, setLogs] = useState<NfcLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const logData = await nfcService.getNfcLogs(200); // Get last 200 logs
        setLogs(logData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch NFC logs:', err);
        setError('Failed to load NFC logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    // Set up a refresh interval every 30 seconds
    const intervalId = setInterval(fetchLogs, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getBadgeVariant = (eventType: NfcEventType): string => {
    switch (eventType) {
      case NfcEventType.LAP_LOGGED:
        return 'success';
      case NfcEventType.RUNNER_STARTED:
        return 'primary';
      case NfcEventType.ERROR:
        return 'danger';
      case NfcEventType.SCAN_THROTTLED:
        return 'warning';
      case NfcEventType.TAG_REGISTERED:
        return 'info';
      case NfcEventType.TAG_ASSIGNED:
        return 'secondary';
      case NfcEventType.TAG_UNASSIGNED:
        return 'secondary';
      case NfcEventType.SCAN:
      default:
        return 'light';
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    // Get date object from string or date
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return format(date, 'HH:mm:ss dd/MM/yyyy');
  };

  if (loading && logs.length === 0) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading NFC logs...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 nfc-logs-container">
      <Row>
        <Col>
          <h2>NFC Activity Logs</h2>
          <p>Monitoring NFC tag scans and events</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="table-responsive">
            <Table striped bordered hover className="nfc-logs-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                  <th>Tag ID</th>
                  <th>Runner</th>
                  <th>Details</th>
                  <th>Lap</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">No NFC logs found</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className={log.eventType === NfcEventType.ERROR ? 'table-danger' : ''}>
                      <td>{formatTimestamp(log.timestamp)}</td>
                      <td>
                        <Badge bg={getBadgeVariant(log.eventType)}>
                          {nfcService.getEventTypeDisplay(log.eventType)}
                        </Badge>
                        {log.isThrottled && (
                          <Badge bg="warning" className="ms-1">Throttled</Badge>
                        )}
                      </td>
                      <td>
                        {log.tagId ? (
                          <div>
                            <code>{nfcService.formatTagId(log.tagId)}</code>
                            {log.tag && (
                              <div className="tag-details">
                                <small className="text-muted d-block">
                                  <span title="Tag Status">
                                    <Badge bg={log.tag.isActive ? "success" : "secondary"} className="me-1">
                                      {log.tag.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </span>
                                </small>
                                <small className="text-muted d-block">
                                  <span title="First Seen">
                                    First seen: {format(new Date(log.tag.firstSeen), 'dd/MM/yyyy')}
                                  </span>
                                </small>
                                {log.tag.lastAssigned && (
                                  <small className="text-muted d-block">
                                    <span title="Last Assigned">
                                      Assigned: {format(new Date(log.tag.lastAssigned), 'dd/MM/yyyy')}
                                    </span>
                                  </small>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {log.runner ? (
                          <div>
                            <div><strong>#{log.runner.runnerNumber}</strong></div>
                            <div>{log.runner.firstName} {log.runner.lastName}</div>
                          </div>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </td>
                      <td>
                        {log.details || log.errorMessage || <span className="text-muted">-</span>}
                      </td>
                      <td>
                        {log.lapNumber !== undefined && log.lapNumber !== null ? (
                          <Badge bg="success">{log.lapNumber}</Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NfcLogs;
