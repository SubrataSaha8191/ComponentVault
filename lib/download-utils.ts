import JSZip from 'jszip';
import { Component } from './firebase/types';

/**
 * Downloads a component as a ZIP file containing only the code
 * @param component - The component to download
 */
export async function downloadComponent(component: Component) {
  try {
    const zip = new JSZip();
    
    // Determine the file extension based on language
    const fileExtension = component.language === 'typescript' ? 'tsx' : 'jsx';
    
    // Get component name for filename
    const componentName = component.name || component.title || 'component';
    const fileName = `${componentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${fileExtension}`;
    
    // Add the component code to the ZIP
    zip.file(fileName, component.code);
    
    // Add a README file with component information
    const readmeContent = generateReadme(component);
    zip.file('README.md', readmeContent);
    
    // Generate the ZIP file
    const blob = await zip.generateAsync({ type: 'blob' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${componentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading component:', error);
    throw error;
  }
}

/**
 * Generates a README file content for the component
 */
function generateReadme(component: Component): string {
  const componentName = component.name || component.title || 'Component';
  
  return `# ${componentName}

${component.description}

## Details

- **Category**: ${component.category}
- **Framework**: ${component.framework}
- **Language**: ${component.language}
- **Styling**: ${component.styling}
${component.dependencies && component.dependencies.length > 0 ? `
## Dependencies

\`\`\`bash
${component.dependencies.map(dep => `npm install ${dep}`).join('\n')}
\`\`\`
` : ''}
${component.installCommand ? `
## Installation

\`\`\`bash
${component.installCommand}
\`\`\`
` : ''}
${component.usageInstructions ? `
## Usage Instructions

${component.usageInstructions}
` : ''}

## Author

${component.authorName}

---

Downloaded from Component Vault
`;
}
