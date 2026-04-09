import fs from 'fs';

const filePath = 'src/constants.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find the DISEASES array
const diseasesMatch = content.match(/export const DISEASES: Disease\[\] = \[(.*?)\];/s);
if (diseasesMatch) {
    const diseasesContent = diseasesMatch[1];
    
    // Split into individual objects
    // This is tricky because of nested objects, but we can try to split by '  {' at the start of a line
    const diseaseBlocks = diseasesContent.split(/\n  \{/);
    
    const uniqueDiseases: string[] = [];
    const seenIds = new Set<string>();
    
    for (let block of diseaseBlocks) {
        if (!block.trim()) continue;
        
        // Add back the '{' if it was removed by split
        const fullBlock = block.startsWith('{') ? block : '  {' + block;
        
        // Extract ID
        const idMatch = fullBlock.match(/id: '(.*?)'/);
        if (idMatch) {
            const id = idMatch[1];
            if (!seenIds.has(id)) {
                seenIds.add(id);
                uniqueDiseases.push(fullBlock);
            } else {
                console.log(`Removing duplicate ID: ${id}`);
            }
        } else {
            uniqueDiseases.push(fullBlock);
        }
    }
    
    const newDiseasesContent = uniqueDiseases.join('\n');
    content = content.replace(/export const DISEASES: Disease\[\] = \[.*?\];/s, `export const DISEASES: Disease[] = [\n${newDiseasesContent}\n];`);
    
    fs.writeFileSync(filePath, content);
    console.log('Removed duplicates from DISEASES array');
} else {
    console.error('Could not find DISEASES array');
}
