"use client";
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, Badge,
  List, ListItem, ListItemText, Divider, Chip, Select, MenuItem, 
  FormControl, InputLabel, Button, Pagination, CircularProgress,
  IconButton, Tooltip, Avatar
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import SpeedIcon from '@mui/icons-material/Speed';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { API_BASE_URL, getPriorityNotifications, Log } from './utils';

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [priorityNotifications, setPriorityNotifications] = useState([]);
  const [viewTab, setViewTab] = useState(0); 
  const [filterType, setFilterType] = useState('All');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchNotifications();
    }
  }, [filterType, limit, page, viewTab, isMounted]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      await Log("frontend", "info", "api", "Accessing server-side notification stream.");
      
      const currentFilter = viewTab === 1 ? 'All' : filterType;
      const typeParam = currentFilter !== 'All' ? `&notification_type=${currentFilter}` : '';
      
      // Enforce the strict 'limit' variable directly matching the assignment guidelines
      const requestLimit = viewTab === 1 ? limit : 10;
      const url = `${API_BASE_URL}/notifications?limit=${requestLimit}&page=${page}${typeParam}`;

      const res = await fetch(url);
      const data = await res.json();
      
      console.log("Raw Ingested Proxy Data:", data);
      
      let fetchedList = [];
      
      if (data) {
        if (Array.isArray(data.notifications)) {
          fetchedList = data.notifications;
        } else if (data.data && Array.isArray(data.data.notifications)) {
          fetchedList = data.data.notifications;
        } else if (Array.isArray(data)) {
          fetchedList = data;
        } else if (data.data && Array.isArray(data.data)) {
          fetchedList = data.data;
        }
      }
      
      setNotifications(fetchedList);
      setPriorityNotifications(getPriorityNotifications(fetchedList, limit));
    } catch (err) {
      console.error("Data ingestion failure:", err.message);
      setNotifications([]);
      setPriorityNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    setReadIds(prev => {
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });
    try {
      await Log("frontend", "debug", "component", `Item closed out: ${id}`);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!isMounted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0a0e17' }}>
        <CircularProgress color="primary" />
      </div>
    );
  }

  const baseList = viewTab === 0 ? notifications : priorityNotifications;
  const safeList = Array.isArray(baseList) ? baseList : [];
  const pageCount = Math.max(1, Math.ceil(safeList.length / itemsPerPage));
  const paginatedItems = safeList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getLogIcon = (type) => {
    switch (type) {
      case 'Placement': return <SchoolIcon sx={{ color: '#00e5ff' }} />;
      case 'Result': return <AssignmentIcon sx={{ color: '#00e676' }} />;
      default: return <EventIcon sx={{ color: '#ffb300' }} />;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0e17', 
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(25, 118, 210, 0.12) 0%, transparent 50%)',
      py: 6 
    }} suppressHydrationWarning>
      <Container maxWidth="md">
        
        {/* Header Layout */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(25, 118, 210, 0.2)', width: 56, height: 56, border: '1px solid rgba(25, 118, 210, 0.3)' }}>
            <NotificationsActiveIcon sx={{ color: '#2196f3', fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', mb: 0.5 }}>
              Campus Notification Application 
            </Typography>
            <Typography variant="body2" sx={{ color: '#707e94' }}>
              it priotise campus notifications based on type and recency, providing a dynamic interface for students to stay informed about placements, results, and events.
            </Typography>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Paper sx={{ 
          mb: 4, 
          backgroundColor: '#111827', 
          borderRadius: 3, 
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden' 
        }} elevation={0} suppressHydrationWarning>
          <Tabs 
            value={viewTab} 
            onChange={(e, val) => { setViewTab(val); setPage(1); }} 
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#2196f3', height: '3px' },
              '& .MuiTab-root': { color: '#707e94', fontWeight: 600, fontSize: '0.95rem', py: 2 },
              '& .Mui-selected': { color: '#2196f3 !important' }
            }}
          >
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>All Logs</span>
                <Badge badgeContent={safeList.length - readIds.size} color="primary" max={99} sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', height: 18, minWidth: 18 } }} />
              </Box>
            } />
            <Tab label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon sx={{ fontSize: 18 }} />
                <span>Priority Inbox</span>
              </Box>
            } />
          </Tabs>
        </Paper>

        {/* Dynamic Filters Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          {viewTab === 0 ? (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ color: '#707e94', '&.Mui-focused': { color: '#2196f3' } }}>Filter Streams</InputLabel>
              <Select 
                value={filterType} 
                label="Filter Streams" 
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                sx={{ 
                  color: 'white', 
                  backgroundColor: '#111827',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.05)',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSvgIcon-root': { color: '#707e94' }
                }}
              >
                <MenuItem value="All">All Stream Items</MenuItem>
                <MenuItem value="Placement">Placements Matrix</MenuItem>
                <MenuItem value="Result">Examination Results</MenuItem>
                <MenuItem value="Event">Campus Events</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#707e94', fontWeight: 500 }}>Density Limit:</Typography>
              <FormControl size="small" sx={{ minWidth: 90 }}>
                <Select 
                  value={limit} 
                  onChange={(e) => { setLimit(e.target.value); setPage(1); }}
                  sx={{ 
                    color: 'white', backgroundColor: '#111827', borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSvgIcon-root': { color: '#707e94' }
                  }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        {/* Notification Container Canvas */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress color="primary" /></Box>
        ) : (
          <Paper sx={{ 
            backgroundColor: '#111827', 
            borderRadius: 4, 
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }} elevation={0}>
            <List disablePadding>
              {paginatedItems.length === 0 ? (
                <Box sx={{ py: 8, textAlign: 'center', color: '#707e94' }}>
                  <Typography variant="subtitle1" fontWeight={600}>No live notifications synced</Typography>
                  <Typography variant="body2" sx={{ color: '#4a5568', mt: 0.5 }}>Check terminal execution layer or authentication tokens.</Typography>
                </Box>
              ) : (
                paginatedItems.map((item, index) => {
                  const isRead = readIds.has(item.ID);
                  return (
                    <React.Fragment key={item.ID}>
                      <ListItem 
                        sx={{ 
                          py: 2.5, px: 3,
                          backgroundColor: isRead ? 'transparent' : 'rgba(33, 150, 243, 0.02)',
                          borderLeft: isRead ? '4px solid transparent' : '4px solid #2196f3',
                          transition: 'all 0.25s ease'
                        }}
                        secondaryAction={
                          !isRead && (
                            <Tooltip title="Archive Log Item" placement="left">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#4a5568', '&:hover': { color: '#00e676', backgroundColor: 'rgba(0,230,118,0.08)' } }}
                                onClick={() => handleMarkAsRead(item.ID)}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                      >
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2.5, width: '100%', pr: 4 }}>
                          <Box sx={{ mt: 0.5 }}>{getLogIcon(item.Type)}</Box>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ color: isRead ? '#707e94' : '#ffffff', fontWeight: isRead ? 500 : 700, fontSize: '1rem', transition: 'color 0.2s' }}>
                                  {item.Message}
                                </Typography>
                                <Chip 
                                  label={item.Type} 
                                  size="small" 
                                  sx={{ 
                                    height: 20, fontSize: '0.7rem', fontWeight: 700,
                                    backgroundColor: item.Type === 'Placement' ? 'rgba(0,229,255,0.1)' : item.Type === 'Result' ? 'rgba(0,230,118,0.1)' : 'rgba(255,179,0,0.1)',
                                    color: item.Type === 'Placement' ? '#00e5ff' : item.Type === 'Result' ? '#00e676' : '#ffb300',
                                    border: '1px solid rgba(255,255,255,0.03)'
                                  }} 
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: '#4a5568', fontWeight: 500 }}>
                                {new Date(item.Timestamp).toLocaleString()}
                              </Typography>
                            }
                          />
                        </Box>
                      </ListItem>
                      {index < paginatedItems.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.03)' }} />}
                    </React.Fragment>
                  );
                })
              )}
            </List>
          </Paper>
        )}

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={(e, p) => setPage(p)} 
              sx={{ 
                '& .MuiPaginationItem-root': { color: '#707e94', fontWeight: 600 },
                '& .Mui-selected': { backgroundColor: '#2196f3 !important', color: 'white' }
              }} 
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}