// GitHub Activity JavaScript
// This script fetches the latest public commits from GitHub for user vader941
// and displays them in the GitHub Activity section

// GitHub username - this is your username
const GITHUB_USERNAME = 'vader941';

// GitHub API endpoint for user events (includes commits)
// Using the public events endpoint to see if this gives different results
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`;

// State for showing collapsed or expanded view
let isExpanded = false;

/**
 * Calculate how long ago a date was in a human-readable format
 * @param {string} dateString - ISO date string from GitHub API
 * @returns {string} - Human readable time difference (e.g., "2 hours ago")
 */
function getTimeAgo(dateString) {
  const now = new Date();
  const commitDate = new Date(dateString);
  
  // Debug: Log the dates to see what we're working with
  console.log('Current time:', now.toISOString());
  console.log('Commit time:', commitDate.toISOString());
  
  const diffInSeconds = Math.floor((now - commitDate) / 1000);
  
  // Debug: Log the time difference
  console.log('Time difference in seconds:', diffInSeconds);
  
  // Convert seconds to appropriate time unit
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

/**
 * Parse and format commit messages to make them more readable
 * @param {string} rawMessage - Raw commit message from GitHub
 * @returns {string} - Formatted HTML for the commit message
 */
function formatCommitMessage(rawMessage) {
  // Clean up the message and remove extra whitespace
  let message = rawMessage.trim();
  
  // Check if this is a conventional commit (feat:, fix:, style:, etc.)
  const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|test|chore|types|perf|ci|build)(\(.+?\))?\s*:\s*/i;
  const match = message.match(conventionalCommitRegex);
  
  let formattedMessage = '';
  
  if (match) {
    // This is a conventional commit - format it nicely
    const type = match[1].toLowerCase();
    const scope = match[2] || '';
    const typeColor = getCommitTypeColor(type);
    
    // Remove the conventional commit prefix
    const mainMessage = message.replace(conventionalCommitRegex, '');
    
    // Split by bullet points (lines starting with -)
    const parts = mainMessage.split(/\n\s*-\s+/).filter(part => part.trim());
    const title = parts[0].trim();
    const bulletPoints = parts.slice(1);
    
    // Create the formatted message
    formattedMessage = `
      <span class="commit-type" style="color: ${typeColor}; font-weight: bold;">
        ${type.toUpperCase()}${scope}:
      </span> 
      <span class="commit-title">${title}</span>
    `;
    
    // Add bullet points if they exist
    if (bulletPoints.length > 0) {
      formattedMessage += '<div class="commit-details">';
      bulletPoints.forEach(point => {
        if (point.trim()) {
          formattedMessage += `<div class="commit-bullet">• ${point.trim()}</div>`;
        }
      });
      formattedMessage += '</div>';
    }
  } else {
    // Regular commit message - just clean it up and add line breaks
    const lines = message.split('\n').filter(line => line.trim());
    const title = lines[0];
    const description = lines.slice(1);
    
    formattedMessage = `<span class="commit-title">${title}</span>`;
    
    if (description.length > 0) {
      formattedMessage += '<div class="commit-details">';
      description.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          // Check if line starts with - (bullet point)
          if (trimmedLine.startsWith('-')) {
            formattedMessage += `<div class="commit-bullet">• ${trimmedLine.substring(1).trim()}</div>`;
          } else {
            formattedMessage += `<div class="commit-line">${trimmedLine}</div>`;
          }
        }
      });
      formattedMessage += '</div>';
    }
  }
  
  return formattedMessage;
}

/**
 * Get color for different commit types
 * @param {string} type - The commit type (feat, fix, etc.)
 * @returns {string} - CSS color value
 */
function getCommitTypeColor(type) {
  const colors = {
    'feat': '#00ffe7',     // Blue-green for new features
    'fix': '#e94560',      // Red for bug fixes
    'style': '#a259f7',    // Purple for styling
    'docs': '#ffd700',     // Gold for documentation
    'refactor': '#ff9500', // Orange for refactoring
    'test': '#32cd32',     // Green for tests
    'chore': '#87ceeb',    // Light blue for chores
    'types': '#ff69b4',    // Pink for type definitions
    'perf': '#ff6347',     // Tomato for performance
    'ci': '#9370db',       // Medium purple for CI
    'build': '#20b2aa'     // Light sea green for build
  };
  
  return colors[type] || '#e0e6ed'; // Default color
}
/**
 * Create HTML for a single commit card
 * @param {Object} commit - Commit data from GitHub API
 * @param {boolean} isVisible - Whether this card should be visible initially
 * @returns {string} - HTML string for the commit card
 */
function createCommitCard(commit, isVisible = true) {
  const repoName = commit.repo.name.split('/')[1]; // Get just the repo name, not username/repo
  const rawCommitMessage = commit.payload.commits[0].message;
  const formattedMessage = formatCommitMessage(rawCommitMessage);
  const timeAgo = getTimeAgo(commit.created_at);
  const commitHash = commit.payload.commits[0].sha.substring(0, 7); // First 7 characters
  const filesChanged = commit.payload.size || 1; // Number of commits in the push
  
  // Add a class to hide cards beyond the first 3
  const visibilityClass = isVisible ? '' : ' style="display: none;"';
  const extraClass = isVisible ? '' : ' extra-commit';
  
  return `
    <div class="commit-card${extraClass}"${visibilityClass}>
      <div class="commit-header">
        <span class="commit-repo">${repoName}</span>
        <span class="commit-date">${timeAgo}</span>
      </div>
      <div class="commit-message">${formattedMessage}</div>
      <div class="commit-footer">
        <span class="commit-hash">#${commitHash}</span>
        <span class="commit-files">${filesChanged} commit${filesChanged > 1 ? 's' : ''}</span>
      </div>
    </div>
  `;
}

/**
 * Display error message when GitHub API fails or no commits found
 * @param {string} message - Error message to display
 */
function displayError(message) {
  const container = document.querySelector('.github-activity-container');
  if (container) {
    container.innerHTML = `
      <div class="commit-card">
        <div class="commit-header">
          <span class="commit-repo">GitHub Activity</span>
          <span class="commit-date">Error</span>
        </div>
        <p class="commit-message">${message}</p>
        <div class="commit-footer">
          <span class="commit-hash">#error</span>
          <span class="commit-files">0 commits</span>
        </div>
      </div>
    `;
  }
}

/**
 * Create the expand/collapse toggle button
 * @param {number} totalCommits - Total number of commits available
 * @returns {string} - HTML string for the toggle button
 */
function createToggleButton(totalCommits) {
  let toggleButton = '';
  
  if (totalCommits > 3) {
    const hiddenCount = totalCommits - 3;
    toggleButton = `
      <button class="github-toggle-btn" onclick="toggleGitHubActivity()">
        <span class="toggle-text">Show ${hiddenCount} more commit${hiddenCount > 1 ? 's' : ''}</span>
        <span class="toggle-arrow">▼</span>
      </button>
    `;
  }
  
  // Always add a refresh button
  const refreshButton = `
    <button class="github-refresh-btn" onclick="fetchGitHubActivity()" title="Refresh GitHub activity">
      <span>🔄 Refresh</span>
    </button>
  `;
  
  return `
    <div class="github-toggle-container">
      ${toggleButton}
      ${refreshButton}
    </div>
  `;
}

/**
 * Toggle the expanded/collapsed state of GitHub activity
 */
function toggleGitHubActivity() {
  isExpanded = !isExpanded;
  
  // Get all extra commit cards
  const extraCommits = document.querySelectorAll('.extra-commit');
  const toggleBtn = document.querySelector('.github-toggle-btn');
  const toggleText = document.querySelector('.toggle-text');
  const toggleArrow = document.querySelector('.toggle-arrow');
  
  if (isExpanded) {
    // Show all commits
    extraCommits.forEach(card => {
      card.style.display = 'block';
    });
    toggleText.textContent = 'Show less';
    toggleArrow.textContent = '▲';
  } else {
    // Hide extra commits
    extraCommits.forEach(card => {
      card.style.display = 'none';
    });
    const hiddenCount = extraCommits.length;
    toggleText.textContent = `Show ${hiddenCount} more commit${hiddenCount > 1 ? 's' : ''}`;
    toggleArrow.textContent = '▼';
  }
}
function displayLoading() {
  const container = document.querySelector('.github-activity-container');
  if (container) {
    container.innerHTML = `
      <div class="commit-card">
        <div class="commit-header">
          <span class="commit-repo">Loading...</span>
          <span class="commit-date">Please wait</span>
        </div>
        <p class="commit-message">Fetching latest commits from GitHub...</p>
        <div class="commit-footer">
          <span class="commit-hash">#loading</span>
          <span class="commit-files">...</span>
        </div>
      </div>
    `;
  }
}

/**
 * Fetch and display GitHub commits
 * This is the main function that gets called when the page loads
 */
async function fetchGitHubActivity() {
  // Show loading message first
  displayLoading();
  
  try {
    // Make API request to GitHub with cache-busting to get fresh data
    const cacheBuster = Date.now();
    const response = await fetch(`${GITHUB_API_URL}&_cb=${cacheBuster}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PersonalPortfolio/1.0'
      }
    });
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }
    
    // Parse the JSON response
    const events = await response.json();
    
    // Debug: Log all events to see what we're getting
    console.log('All GitHub events:', events);
    console.log('Total events received:', events.length);
    
    // Filter for push events (commits) and get up to 10 most recent
    const pushEvents = events.filter(event => {
      const isPushEvent = event.type === 'PushEvent';
      const hasCommits = event.payload && event.payload.commits && event.payload.commits.length > 0;
      
      // Debug: Log what we're filtering
      if (isPushEvent) {
        console.log('Found push event:', {
          repo: event.repo.name,
          date: event.created_at,
          commits: event.payload.commits?.length || 0
        });
      }
      
      return isPushEvent && hasCommits;
    }).slice(0, 10); // Get up to 10 commits
    
    console.log('Filtered push events:', pushEvents.length);
    
    // Check if we found any commits
    if (pushEvents.length === 0) {
      // Show more helpful error message with debug info
      const latestEventDate = events.length > 0 ? events[0].created_at : 'No events found';
      displayError(`No recent commits found. Latest GitHub activity: ${latestEventDate}. Check back later for updates!`);
      return;
    }
    
    // Generate HTML for all commit cards (first 3 visible, rest hidden)
    const commitsHTML = pushEvents.map((commit, index) => 
      createCommitCard(commit, index < 3)
    ).join('');
    
    // Create toggle button if we have more than 3 commits
    const toggleButtonHTML = createToggleButton(pushEvents.length);
    
    // Update the page with real commit data and toggle button
    const container = document.querySelector('.github-activity-container');
    if (container) {
      container.innerHTML = commitsHTML + toggleButtonHTML;
    }
    
    // Reset the expanded state
    isExpanded = false;
    
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching GitHub activity:', error);
    displayError('Unable to load GitHub activity. Please check your internet connection.');
  }
}

// Wait for the page to fully load, then fetch GitHub activity
document.addEventListener('DOMContentLoaded', fetchGitHubActivity);
