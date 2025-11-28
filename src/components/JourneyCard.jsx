/**
 * Gets badge color based on channel name
 * Provides consistent color coding for different touchpoint channels
 * 
 * @param {string} channel - The channel name
 * @returns {string} Tailwind CSS classes for badge styling
 */
function getBadgeColor(channel) {
  const colors = {
    email: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    sms: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    push: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    web: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    app: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    whatsapp: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  };

  const normalized = channel.toLowerCase();
  return colors[normalized] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
}

/**
 * Formats ISO datetime to readable format
 * 
 * @param {string} isoString - ISO datetime string
 * @returns {string} Formatted datetime string
 */
function formatDateTime(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formats duration in milliseconds to readable format
 * 
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * JourneyCard component
 * Displays a single journey as a card (alternative to table row)
 * Better for mobile/responsive layouts
 * 
 * @param {Object} props - Component props
 * @param {Object} props.journey - Journey data object
 */
export function JourneyCard({ journey }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Sessão: {journey.sessionId}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usuário: {journey.userId}
          </p>
        </div>
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
          {journey.totalTouchpoints} pontos de contato
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Caminho da Jornada:
        </h4>
        <div className="flex flex-wrap gap-2">
          {journey.touchpoints.map((touchpoint, index) => (
            <span
              key={`${journey.sessionId}-${touchpoint.channel}-${index}`}
              className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(touchpoint.channel)}`}
              title={formatDateTime(touchpoint.timestamp)}
            >
              {touchpoint.channel}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Início:</span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {formatDateTime(journey.startTime)}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Fim:</span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {formatDateTime(journey.endTime)}
          </p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 dark:text-gray-400">Duração:</span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {formatDuration(journey.duration)}
          </p>
        </div>
      </div>
    </div>
  );
}
