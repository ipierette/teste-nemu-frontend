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
    second: '2-digit',
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
 * JourneyRow component
 * Displays a single journey as a table row with touchpoints
 * 
 * @param {Object} props - Component props
 * @param {Object} props.journey - Journey data object
 */
export function JourneyRow({ journey }) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
        {journey.sessionId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {journey.userId}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {journey.touchpoints.map((touchpoint, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-md text-xs font-medium ${getBadgeColor(touchpoint.channel)}`}
              title={formatDateTime(touchpoint.timestamp)}
            >
              {touchpoint.channel}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {journey.totalTouchpoints}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDateTime(journey.startTime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDateTime(journey.endTime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDuration(journey.duration)}
      </td>
    </tr>
  );
}
