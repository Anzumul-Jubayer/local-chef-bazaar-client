import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  HiChevronUp, 
  HiChevronDown, 
  HiSearch,
  HiEye,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle
} from 'react-icons/hi';

const DataTable = ({ data = [], columns = [], title }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sort data
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableData;
  }, [data, sortConfig]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    
    return sortedData.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <HiChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <HiChevronUp className="w-4 h-4 text-primary" />
      : <HiChevronDown className="w-4 h-4 text-primary" />;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <HiCheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
      case 'processing':
        return <HiClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'cancelled':
      case 'failed':
        return <HiXCircle className="w-4 h-4 text-error" />;
      default:
        return <HiExclamationCircle className="w-4 h-4 text-info" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return `${baseClasses} bg-success/10 text-success`;
      case 'pending':
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case 'cancelled':
      case 'failed':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-info/10 text-info`;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCellContent = (item, column) => {
    const value = item[column.key];
    
    switch (column.type) {
      case 'currency':
        return formatCurrency(value);
      case 'date':
        return formatDate(value);
      case 'status':
        return (
          <span className={getStatusBadge(value)}>
            {getStatusIcon(value)}
            <span className="capitalize">{value}</span>
          </span>
        );
      case 'image':
        return value ? (
          <img 
            src={value} 
            alt="Item" 
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center">
            <HiEye className="w-4 h-4 text-muted" />
          </div>
        );
      case 'truncate':
        return (
          <span title={value} className="truncate max-w-xs block">
            {value}
          </span>
        );
      default:
        return value;
    }
  };

  if (!data.length) {
    return (
      <div className="card-modern p-8 text-center">
        <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiEye className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-base-content mb-2">No Data Available</h3>
        <p className="text-muted">There's no data to display at the moment.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-modern p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-base-content">{title}</h3>
          <p className="text-sm text-muted">{filteredData.length} total items</p>
        </div>
        
        {/* Search */}
        <div className="relative mt-4 sm:mt-0">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 font-medium text-sm text-muted ${
                    column.sortable ? 'cursor-pointer hover:text-base-content' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <motion.tr
                key={item.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-200 hover:bg-hover transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm text-base-content">
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-muted">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 hover:bg-hover'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;
