const fs = require('fs');

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentCell += '"';
      i++; // Skip the escaped quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      if (char !== '\r') {
        currentCell += char;
      }
    }
  }

  // Push the last cell/row if any
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

try {
  const files = ['amazon-com-2026-09-30.csv', 'amazon-com-2026-09-30_partial.csv'];
  const formattedData = [];
  let idCounter = 1;
  const seenCategories = new Set();

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const csvContent = fs.readFileSync(file, 'utf8');
    const rows = parseCSV(csvContent);

    const header = rows[0];
    if(!header) continue;
    
    const nameIndices = [];
    const imageIndices = [];
    let categoryIndex = -1;

    for (let i = 0; i < header.length; i++) {
      const col = header[i].trim();
      if (col === 'data') categoryIndex = i;
      else if (col.startsWith('name')) nameIndices.push(i);
      else if (col.startsWith('image')) imageIndices.push(i);
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < categoryIndex || !row[categoryIndex]) continue;

      const categoryTitle = row[categoryIndex].trim();
      if (!categoryTitle || seenCategories.has(categoryTitle)) continue;

      const movies = [];

      // Assuming names and images are matched by index
      for (let j = 0; j < nameIndices.length; j++) {
        const nameIdx = nameIndices[j];
        const imgIdx = imageIndices[j];

        if (nameIdx !== undefined && imgIdx !== undefined && row[nameIdx] && row[imgIdx]) {
          const title = row[nameIdx].trim();
          const image = row[imgIdx].trim();

          if (title && image) {
            movies.push({
              id: String(idCounter++),
              title: title,
              image: image,
              category: categoryTitle,
              genre: 'Various',
              year: '2023',
              rating: 'PG-13',
              match: '95%'
            });
          }
        }
      }

      if (movies.length > 0) {
        seenCategories.add(categoryTitle);
        formattedData.push({
          title: categoryTitle,
          movies: movies
        });
      }
    }
  }

  fs.writeFileSync('./data/formattedScrapedData.json', JSON.stringify(formattedData, null, 2));
  console.log(`Successfully parsed ${formattedData.length} categories.`);
} catch (error) {
  console.error("Failed to parse CSV:", error);
}
