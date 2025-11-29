import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import Footer from './components/Footer';
import InteractiveBackground from './components/InteractiveBackground';
import { MdError, MdSettings, MdNavigateBefore, MdNavigateNext, MdClose, MdViewList, MdViewModule, MdAttachMoney, MdShoppingCart, MdTrendingUp, MdAccessTime, MdArrowUpward, MdArrowDownward, MdInfo } from 'react-icons/md';
import './styles/globals.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const ITEMS_PER_PAGE = 20;

const CHANNEL_COLORS = {
  'google': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'facebook': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'instagram': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'organic': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'virginia': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  'sitebotão': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  'sitebotaobio': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  'mailbiz': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'diamaes': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  'colecaoinverno': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  'saleatacado': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  'freteday': 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300',
  'eurolinkbio': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  'anapaula': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300',
  'facebookads': 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  'default': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
};

function getChannelColor(channel) {
  const lowerChannel = channel.toLowerCase();
  for (const [key, value] of Object.entries(CHANNEL_COLORS)) {
    if (lowerChannel.includes(key)) return value;
  }
  return CHANNEL_COLORS.default;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  return `${minutes.toLocaleString('pt-BR')} Minutos`;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded mb-4"></div>
      {[...new Array(10)].map((_, i) => (
        <div key={`skeleton-${i}`} className="h-12 bg-gray-100 dark:bg-slate-900 rounded mb-2"></div>
      ))}
    </div>
  );
}

function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="text-center py-12">
      <MdError className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Erro ao Carregar</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
}

function ColumnSettings({ columns, onToggle, onClose }) {
  return (
    <div className="absolute right-0 top-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl p-4 z-50 min-w-[250px]">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Colunas Visíveis</h3>
      {Object.entries(columns).map(([key, value]) => (
        <label key={key} className="flex items-center gap-2 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={() => onToggle(key)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{key}</span>
        </label>
      ))}
      <button
        onClick={onClose}
        className="mt-3 w-full px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm"
      >
        Fechar
      </button>
    </div>
  );
}

function App() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    'ID': true,
    'Criado Em': true,
    'Jornada': true,
    'Valor Total': true,
    'Ticket Médio': true,
    'Vendas': true,
    'Quantidade de Jornadas': true,
    '% Quantidade': true,
    'Tempo de Conversão': true,
    'Touchpoints': true
  });
  const [modalJourney, setModalJourney] = useState(null);
  const [modalCompleteJourney, setModalCompleteJourney] = useState(null);
  const [modalVisibleCount, setModalVisibleCount] = useState(100);
  const [viewMode, setViewMode] = useState('table');
  const [showStats, setShowStats] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const loadJourneys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/journeys`);
      if (!response.ok) throw new Error('Falha ao carregar dados');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const grouped = groupJourneysByPath(data.data);
        setJourneys(grouped);
      } else {
        throw new Error('Formato de dados inválido');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function groupJourneysByPath(data) {
    return data.map(journey => ({
      sessionId: journey.sessionId,
      createdAt: journey.startTime,
      path: journey.touchpoints,
      totalValue: Math.random() * 1000000,
      sales: Math.floor(Math.random() * 5000),
      totalDuration: journey.duration,
      journeyCount: 1,
      touchpointCount: journey.touchpoints.length,
      avgTicket: 0,
      avgDuration: journey.duration,
      percentage: 0
    })).map(journey => ({
      ...journey,
      avgTicket: journey.totalValue / journey.sales
    })).sort((a, b) => b.totalValue - a.totalValue);
  }

  useEffect(() => {
    loadJourneys();
  }, []);

  useEffect(() => {
    if (journeys.length > 0) {
      const totalJourneys = journeys.length;
      for (const j of journeys) {
        j.percentage = (1 / totalJourneys) * 100;
      }
    }
  }, [journeys]);

  const toggleColumn = (columnName) => {
    setVisibleColumns(prev => ({ ...prev, [columnName]: !prev[columnName] }));
  };

  const openJourneyModal = (journey) => {
    setModalJourney(journey);
    setModalVisibleCount(100); // Reset ao abrir
  };

  const closeJourneyModal = () => {
    setModalJourney(null);
    setModalVisibleCount(100);
  };

  const calculateStats = () => {
    const totalValue = journeys.reduce((sum, j) => sum + j.totalValue, 0);
    const totalSales = journeys.reduce((sum, j) => sum + j.sales, 0);
    const totalJourneys = journeys.length;
    const avgDuration = journeys.reduce((sum, j) => sum + j.avgDuration, 0) / journeys.length || 0;
    
    return {
      totalValue,
      totalSales,
      totalJourneys,
      avgDuration,
      avgTicket: totalValue / totalSales || 0
    };
  };

  const stats = journeys.length > 0 ? calculateStats() : null;

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredJourneys = journeys.filter(journey => {
    if (!searchTerm.trim()) return true;
    return journey.sessionId?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Memoização: processa jornadas apenas quando mudam
  const processedJourneys = useMemo(() => {
    return filteredJourneys.map(journey => ({
      ...journey,
      displayPath: journey.path?.slice(0, 5) || [],
      shouldTruncate: (journey.path?.length || 0) > 5
    }));
  }, [filteredJourneys]);

  const sortedJourneys = [...processedJourneys].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedJourneys.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJourneys = sortedJourneys.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      <InteractiveBackground />
      <ThemeToggle />
      
      <div className="relative z-10">
        <header className="border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Análise de Jornada do Usuário
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              Rastreie e analise interações de pontos de contato do usuário em diversos canais
            </p>
            
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-3">
              <MdInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Sobre os dados exibidos</p>
                <div className="space-y-1">
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">📊 Dados da Tabela (reais):</span> ID, Criado Em, Jornada (touchpoints), Touchpoints
                  </p>
                  <p className="text-blue-800 dark:text-blue-400">
                    <span className="font-medium">📈 Estatísticas e tabela (simuladas/mock):</span> Valor Total, Ticket Médio, Vendas, Tempo de Conversão, Quantidade de Jornadas, % Quantidade
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar por ID
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Digite o ID da jornada..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              {searchTerm && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {filteredJourneys.length} {filteredJourneys.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {loading && <LoadingSkeleton />}
          
          {error && <ErrorDisplay message={error} onRetry={loadJourneys} />}
          
          {!loading && !error && journeys.length > 0 && (
            <>
              <div className="mb-4 flex flex-wrap gap-3 justify-between items-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {journeys.length} jornadas encontradas
                </p>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-900 dark:text-gray-100 text-sm"
                  >
                    {showStats ? 'Esconder' : 'Mostrar'} Estatísticas
                  </button>
                  
                  <div className="flex gap-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                      title="Visualizar em Lista"
                    >
                      <MdViewList className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-2 rounded transition-colors ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                      title="Visualizar em Cards"
                    >
                      <MdViewModule className="w-5 h-5" />
                    </button>
                  </div>

                  {viewMode === 'table' && (
                    <div className="relative">
                      <button
                        onClick={() => setShowColumnSettings(!showColumnSettings)}
                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-900 dark:text-gray-100"
                      >
                        <MdSettings className="w-5 h-5" />
                        <span className="text-sm">Colunas</span>
                      </button>
                      {showColumnSettings && (
                        <ColumnSettings
                          columns={visibleColumns}
                          onToggle={toggleColumn}
                          onClose={() => setShowColumnSettings(false)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {showStats && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">Valor Total</span>
                      <MdAttachMoney className="w-6 h-6 opacity-75" />
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
                    <p className="text-xs opacity-75 mt-1">Receita acumulada</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">Vendas</span>
                      <MdShoppingCart className="w-6 h-6 opacity-75" />
                    </div>
                    <p className="text-2xl font-bold">{stats.totalSales.toLocaleString('pt-BR')}</p>
                    <p className="text-xs opacity-75 mt-1">Total de vendas</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">Ticket Médio</span>
                      <MdTrendingUp className="w-6 h-6 opacity-75" />
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(stats.avgTicket)}</p>
                    <p className="text-xs opacity-75 mt-1">Valor médio por venda</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">Jornadas</span>
                      <MdViewModule className="w-6 h-6 opacity-75" />
                    </div>
                    <p className="text-2xl font-bold">{stats.totalJourneys.toLocaleString('pt-BR')}</p>
                    <p className="text-xs opacity-75 mt-1">Total de jornadas</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium opacity-90">Tempo Médio</span>
                      <MdAccessTime className="w-6 h-6 opacity-75" />
                    </div>
                    <p className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</p>
                    <p className="text-xs opacity-75 mt-1">Duração média</p>
                  </div>
                </div>
              )}

              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                  {paginatedJourneys.map((journey, idx) => {
                    const globalIndex = startIndex + idx;
                    const shouldTruncate = journey.path.length > 5;
                    const displayPath = shouldTruncate ? journey.path.slice(0, 5) : journey.path;
                    
                    return (
                      <div key={`card-${globalIndex}`} className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="text-xs opacity-75 mb-1">ID da Jornada</p>
                              <p className="font-mono text-sm font-semibold">{journey.sessionId}</p>
                            </div>
                            <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                              {journey.touchpointCount} touchpoints
                            </span>
                          </div>
                          <p className="text-xs opacity-90">{formatDate(journey.createdAt)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-200 dark:border-slate-700">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Valor Total</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(journey.totalValue)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vendas</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{journey.sales.toLocaleString('pt-BR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ticket Médio</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(journey.avgTicket)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">% Quantidade</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{journey.percentage.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Qtd Jornadas</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{journey.journeyCount.toLocaleString('pt-BR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tempo Conversão</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDuration(journey.avgDuration)}</p>
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">JORNADA</p>
                          <div className="flex flex-wrap gap-2">
                            {displayPath.map((touchpoint, tIdx) => (
                              <div key={`card-touch-${touchpoint.channel}-${tIdx}`} className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(touchpoint.channel)}`}>
                                  {touchpoint.channel}
                                </span>
                                {tIdx < displayPath.length - 1 && (
                                  <span className="text-gray-400 dark:text-gray-600">→</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex gap-2">
                            {shouldTruncate && (
                              <button
                                onClick={() => openJourneyModal(journey)}
                                className="flex-1 px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-medium"
                                title="Exibir todos os touchpoints tratados (com remoção de duplicatas)"
                              >
                                Ver mais ({journey.path.length} canais)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {viewMode === 'table' && (
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                      <tr>
                        {visibleColumns['ID'] && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                        )}
                        {visibleColumns['Criado Em'] && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            <button
                              onClick={toggleSortOrder}
                              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              Criado Em
                              {sortOrder === 'asc' ? (
                                <MdArrowUpward className="w-4 h-4" />
                              ) : (
                                <MdArrowDownward className="w-4 h-4" />
                              )}
                            </button>
                          </th>
                        )}
                        {visibleColumns['Jornada'] && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Jornada
                          </th>
                        )}
                        {visibleColumns['Valor Total'] && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Valor Total
                          </th>
                        )}
                        {visibleColumns['Ticket Médio'] && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Ticket Médio
                          </th>
                        )}
                        {visibleColumns['Vendas'] && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Vendas
                          </th>
                        )}
                        {visibleColumns['Quantidade de Jornadas'] && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Qtd Jornadas
                          </th>
                        )}
                        {visibleColumns['% Quantidade'] && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            % Qtd
                          </th>
                        )}
                        {visibleColumns['Tempo de Conversão'] && (
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Tempo Conversão
                          </th>
                        )}
                        {visibleColumns['Touchpoints'] && (
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Touchpoints
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedJourneys.map((journey, idx) => {
                        const globalIndex = startIndex + idx;
                        const shouldTruncate = journey.path.length > 5;
                        const displayPath = shouldTruncate ? journey.path.slice(0, 5) : journey.path;
                        
                        return (
                        <tr key={`journey-${globalIndex}`} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          {visibleColumns['ID'] && (
                            <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">
                              {journey.sessionId || '-'}
                            </td>
                          )}
                          {visibleColumns['Criado Em'] && (
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(journey.createdAt)}
                            </td>
                          )}
                          {visibleColumns['Jornada'] && (
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                {displayPath.map((touchpoint, tIdx) => (
                                  <div key={`${touchpoint.channel}-${tIdx}`} className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getChannelColor(touchpoint.channel)}`}>
                                      {touchpoint.channel}
                                    </span>
                                    {tIdx < displayPath.length - 1 && (
                                      <span className="text-gray-400 dark:text-gray-600">→</span>
                                    )}
                                  </div>
                                ))}
                                {shouldTruncate && (
                                  <button
                                    onClick={() => openJourneyModal(journey)}
                                    className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                    title="Exibir todos os touchpoints tratados (com remoção de duplicatas)"
                                  >
                                    Ver mais ({journey.path.length})
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                          {visibleColumns['Valor Total'] && (
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(journey.totalValue)}
                            </td>
                          )}
                          {visibleColumns['Ticket Médio'] && (
                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                              {formatCurrency(journey.avgTicket)}
                            </td>
                          )}
                          {visibleColumns['Vendas'] && (
                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                              {journey.sales.toLocaleString('pt-BR')}
                            </td>
                          )}
                          {visibleColumns['Quantidade de Jornadas'] && (
                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                              {journey.journeyCount.toLocaleString('pt-BR')}
                            </td>
                          )}
                          {visibleColumns['% Quantidade'] && (
                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                              {journey.percentage.toFixed(2)}%
                            </td>
                          )}
                          {visibleColumns['Tempo de Conversão'] && (
                            <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                              {formatDuration(journey.avgDuration)}
                            </td>
                          )}
                          {visibleColumns['Touchpoints'] && (
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                              {journey.touchpointCount}
                            </td>
                          )}
                        </tr>
                      );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              )}

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-gray-100"
                  >
                    <MdNavigateBefore />
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...new Array(totalPages)].map((_, i) => (
                      <button
                        key={`page-${i + 1}`}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-gray-100"
                  >
                    Próximo
                    <MdNavigateNext />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />

      {modalJourney && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeJourneyModal}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Jornada Tratada
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {modalJourney.path.length} touchpoints • ID: {modalJourney.sessionId}
                </p>
                {modalJourney.path.length > 1000 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ⚡ Jornada grande - usando virtualização para melhor performance
                  </p>
                )}
              </div>
              <button
                onClick={closeJourneyModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <MdClose className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              {/* Renderização otimizada com lazy loading para todas as jornadas */}
              <div className="flex flex-wrap gap-3">
                {modalJourney.path.slice(0, modalVisibleCount).map((touchpoint, tIdx) => (
                  <div key={`modal-${touchpoint.channel}-${tIdx}`} className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getChannelColor(touchpoint.channel)}`}>
                      {touchpoint.channel}
                    </span>
                    {tIdx < modalJourney.path.length - 1 && (
                      <span className="text-gray-400 dark:text-gray-600 text-lg">→</span>
                    )}
                  </div>
                ))}
              </div>
              
              {modalJourney.path.length > modalVisibleCount && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setModalVisibleCount(prev => Math.min(prev + 200, modalJourney.path.length))}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    ⚡ Carregar mais {Math.min(200, modalJourney.path.length - modalVisibleCount)} touchpoints
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Mostrando {modalVisibleCount} de {modalJourney.path.length}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={closeJourneyModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
