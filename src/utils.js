const fs = require('fs');
// const path = require('path'); // Commented out - not used in this file

function readConfig(configPath) {
  console.log('Reading configuration from:', configPath);
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config;
  } catch (error) {
    console.error('Failed to read config:', error);
    return null;
  }
}

const formatDate = (date) => {
  console.debug('Formatting date:', date);
  if (!date) return '';

  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

async function fetchData(url) {
  console.info(`Fetching data from: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Data fetched successfully');
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  if (!isValid) {
    console.warn('Invalid email:', email);
  }

  return isValid;
};

function processArray(arr) {
  console.group('Array Processing');
  console.log('Input array:', arr);

  const result = arr.map((item) => {
    console.log('Processing item:', item);
    return item * 2;
  });

  console.log('Result:', result);
  console.groupEnd();

  return result;
}

const measurePerformance = (fn, ...args) => {
  console.time('Performance');
  const result = fn(...args);
  console.timeEnd('Performance');
  return result;
};

module.exports = {
  readConfig,
  formatDate,
  fetchData,
  validateEmail,
  processArray,
  measurePerformance,
};
